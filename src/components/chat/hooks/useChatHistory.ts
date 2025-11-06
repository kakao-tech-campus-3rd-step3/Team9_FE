// 채팅 기록 조회 훅 (커서 기반 페이지네이션)
import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../chatApi';
import { chatKeys } from '@/constants/queryKeys';
import { QUERY_CONFIG } from '../config';

interface UseChatHistoryOptions {
  studyId?: string;
  cursor?: string;
  size?: number;
  enabled?: boolean;
}

export function useChatHistory({
  studyId,
  cursor,
  size = QUERY_CONFIG.DEFAULT_SIZE,
  enabled = true,
}: UseChatHistoryOptions) {
  return useQuery({
    queryKey: chatKeys.historyWithCursor(studyId || '', cursor),
    queryFn: () => {
      if (!studyId) throw new Error('studyId is required');
      return chatApi.getChatHistory(studyId, cursor, size);
    },
    enabled: enabled && !!studyId,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
  });
}
