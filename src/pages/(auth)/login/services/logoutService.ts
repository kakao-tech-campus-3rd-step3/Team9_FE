import apiClient from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import { useAuthStore } from '@/stores/auth';

export const logoutService = async (): Promise<void> => {
  try {
    // 서버에 로그아웃 요청 (HttpOnly 쿠키의 리프레시 토큰을 무효화)
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {}, { showToast: false });
  } finally {
    // 로컬 상태 초기화 (메모리의 액세스 토큰 제거)
    const { reset } = useAuthStore.getState();
    reset();
  }
};
