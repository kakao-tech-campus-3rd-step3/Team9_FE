import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import { useAuthStore } from '@/stores/auth';
import { ROUTES } from '@/constants';

/**
 * 로그아웃 뮤테이션 훅
 * - 기존 logoutService 재사용 (스토어 초기화 로직 포함)
 * - 성공/실패 상관없이 로그인 페이지로 이동
 */
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { reset, setIsLogin } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {}, { showToast: false });
      } finally {
        setIsLogin(false);
        reset();
      }
    },
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
      // 로그아웃 실패해도 로그인 페이지로 이동
      navigate(ROUTES.LOGIN);
    },
  });
};
