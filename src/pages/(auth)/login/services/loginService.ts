import apiClient from '@/api';
import type { LoginFormData } from '../types';
import { AUTH_ENDPOINTS } from '@/api/constants';

/**
 * 로그인 서비스 함수 (단일 함수 형태)
 * - 실제 인증 API 연동 (POST /auth/login)
 * - 성공 시 서버에서 내려준 accessToken 반환
 * - 에러 처리는 인터셉터에서 통일 관리, 옵션으로 토스트 제어 가능
 */
export const loginService = async (
  payload: LoginFormData,
  options?: { showToast?: boolean },
): Promise<{ accessToken: string }> => {
  // 실제 서버 인증 요청
  const { data } = await apiClient.post<{ token?: string }>(
    AUTH_ENDPOINTS.LOGIN,
    payload,
    {
      showToast: options?.showToast ?? false, // 로그인은 기본적으로 토스트 숨김
    },
  );

  // 서버에서 토큰이 오지 않는 예외 상황 방어 (간결화)
  if (!data?.token) {
    // TODO: 필요 시 공통 에러 유틸로 승격 (ex. createResponseError)
    throw new Error('로그인 응답에 token이 없습니다.');
  }

  // 서버의 token 키를 클라이언트 표준 accessToken으로 매핑
  return { accessToken: data.token };
};
