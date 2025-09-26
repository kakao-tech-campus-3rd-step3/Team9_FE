import { publicClient } from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';

/**
 * 토큰 재발급 서비스
 * - HttpOnly 쿠키의 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
 * - 사일런트 리프레시 및 401 에러 처리에서 사용
 * - 인터셉터를 우회하기 위해 publicClient 사용
 */
export const refreshTokenService = async (): Promise<{
  accessToken: string;
} | null> => {
  try {
    const { data } = await publicClient.post<{ token?: string }>(
      AUTH_ENDPOINTS.REFRESH,
      {},
    );

    if (data?.token) {
      return { accessToken: data.token };
    }
    return null;
  } catch {
    return null;
  }
};
