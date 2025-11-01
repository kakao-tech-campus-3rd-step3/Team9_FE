// 서버 메시지를 클라이언트 메시지로 변환 (userId를 사용하여 본인 메시지 판별)
import { convertUtcToKoreanTime } from './timeUtils';
import type { ChatMessage, ServerChatMessage } from '../types';

// 단일 서버 메시지를 클라이언트 메시지로 변환
export function transformServerMessage(
  msg: ServerChatMessage,
  currentUserId?: number,
): ChatMessage {
  return {
    id: `msg-${msg.messageId}`,
    messageId: msg.messageId,
    messageType: msg.messageType,
    content: msg.content,
    senderId: msg.senderId.toString(),
    senderName: msg.senderName,
    timestamp: convertUtcToKoreanTime(msg.createdAt),
    isOwn: currentUserId !== undefined && msg.senderId === currentUserId,
    link: msg.link,
    likeCount: msg.likeCount,
    dislikeCount: msg.dislikeCount,
    unreadMemberCount: msg.unreadMemberCount,
  };
}

// 서버 메시지 배열을 클라이언트 메시지 배열로 일괄 변환
export function transformServerMessages(
  messages: ServerChatMessage[],
  currentUserId?: number,
): ChatMessage[] {
  return messages.map((msg) => transformServerMessage(msg, currentUserId));
}
