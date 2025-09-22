// 회원가입 API 타입
export interface SignupPayload {
  email: string;
  password: string;
  image_url: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  interests: string[];
  region: string;
}

// 이메일 인증 관련 타입
export interface EmailVerifySendPayload {
  email: string;
}

export interface EmailVerifyConfirmPayload {
  email: string;
  verification_code: string;
}

// 닉네임 중복 확인 관련 타입
export interface NicknameCheckPayload {
  nickname: string;
}
