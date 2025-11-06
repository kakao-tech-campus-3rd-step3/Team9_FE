import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import { useAuthStore } from '@/stores/auth';
import { ROUTES } from '@/constants';
import { queryClient } from '@/libs/queryClient';
import { chatService } from '@/components/chat/chatService';

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
      // React Query 캐시를 먼저 정리하여 이전 계정 데이터 잔존 방지
      queryClient.clear();
      // 실시간 연결 해제하여 이전 토큰/세션으로 송신되는 문제 방지
      try {
        chatService.disconnect();
      } catch (error) {
        if (import.meta.env.DEV) {
          // 로그아웃 시점에 이미 해제된 상태일 수 있으므로 경고만 남김
          // eslint-disable-next-line no-console
          console.warn('[logout] chatService.disconnect() 실패', error);
        }
      }
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
