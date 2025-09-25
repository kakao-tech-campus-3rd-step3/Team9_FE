/**
 * 인증 관련 유틸리티
 * - 쿠키 관리, 토큰 관리, 인증 초기화를 통합 관리
 */
import dayjs from 'dayjs';
import { REMEMBER_ME } from '@/constants';
import { refreshTokenService } from '@/pages/(auth)/login/services';
import { getUserProfile } from '@/services';
import { useAuthStore } from '@/stores/auth';
import { mapUserProfileToAuthUser } from '@/utils/mappers';

/**
 * 쿠키 관리
 */
export const CookieManager = {
  set: (name: string, value: string, days: number = 30): void => {
    const expires = dayjs().add(days, 'day').toDate();
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  },
  get: (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  },
  remove: (name: string): void => {
    document.cookie = `${name}=;expires=${dayjs(0).toDate().toUTCString()};path=/;`;
  },
} as const;

/**
 * 아이디 기억하기 관리
 */
export const RememberedEmail = {
  set: (email: string): void => {
    CookieManager.set(REMEMBER_ME.EMAIL_KEY, email, REMEMBER_ME.EXPIRY_DAYS);
  },
  get: (): string | null => CookieManager.get(REMEMBER_ME.EMAIL_KEY),
  remove: (): void => CookieManager.remove(REMEMBER_ME.EMAIL_KEY),
  has: (): boolean => Boolean(RememberedEmail.get()?.trim()),
} as const;

/**
 * 토큰 관리
 */
export const TokenManager = {
  /**
   * 토큰 새로고침 (스토어 업데이트 포함)
   */
  refreshAccessToken: async (): Promise<boolean> => {
    try {
      const result = await refreshTokenService();
      if (result?.accessToken) {
        useAuthStore.getState().setAccessToken(result.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * 새 액세스 토큰 요청 (스토어 업데이트 없이 토큰만 반환)
   */
  getNewAccessToken: async (): Promise<string | null> => {
    try {
      const result = await refreshTokenService();
      return result?.accessToken || null;
    } catch {
      return null;
    }
  },
} as const;

/**
 * 인증 초기화 관리
 */
let isInitializing = false;

export const AuthInitializer = {
  init: async (): Promise<void> => {
    if (isInitializing) return;
    isInitializing = true;

    const { setIsInitialized, isInitialized } = useAuthStore.getState();

    if (isInitialized) {
      isInitializing = false;
      return;
    }

    try {
      const refreshSuccess = await TokenManager.refreshAccessToken();
      if (refreshSuccess) {
        await loadUserProfile();
      }
    } catch (error) {
      console.log('인증 초기화 실패:', error);
    } finally {
      setIsInitialized(true);
      isInitializing = false;
    }
  },
} as const;

/**
 * 프로필 로드 및 스토어 동기화 공통 함수
 */
export const loadUserProfile = async (): Promise<void> => {
  const { setUser, setIsLogin } = useAuthStore.getState();
  try {
    const profile = await getUserProfile();
    setUser(mapUserProfileToAuthUser(profile));
    setIsLogin(true);
  } catch (error) {
    console.warn('프로필 로드 실패:', error);
    throw error; // 호출자가 에러 처리 결정하도록
  }
};
