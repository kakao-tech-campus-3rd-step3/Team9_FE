import apiClient from '@/api';
import type { AxiosError } from 'axios';
import type { LoginFormData } from '../types';

/**
 * 로그인 서비스
 * - JSON-server를 통한 사용자 인증 처리
 * - 성공 시 임시 accessToken 발급 (실제 서버 연동 전까지)
 * - 에러 처리 및 토스트 메시지 옵션 지원
 */
export const loginService = {
  login: async (
    payload: LoginFormData,
    options?: { showToast?: boolean },
  ): Promise<{ accessToken: string } | never> => {
    const { email, password } = payload;

    // JSON-server를 통한 사용자 인증
    const { data } = await apiClient.get(`/users`, {
      params: { email, password },
      showToast: options?.showToast ?? false, // 로그인은 기본적으로 토스트 숨김
    });

    if (Array.isArray(data) && data.length > 0) {
      // TODO: 실제 서버 연동 시 이 부분을 제거하고 서버에서 받은 토큰 사용
      // 임시 토큰 생성 (JSON-server 환경용)
      const mockToken = btoa(`${email}:${Date.now()}`);
      return { accessToken: mockToken };
    }

    // TODO: 실제 서버 연동 시 이 부분을 제거하고 서버 에러 응답 사용
    const mockError = {
      response: {
        status: 401,
        data: { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      },
    } as AxiosError<{ message: string }>;
    throw mockError;
  },
} as const;
