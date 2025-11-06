import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getUserProfile } from '@/services/users/getUserProfile';
import { useAuthStore } from '@/stores/auth';
import { mapUserProfileToAuthUser } from '@/utils/mappers';
import { downloadImageService } from '@/services/images/downloadImage';
import { userKeys } from '@/constants/queryKeys';
import type { UserProfile } from '@/types';

/**
 * 사용자 프로필 조회 및 스토어 동기화 훅
 * - TanStack Query의 select 기능으로 데이터 변환
 * - useEffect로 스토어 동기화
 */
export const useLoadUserProfile = () => {
  const { setUser, setUserImageUrl } = useAuthStore();

  // 사용자 프로필 조회 (select로 데이터 변환, TanStack Query 최대 활용)
  const profileQuery = useQuery({
    queryKey: userKeys.profile(),
    queryFn: async (): Promise<UserProfile> => getUserProfile(),
    select: (data: UserProfile) => mapUserProfileToAuthUser(data), // 데이터 변환을 쿼리 레벨에서
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: false, // 백엔드 서버 문제로 임시 비활성화
  });

  // 스토어 동기화: 데이터 변경 시 스토어 업데이트
  useEffect(() => {
    const run = async () => {
      if (!profileQuery.data) return;
      setUser(profileQuery.data);

      // 이미지 키가 있으면 이미지 URL도 로드
      if (profileQuery.data.imageKey) {
        try {
          const imageUrl = await downloadImageService.getImagePresignedUrl(
            profileQuery.data.imageKey,
          );
          setUserImageUrl(imageUrl);
        } catch (error) {
          console.warn('이미지 URL 로드 실패:', error);
        }
      }
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQuery.data, setUser, setUserImageUrl]);

  return {
    ...profileQuery,
  };
};

// Suspense 버전
export const useLoadUserProfileSuspense = () => {
  const { setUser } = useAuthStore();

  // 사용자 프로필 조회 (Suspense 버전)
  const profileQuery = useSuspenseQuery({
    queryKey: userKeys.profile(),
    queryFn: async (): Promise<UserProfile> => getUserProfile(),
    select: (data: UserProfile) => mapUserProfileToAuthUser(data),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 스토어 동기화: 데이터 변경 시 스토어 업데이트 (이미지 URL 제외)
  useEffect(() => {
    if (profileQuery.data) {
      setUser(profileQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQuery.data, setUser]);

  return {
    ...profileQuery,
  };
};
