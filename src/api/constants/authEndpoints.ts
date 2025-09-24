// 인증 도메인 엔드포인트 상수
export const AUTH_ENDPOINTS = {
  // 로그인
  LOGIN: '/api/auth/login',
  // 로그아웃 (서버에 따라 존재하지 않을 수 있음)
  LOGOUT: '/api/auth/logout',
  // 회원가입
  SIGNUP: '/api/auth/signup',
  // 이메일 인증 전송
  EMAIL_SEND: '/api/auth/email/send',
  // 이메일 인증 확인
  EMAIL_VERIFY: '/api/auth/email/verify',
  // 닉네임 중복 확인
  NICKNAME_CHECK: '/api/auth/check-nickname',
  // 리프레시 토큰 발급
  REFRESH: '/api/auth/refresh',
} as const;
