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
    staleTime: 5 * 60 * 1000, // 5분
  });
};
