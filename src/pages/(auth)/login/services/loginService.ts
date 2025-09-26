import { publicClient } from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import type { LoginPayload } from '../types';

/**
 * 로그인 서비스 (axios thin)
 */
export const loginService = async (
  payload: LoginPayload,
): Promise<{ accessToken: string; refreshToken?: string }> => {
  const { data } = await publicClient.post<{
    token?: string;
    refreshToken?: string;
  }>(AUTH_ENDPOINTS.LOGIN, payload);

  if (!data?.token) {
    throw new Error('로그인 응답에 token이 없습니다.');
  }

  return { accessToken: data.token, refreshToken: data.refreshToken };
};
