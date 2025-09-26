import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getUserProfile } from '@/services/users/getUserProfile';
import { useAuthStore } from '@/stores/auth';
import { mapUserProfileToAuthUser } from '@/utils/mappers';
import { downloadImageService } from '@/services/images/downloadImage';
import type { UserProfile } from '@/types';

/**
 * 사용자 프로필 조회 및 스토어 동기화 훅
 * - TanStack Query의 캐싱 활용
 * - 스토어와 자동 동기화
 */
export const useLoadUserProfile = () => {
  const { setUser, setUserImageUrl, setIsLogin } = useAuthStore();

  // 사용자 프로필 조회 (쿼리 중심, onSuccess로 스토어 동기화)
  const profileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<UserProfile> => getUserProfile(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: false, // 필요 시 명시적으로 refetch
  });

  // 쿼리 데이터 동기화: data 변경 시 스토어 업데이트
  useEffect(() => {
    const run = async () => {
      if (!profileQuery.data) return;
      const authUser = mapUserProfileToAuthUser(profileQuery.data);
      setUser(authUser);
      setIsLogin(true);

      if (authUser.imageKey) {
        try {
          const imageUrl = await downloadImageService.getImagePresignedUrl(
            authUser.imageKey,
          );
          setUserImageUrl(imageUrl);
        } catch (error) {
          console.warn('이미지 URL 로드 실패:', error);
        }
      }
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQuery.data]);

  return {
    ...profileQuery,
  };
};
