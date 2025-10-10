import { getUserProfile } from '@/services/users/getUserProfile';
import { downloadImageService } from '@/services/images/downloadImage';
import { useAuthStore } from '@/stores/auth';
import { mapUserProfileToAuthUser } from '@/utils/mappers';

/**
 * 공통 프로필 로더: 사용자 프로필을 조회하고 전역 스토어에 동기화
 * - 이미지 키가 유효하면 presigned URL도 조회하여 캐시
 */
export const loadAndCacheAuthUser = async (): Promise<void> => {
  const { setUser, setUserImageUrl } = useAuthStore.getState();

  const profile = await getUserProfile();
  const authUser = mapUserProfileToAuthUser(profile);
  setUser(authUser);

  const imageKey = String(authUser.imageKey || '').trim();
  if (imageKey && imageKey.toLowerCase() !== 'null' && imageKey.length > 5) {
    try {
      const imageUrl =
        await downloadImageService.getImagePresignedUrl(imageKey);
      setUserImageUrl(imageUrl);
    } catch {
      // ignore image failures
    }
  }
};
