import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../types';
import { ROUTES } from '@/constants';
import { loginService } from '../services';
import { setAccessToken } from '@/utils';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      loginService.login(data, { showToast: false }),
    onSuccess: (result) => {
      // 토큰 저장 후 이동
      if (result?.accessToken) {
        setAccessToken(result.accessToken);
      }
      navigate(ROUTES.HOME);
    },
    // 에러 토스트는 인터셉터에서 통일 처리
  });
};
