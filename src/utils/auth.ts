/**
 * 토큰 관리 유틸리티
 * 세션 스토리지 기반 + 선택적 쿠키 저장
 */
import dayjs from 'dayjs';
import { TOKEN_KEYS, REMEMBER_ME } from '@/constants';

/**
 * 쿠키 유틸 (객체 기반)
 * - 단순 쿠키 set/get/remove를 제공
 * - 보안 옵션은 필요 시 확장(예: Secure, domain) 가능
 */
export const cookieStorage = {
  // 쿠키 저장 (기본 만료: 30일)
  set: (name: string, value: string, days: number = 30): void => {
    const expires = dayjs().add(days, 'day').toDate();
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  },
  // 쿠키 조회 (없으면 null)
  get: (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  },
  // 쿠키 삭제 (즉시 만료 처리)
  remove: (name: string): void => {
    document.cookie = `${name}=;expires=${dayjs(0).toDate().toUTCString()};path=/;`;
  },
};

/**
 * 토큰 관리 (세션 스토리지)
 * - 세션 스토리지에 액세스 토큰 저장/조회/삭제 제공
 * - 사용처: 로그인 성공 시 저장, API 요청 인터셉터에서 조회/401 시 삭제
 */
export const accessTokenStorage = {
  // 액세스 토큰 저장
  set: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEYS.ACCESS, token);
  },
  // 액세스 토큰 조회 (없으면 null)
  get: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEYS.ACCESS);
  },
  // 액세스 토큰 삭제
  remove: (): void => {
    sessionStorage.removeItem(TOKEN_KEYS.ACCESS);
  },
  // 저장 여부
  has: (): boolean => {
    return Boolean(accessTokenStorage.get()?.trim());
  },
};

/**
 * 아이디 기억하기 (쿠키 헬퍼 함수 기반)
 */

// 아이디(이메일) 기억 여부 설정
export const setRememberedEmail = (email: string): void => {
  setCookie(REMEMBER_ME.EMAIL_KEY, email, REMEMBER_ME.EXPIRY_DAYS);
};

// 아이디(이메일) 기억 여부 조회
export const getRememberedEmail = (): string | null => {
  return getCookie(REMEMBER_ME.EMAIL_KEY);
};

// 아이디(이메일) 기억 여부 삭제
export const removeRememberedEmail = (): void => {
  removeCookie(REMEMBER_ME.EMAIL_KEY);
};

// 아이디(이메일) 기억 여부 확인
export const hasRememberedEmail = (): boolean => {
  return Boolean(getRememberedEmail()?.trim());
};
