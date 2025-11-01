import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginPayload } from '../../types';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/stores/auth';
import { loadAndCacheAuthUser } from '@/utils/authUserLoader';
import { loginService } from '../../services';

/**
 * 로그인 뮤테이션 훅
 * - TanStack Query를 사용한 로그인 API 호출
 * - 성공 시 토큰을 메모리에 저장하고 홈페이지로 이동
 * - 에러 처리는 API 인터셉터에서 통일 관리
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setAccessToken, setIsInitialized } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginService(payload),
    onSuccess: async (result) => {
      // 액세스 토큰을 메모리에 저장 (리프레시 토큰은 HttpOnly 쿠키로 자동 관리)
      if ((result as { accessToken?: string })?.accessToken) {
        const accessToken = (result as { accessToken: string }).accessToken;
        setAccessToken(accessToken);

        // 인증 상태를 초기화됨으로 표시 (프로필 로드와 관계없이)
        setIsInitialized(true);

        // 프로필 로드 (백그라운드에서 처리, 실패해도 진행)
        loadAndCacheAuthUser().catch((error) => {
          console.warn('프로필 로드 실패:', error);
        });

        // 즉시 홈으로 이동
        navigate(ROUTES.HOME);
      }
    },
    // 에러 토스트는 API 인터셉터에서 통일 처리
  });
};
