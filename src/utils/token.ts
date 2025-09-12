/**
 * 토큰 관리 유틸리티
 * 세션 스토리지 기반 + 선택적 쿠키 저장
 */
import dayjs from 'dayjs';
import { TOKEN_KEYS, REMEMBER_ME } from '@/constants';

/**
 * 쿠키 헬퍼 함수 (아이디 기억하기용)
 */

// 쿠키 설정
const setCookie = (name: string, value: string, days: number = 30): void => {
  // 만료 날짜 계산
  const expires = dayjs().add(days, 'day').toDate();
  // 쿠키 설정
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

// 쿠키 조회
const getCookie = (name: string): string | null => {
  // 쿠키 조회
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  // 쿠키 값 반환
  return match ? match[2] : null;
};

// 쿠키 삭제
const removeCookie = (name: string): void => {
  // 쿠키 초기화
  document.cookie = `${name}=;expires=${dayjs(0).toDate().toUTCString()};path=/;`;
};

/**
 * 토큰 관리 (세션 스토리지)
 */

// 토큰 설정
export const setAccessToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEYS.ACCESS, token);
};

// 토큰 조회
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEYS.ACCESS);
};

// 토큰 삭제
export const removeAccessToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEYS.ACCESS);
};

// 토큰 유효 여부 확인
export const hasValidToken = (): boolean => {
  return Boolean(getAccessToken()?.trim());
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
