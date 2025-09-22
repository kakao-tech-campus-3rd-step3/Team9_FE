import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../types';
import { ROUTES } from '@/constants';
import { loginService } from '../services';
import { accessTokenStorage } from '@/utils';

/**
 * 로그인 뮤테이션 훅
 * - TanStack Query를 사용한 로그인 API 호출
 * - 성공 시 토큰 저장 및 홈페이지 이동
 * - 에러 처리는 API 인터셉터에서 통일 관리
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => loginService(data),
    onSuccess: (result) => {
      // 토큰 저장 후 홈페이지로 이동
      if (result?.accessToken) {
        accessTokenStorage.set(result.accessToken);
      }
      navigate(ROUTES.HOME);
    },
    // 에러 토스트는 API 인터셉터에서 통일 처리
  });
};
