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
  const { reset, setIsInitialized } = useAuthStore();

  return useMutation({
    // 즉시 UX 응답: 낙관적 내비게이션 + 스토어 리셋
    onMutate: () => {
      reset();
      // 초기화 완료 상태를 유지하여 게스트 UI가 즉시 렌더링되도록 보장
      setIsInitialized(true);
      navigate(ROUTES.LOGIN, { replace: true });
    },
    // 서버 요청은 백그라운드로 처리 (실패해도 UX 영향 최소화)
    mutationFn: async () => {
      try {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT, null, {
          showToast: false,
          withCredentials: true,
        });
      } catch {
        // ignore
      }
    },
    onError: () => {
      toast.error(
        '로그아웃 요청에 실패했어요. 네트워크를 확인한 뒤 다시 시도해주세요.',
      );
    },
  });
};
