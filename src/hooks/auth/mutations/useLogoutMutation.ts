import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const { reset } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT, null, {
          showToast: false,
          withCredentials: true,
        });
      } finally {
        reset();
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 로그인 페이지로 이동
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      toast.error(
        '로그아웃 요청에 실패했어요. 네트워크를 확인한 뒤 다시 시도해주세요.',
      );
    },
  });
};
