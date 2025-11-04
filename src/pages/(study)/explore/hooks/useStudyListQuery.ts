/**
 * 스터디 목록 조회 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { studyKeys } from '@/constants/queryKeys';
import { getStudyList } from '../services';

export const useStudyListQuery = () => {
  return useQuery({
    queryKey: studyKeys.all,
    queryFn: getStudyList,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  });
};
