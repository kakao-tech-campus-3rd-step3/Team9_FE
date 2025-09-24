import { publicClient } from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import type { LoginPayload } from '../types';

/**
 * 로그인 서비스 함수 (단일 함수 형태)
 * - 실제 인증 API 연동 (POST /auth/login)
 * - 성공 시 서버에서 내려준 accessToken 반환
 * - 인터셉터를 우회하기 위해 publicClient 사용
 */
export const loginService = async (
  payload: LoginPayload,
): Promise<{ accessToken: string; refreshToken?: string }> => {
  // 실제 서버 인증 요청
  const { data } = await publicClient.post<{
    token?: string;
    refreshToken?: string;
  }>(AUTH_ENDPOINTS.LOGIN, payload);

  // 서버에서 토큰이 오지 않는 예외 상황 방어 (간결화)
  if (!data?.token) {
    // TODO: 필요 시 공통 에러 유틸로 승격 (ex. createResponseError)
    throw new Error('로그인 응답에 token이 없습니다.');
  }

  // 서버의 token 키를 클라이언트 표준 accessToken으로 매핑
  return { accessToken: data.token, refreshToken: data.refreshToken };
};
