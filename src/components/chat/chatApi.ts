// 채팅 기록 조회 API (커서 기반 페이지네이션: hasNext, nextCursor)
import apiClient from '@/api';
import { CHAT_ENDPOINTS } from '@/api/constants';
import { QUERY_CONFIG } from './config';
import { transformServerMessages } from './utils';
import type { ChatHistoryResponse, ServerChatHistoryResponse } from './types';

export const chatApi = {
  // 채팅 기록 조회 (커서 기반 페이지네이션: 무한 스크롤 지원)
  async getChatHistory(
    studyId: string,
    cursor?: string,
    size: number = QUERY_CONFIG.DEFAULT_SIZE,
  ): Promise<ChatHistoryResponse> {
    const params = new URLSearchParams({ size: size.toString() });
    if (cursor) params.append('cursor', cursor);

    const response = await apiClient.get<ServerChatHistoryResponse>(
      CHAT_ENDPOINTS.CHAT_HISTORY(studyId),
      { params },
    );

    // 서버 응답의 userId를 사용하여 본인 메시지 판별
    return {
      userId: response.data.userId,
      messages: transformServerMessages(
        response.data.messages,
        response.data.userId,
      ).reverse(),
      hasNext: response.data.hasNext,
      nextCursor: response.data.nextCursor?.toString(),
    };
  },
};
