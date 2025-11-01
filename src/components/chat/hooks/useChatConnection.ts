import { useState, useCallback, useEffect, useRef } from 'react';
import { chatService } from '../chatService';
import { useAuthStore } from '@/stores/auth';
import { getConnectionErrorMessage } from '../utils/errorUtils';
import type { ChatConnectionState } from '../types';

// 연결 상태 인디케이터(연결됨/재연결 중) 관리 및 WebSocket 연결/해제 처리
export function useChatConnection() {
  const [connectionState, setConnectionState] = useState<ChatConnectionState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
  });
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // 초기 상태는 연결되지 않은 상태로 설정
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const connectWebSocket = useCallback(async () => {
    try {
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: true,
        isReconnecting: false,
        error: undefined,
      }));

      const accessToken = useAuthStore.getState().accessToken;
      if (!accessToken) {
        throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
      }

      // 연결 상태 변화 구독 (한 번만 설정)
      if (!unsubscribeRef.current) {
        const unsubscribe = chatService.onConnectionStateChange((state) => {
          setConnectionState((prev) => ({
            ...prev,
            isConnected: state.isConnected,
            isConnecting: state.isConnecting,
            isReconnecting: state.isConnecting && !state.isConnected,
            error: state.error,
          }));
        });
        unsubscribeRef.current = unsubscribe;
      }

      await chatService.connect();
    } catch (error) {
      setConnectionState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        isReconnecting: false,
        error: getConnectionErrorMessage(error),
      }));

      console.error('❌ [useChatConnection] 연결 실패:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    chatService.disconnect();
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
    });
  }, []);

  return {
    connectionState,
    connectWebSocket,
    disconnect,
  };
}
