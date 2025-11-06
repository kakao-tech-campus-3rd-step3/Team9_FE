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
    staleTime: 0, // 캐시 무효화 시 즉시 refetch되도록 설정
    refetchOnWindowFocus: true, // 윈도우 포커스 시 refetch
  });
};
