import { useEffect, useMemo } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import type { UserStudyInfo } from '@/types';
import { getUserStudyInfo } from '@/services/users/getUserStudyInfo';
import { useAuthStore } from '@/stores/auth';
import { studyKeys } from '@/constants/queryKeys';

// 특정 스터디 페이지에서 현재 스터디 정보 동기화 훅
// - studyId가 없으면 아무 것도 하지 않음
// - select로 데이터 변환, useMemo로 성능 최적화
export const useCurrentStudy = (studyId?: number) => {
  const setCurrentStudy = useAuthStore((s) => s.setCurrentStudy);

  const query = useQuery({
    queryKey: studyKeys.detail(String(studyId)),
    queryFn: async (): Promise<UserStudyInfo> =>
      getUserStudyInfo(studyId as number),
    select: (data: UserStudyInfo) => ({ title: data.title, role: data.role }), // 필요한 데이터만 추출
    enabled: typeof studyId === 'number',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 변환된 데이터를 메모이제이션
  const studyInfo = useMemo(() => query.data, [query.data]);

  // 스토어 동기화: studyInfo 변경 시 스토어 업데이트
  useEffect(() => {
    if (studyInfo) {
      setCurrentStudy(studyInfo);
    } else if (query.error) {
      setCurrentStudy(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyInfo, query.error, setCurrentStudy]);

  return {
    data: studyInfo,
    loading: query.isLoading,
    error: query.error,
  } as const;
};

// Suspense 버전
export const useCurrentStudySuspense = (studyId: number) => {
  const setCurrentStudy = useAuthStore((s) => s.setCurrentStudy);

  const query = useSuspenseQuery({
    queryKey: studyKeys.detail(String(studyId)),
    queryFn: async (): Promise<UserStudyInfo> => getUserStudyInfo(studyId),
    select: (data: UserStudyInfo) => ({ title: data.title, role: data.role }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 변환된 데이터를 메모이제이션
  const studyInfo = useMemo(() => query.data, [query.data]);

  // 스토어 동기화: studyInfo 변경 시 스토어 업데이트
  useEffect(() => {
    if (studyInfo) {
      setCurrentStudy(studyInfo);
    } else if (query.error) {
      setCurrentStudy(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyInfo, query.error, setCurrentStudy]);

  return {
    data: studyInfo,
    loading: query.isLoading,
    error: query.error,
  } as const;
};
