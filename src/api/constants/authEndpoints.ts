// 인증 도메인 엔드포인트 상수
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  EMAIL_SEND: '/api/auth/email/send',
  EMAIL_VERIFY: '/api/auth/email/verify',
  NICKNAME_CHECK: '/api/auth/check-nickname',
} as const;
