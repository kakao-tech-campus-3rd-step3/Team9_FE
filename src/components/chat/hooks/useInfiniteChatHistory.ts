import { useInfiniteQuery } from '@tanstack/react-query';
import { chatApi } from '../chatApi';
import { chatKeys } from '@/constants/queryKeys';
import { QUERY_CONFIG } from '../config';

interface UseInfiniteChatHistoryOptions {
  studyId?: string;
  size?: number;
  enabled?: boolean;
}

// 무한 스크롤 채팅 기록 조회 훅
export function useInfiniteChatHistory({
  studyId,
  size = QUERY_CONFIG.DEFAULT_SIZE,
  enabled = true,
}: UseInfiniteChatHistoryOptions) {
  return useInfiniteQuery({
    queryKey: chatKeys.history(studyId || ''),
    queryFn: ({ pageParam }) => {
      if (!studyId) throw new Error('studyId is required');
      return chatApi.getChatHistory(studyId, pageParam, size);
    },
    enabled: enabled && !!studyId,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
  });
}
