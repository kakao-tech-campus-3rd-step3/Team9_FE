import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { UserStudyInfo } from '@/types';
import { getUserStudyInfo } from '@/services/users/getUserStudyInfo';
import { useAuthStore } from '@/stores/auth';

// 특정 스터디 페이지에서 현재 스터디 정보 동기화 훅
// - studyId가 없으면 아무 것도 하지 않음
// - 마운트 시 정보 로드, 언마운트 시 해제
export const useCurrentStudy = (studyId?: number) => {
  const setCurrentStudy = useAuthStore((s) => s.setCurrentStudy);

  const query = useQuery({
    queryKey: ['userStudyInfo', studyId],
    queryFn: async (): Promise<UserStudyInfo> =>
      getUserStudyInfo(studyId as number),
    enabled: typeof studyId === 'number',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 쿼리 결과에 따른 스토어 동기화
  useEffect(() => {
    if (query.data) {
      setCurrentStudy({ title: query.data.title, role: query.data.role });
    }
    if (query.error) {
      setCurrentStudy(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, query.error]);

  useEffect(() => {
    return () => {
      setCurrentStudy(null);
    };
  }, [setCurrentStudy]);

  return { loading: query.isLoading, error: query.error } as const;
};
