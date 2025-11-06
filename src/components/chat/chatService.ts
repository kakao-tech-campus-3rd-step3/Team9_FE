import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/stores/auth';
import {
  CHAT_SERVICE_CONFIG,
  DEBUG_KEYWORDS,
  RECONNECT_CONFIG,
} from './constants';
import { WS_CONFIG } from './config';
import { buildTopicUrl, buildDestinationUrl } from './utils';
import type { ChatMessage, ChatConnectionState } from './types';

// stompjs + SockJS 클라이언트 설정 및 자동 재연결 기능을 제공하는 실시간 채팅 서비스
export class ChatService {
  private client: Client | null = null;
  private _isConnected = false;
  private _isConnecting = false;
  private messageSubscribers = new Map<
    string,
    (message: ChatMessage) => void
  >();
  private activeSubscriptions = new Map<string, { unsubscribe: () => void }>();
  private connectionStateListeners = new Set<
    (state: ChatConnectionState) => void
  >();
  private reconnectAttempts = 0;

  get isConnected(): boolean {
    return this._isConnected;
  }

  get isConnecting(): boolean {
    return this._isConnecting;
  }

  get connectionState(): ChatConnectionState {
    return {
      isConnected: this._isConnected,
      isConnecting: this._isConnecting,
      isReconnecting: false,
    };
  }

  onConnectionStateChange(
    callback: (state: ChatConnectionState) => void,
  ): () => void {
    this.connectionStateListeners.add(callback);
    return () => this.connectionStateListeners.delete(callback);
  }

  private updateState(isConnected: boolean, isConnecting: boolean) {
    this._isConnected = isConnected;
    this._isConnecting = isConnecting;
    this.notifyStateChange();
  }

  private notifyStateChange() {
    this.connectionStateListeners.forEach((listener) =>
      listener(this.connectionState),
    );
  }

  private requireClient(): Client {
    if (!this.client) throw new Error('Client not initialized');
    if (!this._isConnected) throw new Error('Client not connected');
    return this.client;
  }

  private createClient() {
    const base = CHAT_SERVICE_CONFIG.API_BASE_URL.replace(/\/+$/, '');
    const path = `/${String(CHAT_SERVICE_CONFIG.WEBSOCKET_PATH).replace(/^\/+/, '')}`;
    const wsUrl = `${base}${path}`;
    const socket = new SockJS(wsUrl);

    this.client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        const shouldLog = DEBUG_KEYWORDS.some((keyword) =>
          str.includes(keyword),
        );
        if (shouldLog) console.log('STOMP:', str);
      },
      heartbeatIncoming: CHAT_SERVICE_CONFIG.HEARTBEAT_INTERVAL,
      heartbeatOutgoing: CHAT_SERVICE_CONFIG.HEARTBEAT_INTERVAL,
    });
  }

  // STOMP 이벤트 핸들러 설정
  private setupHandlers(
    resolve: () => void,
    reject: (error: Error) => void,
    timeout: ReturnType<typeof setTimeout>,
  ) {
    if (!this.client) return;

    const handleError = (message: string) => {
      this.updateState(false, false);
      clearTimeout(timeout);
      reject(new Error(message));
    };

    this.client.onConnect = () => {
      this.updateState(true, false);
      this.reconnectAttempts = 0;
      clearTimeout(timeout);
      resolve();
    };

    this.client.onStompError = (frame) => {
      handleError(frame.headers.message || 'STOMP 연결 실패');
    };

    this.client.onWebSocketClose = (event) => {
      const shouldReconnect =
        event.code !== WS_CONFIG.NORMAL_CLOSE_CODE &&
        this.reconnectAttempts < CHAT_SERVICE_CONFIG.MAX_RECONNECT_ATTEMPTS;
      if (shouldReconnect) this.scheduleReconnect();
      handleError(`연결 종료: ${event.code} - ${event.reason}`);
    };

    this.client.onWebSocketError = (error) => {
      handleError(error.message || 'WebSocket 에러');
    };

    const accessToken = useAuthStore.getState().accessToken;
    this.client.connectHeaders = { Authorization: `Bearer ${accessToken}` };
  }

  async connect(): Promise<void> {
    if (this._isConnected || this._isConnecting) return;

    if (!this.client) this.createClient();

    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }

    this.updateState(false, true);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.updateState(false, false);
        reject(new Error('연결 타임아웃'));
      }, CHAT_SERVICE_CONFIG.CONNECTION_TIMEOUT);

      this.setupHandlers(resolve, reject, timeout);
      this.client!.activate();
    });
  }

  // 자동 재연결: 연결 실패 시 지수 백오프 방식으로 재시도
  private scheduleReconnect() {
    if (this.reconnectAttempts >= CHAT_SERVICE_CONFIG.MAX_RECONNECT_ATTEMPTS)
      return;

    const delay =
      RECONNECT_CONFIG.INITIAL_DELAY *
      Math.pow(RECONNECT_CONFIG.BACKOFF_MULTIPLIER, this.reconnectAttempts++);

    setTimeout(() => {
      if (!this._isConnected && !this._isConnecting) {
        this.connect().catch(() => {
          /* 재연결 실패는 이미 핸들링됨 */
        });
      }
    }, delay);
  }

  private parseIncomingMessage(rawMessage: IMessage): unknown {
    try {
      return JSON.parse(rawMessage.body);
    } catch (error) {
      console.error('❌ [ChatService] 메시지 파싱 실패:', error);
      return null;
    }
  }

  subscribeToChat(
    studyId: string,
    callback: (rawMessage: unknown) => void,
  ): void {
    const client = this.requireClient();
    const topic = buildTopicUrl(studyId);

    // 기존 구독이 있으면 먼저 해제
    this.unsubscribeFromChat(studyId);

    // 새 구독 생성
    const subscription = client.subscribe(topic, (message: IMessage) => {
      const parsedMessage = this.parseIncomingMessage(message);
      if (parsedMessage) callback(parsedMessage);
    });

    // 구독 객체와 콜백 저장
    this.activeSubscriptions.set(studyId, subscription);
    this.messageSubscribers.set(
      studyId,
      callback as (message: ChatMessage) => void,
    );
  }

  unsubscribeFromChat(studyId: string) {
    // STOMP 구독 해제
    const subscription = this.activeSubscriptions.get(studyId);
    if (subscription) {
      subscription.unsubscribe();
      this.activeSubscriptions.delete(studyId);
    }

    // 콜백 제거
    this.messageSubscribers.delete(studyId);
  }

  async sendMessage(studyId: string, content: string): Promise<void> {
    const client = this.requireClient();
    const destination = buildDestinationUrl(studyId);

    client.publish({
      destination,
      body: JSON.stringify({ content }),
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.reset();
    }
  }

  private reset() {
    // 모든 활성 구독 해제
    this.activeSubscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.activeSubscriptions.clear();

    this.updateState(false, false);
    this.messageSubscribers.clear();
    this.connectionStateListeners.clear();
    this.reconnectAttempts = 0;
    // 다음 연결 시 새로운 SockJS/STOMP 클라이언트를 생성하도록 초기화
    this.client = null;
  }
}

export const chatService = new ChatService();
