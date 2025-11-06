import { useQuery } from '@tanstack/react-query';
import { schedulePastService } from '../services/scheduleService';

/**
 * 회고 작성 가능한 과거 스터디 일정 조회 훅
 */
export const useSchedulePastQuery = (studyId: number) => {
  return useQuery({
    queryKey: ['schedule-past', studyId],
    queryFn: () => schedulePastService(studyId),
    enabled: Number.isFinite(studyId) && studyId > 0,
    staleTime: 0, // 즉시 stale로 처리하여 항상 최신 데이터 가져오기
    refetchOnMount: true, // 컴포넌트 마운트 시 자동 refetch
    refetchOnWindowFocus: true, // 창 포커스 시 자동 refetch
  });
};
