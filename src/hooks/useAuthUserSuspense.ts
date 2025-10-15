import { useAuthStore } from '@/stores/auth';
import { useAuthStatus } from './auth/useAuthStatus';

/**
 * Suspense 기반 사용자 인증 정보 훅
 * - 인증 초기화가 완료될 때까지 Promise를 던져서 Suspense fallback 표시
 * - 초기화 완료 후 사용자 정보 반환
 */
export const useAuthUserSuspense = () => {
  const { user, isInitialized, isInitializing } = useAuthStore();
  const { isAuthenticated } = useAuthStatus();

  // 인증 초기화 중이면 Promise를 던져서 Suspense fallback 표시
  if (!isInitialized || isInitializing) {
    throw new Promise<void>((resolve) => {
      // 인증 초기화가 완료되면 Promise resolve
      const unsubscribe = useAuthStore.subscribe((state) => {
        if (state.isInitialized && !state.isInitializing) {
          unsubscribe();
          resolve();
        }
      });
    });
  }

  // 초기화 완료 후 사용자 정보 반환
  return {
    user,
    isAuthenticated,
    isInitialized,
  };
};

/**
 * Suspense 기반 인증 상태 훅 (비로그인 사용자용)
 * - 인증 상태가 확실해질 때까지 Promise를 던져서 Suspense fallback 표시
 */
export const useAuthStatusSuspense = () => {
  const { isInitialized, isInitializing } = useAuthStore();
  const { isAuthenticated } = useAuthStatus();

  // 인증 상태가 불확실하면 Promise를 던져서 Suspense fallback 표시
  if (!isInitialized || isInitializing) {
    throw new Promise<void>((resolve) => {
      const unsubscribe = useAuthStore.subscribe((state) => {
        if (state.isInitialized && !state.isInitializing) {
          unsubscribe();
          resolve();
        }
      });
    });
  }

  // 인증 상태가 확실해진 후 반환
  return {
    isAuthenticated,
    isInitialized,
  };
};
