import { useEffect } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { UserStudyInfo } from '@/types';
import { getUserStudyInfo } from '@/services/users/getUserStudyInfo';
import { useAuthStore } from '@/stores/auth';
import { studyKeys } from '@/constants/queryKeys';
import { ROUTES } from '@/constants';

// 특정 스터디 페이지에서 현재 스터디 정보 동기화 훅
// - studyId가 없으면 아무 것도 하지 않음
export const useCurrentStudy = (studyId?: number) => {
  const setCurrentStudy = useAuthStore((s) => s.setCurrentStudy);
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: studyKeys.detail(String(studyId)),
    queryFn: async (): Promise<UserStudyInfo> =>
      getUserStudyInfo(studyId as number),
    select: (data: UserStudyInfo) => ({
      study_id: studyId,
      title: data.title,
      role: data.role,
    }), // 필요한 데이터만 추출
    enabled: typeof studyId === 'number',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // 403 에러는 재시도하지 않음
      if (error instanceof AxiosError && error.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // 스토어 동기화: 데이터 변경 시 스토어 업데이트
  useEffect(() => {
    if (query.data) {
      setCurrentStudy(query.data);
    } else if (query.error) {
      setCurrentStudy(null);
      // 403 에러 발생 시 스터디 탐색 페이지로 리다이렉트
      if (
        query.error instanceof AxiosError &&
        query.error.response?.status === 403
      ) {
        navigate(`/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.EXPLORE}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, query.error, setCurrentStudy, navigate]);

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error,
  } as const;
};

// Suspense 버전
export const useCurrentStudySuspense = (studyId: number) => {
  const setCurrentStudy = useAuthStore((s) => s.setCurrentStudy);

  const query = useSuspenseQuery({
    queryKey: studyKeys.detail(String(studyId)),
    queryFn: async (): Promise<UserStudyInfo> => {
      try {
        return await getUserStudyInfo(studyId);
      } catch (error) {
        // 403 에러 처리: 스터디 접근 권한 없음
        if (error instanceof AxiosError && error.response?.status === 403) {
          // 에러를 다시 throw하여 Suspense boundary에서 처리하도록 함
          // 하지만 이렇게 하면 크래시가 발생하므로, ErrorBoundary에서 처리하도록 함
        }
        throw error;
      }
    },
    select: (data: UserStudyInfo) => ({ title: data.title, role: data.role }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // 403 에러는 재시도하지 않음
      if (error instanceof AxiosError && error.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // 스토어 동기화: 데이터 변경 시 스토어 업데이트
  useEffect(() => {
    if (query.data) {
      setCurrentStudy(query.data);
    } else if (query.error) {
      setCurrentStudy(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, query.error, setCurrentStudy]);

  return {
    data: query.data,
    error: query.error,
  } as const;
};
