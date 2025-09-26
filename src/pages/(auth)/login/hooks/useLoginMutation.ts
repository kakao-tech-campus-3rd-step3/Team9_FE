import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginPayload } from '../types';
import { ROUTES } from '@/constants';
import { loginService } from '../services';
import { useAuthStore } from '@/stores/auth';
import { loadUserProfile } from '@/utils';

/**
 * 로그인 뮤테이션 훅
 * - TanStack Query를 사용한 로그인 API 호출
 * - 성공 시 토큰을 메모리에 저장하고 홈페이지로 이동
 * - 에러 처리는 API 인터셉터에서 통일 관리
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginPayload) => loginService(data),
    onSuccess: async (result) => {
      // 액세스 토큰을 메모리에 저장 (리프레시 토큰은 HttpOnly 쿠키로 자동 관리)
      if (result?.accessToken) {
        setAccessToken(result.accessToken);

        try {
          // 공통 프로필 로드 함수 사용
          await loadUserProfile();
        } catch (error) {
          console.warn('프로필 로드 실패:', error);
          // 프로필 로드 실패해도 로그인은 유지
        }
      }
      navigate(ROUTES.HOME);
    },
    // 에러 토스트는 API 인터셉터에서 통일 처리
  });
};
