// 채팅 메시지 타입 정의
export type MessageType = 'CHAT' | 'NOTICE' | 'SCHEDULE';

// 클라이언트에서 사용하는 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  messageId: number;
  messageType: MessageType;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isOwn: boolean;
  link?: string;
  likeCount?: number;
  dislikeCount?: number;
  unreadMemberCount?: number;
  isOptimistic?: boolean; // 낙관적 업데이트 메시지 여부
}

// 채팅 연결 상태 타입
export interface ChatConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  error?: string;
}

// 서버에서 받은 채팅 메시지 타입 (API 응답)
export interface ServerChatMessage {
  messageId: number;
  messageType: MessageType;
  senderId: number | null; // 시스템 메시지의 경우 null일 수 있음
  senderName: string;
  content: string;
  link?: string;
  likeCount?: number;
  dislikeCount?: number;
  unreadMemberCount?: number;
  createdAt: string; // ISO 8601 형식
}

// 채팅 기록 조회 API 응답 타입
export interface ServerChatHistoryResponse {
  userId: number;
  messages: ServerChatMessage[];
  hasNext: boolean;
  nextCursor?: number;
}

// 클라이언트에서 사용하는 채팅 기록 응답 타입
export interface ChatHistoryResponse {
  userId?: number;
  messages: ChatMessage[];
  hasNext: boolean;
  nextCursor?: string;
}
