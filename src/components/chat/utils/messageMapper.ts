// WebSocket 실시간 메시지 파싱 및 변환 유틸리티
import { convertUtcToKoreanTime, getCurrentKoreanTime } from './timeUtils';
import type { ChatMessage } from '../types';

// 타임스탬프 추출 (실시간 메시지용)
const extractTimestamp = (parsed: Record<string, unknown>): Date => {
  const serverTimestamp = parsed.createdAt || parsed.timestamp;
  return serverTimestamp
    ? convertUtcToKoreanTime(String(serverTimestamp))
    : getCurrentKoreanTime();
};

// WebSocket을 통해 받은 실시간 메시지를 클라이언트 ChatMessage로 변환 (userId로 본인 메시지 판별)
export function mapServerMessageToChatMessage(
  parsed: Record<string, unknown>,
  currentUserId?: number,
): ChatMessage {
  const senderId = parsed.senderId as number | undefined;
  const isOwn =
    currentUserId !== undefined &&
    senderId !== undefined &&
    senderId === currentUserId;

  return {
    id: (parsed.id as string) || String(Date.now()),
    messageId: (parsed.messageId as number) || Date.now(),
    messageType:
      (parsed.messageType as 'CHAT' | 'NOTICE' | 'SCHEDULE') || 'CHAT',
    content: (parsed.content as string) || '',
    senderId: String(parsed.senderId || 'unknown'),
    senderName: (parsed.senderName as string) || '알 수 없음',
    timestamp: extractTimestamp(parsed),
    isOwn,
    link: parsed.link as string | undefined,
    likeCount: parsed.likeCount as number | undefined,
    dislikeCount: parsed.dislikeCount as number | undefined,
    unreadMemberCount: parsed.unreadMemberCount as number | undefined,
  };
}
