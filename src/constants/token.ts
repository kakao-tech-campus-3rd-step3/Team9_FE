/**
 * 토큰 관련 상수
 */

// 토큰 저장 키
export const TOKEN_KEYS = {
  ACCESS: 'access_token',
} as const;

// 아이디 기억하기 관련 상수
export const REMEMBER_ME = {
  EMAIL_KEY: 'remembered_email',
  EXPIRY_DAYS: 7, // 7일
} as const;

// 토큰 만료 시간 (초)
export const TOKEN_EXPIRY = {
  ACCESS: 15 * 60, // 15분
} as const;
