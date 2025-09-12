import apiClient from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';

export interface SignupPayload {
  email: string;
  password: string;
  image_url: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  interests: string[];
  region: string;
}

export const signupService = {
  // TODO: 실제 서버 연동 시 아래 함수들을 다시 활성화
  // sendEmailCode: (payload: { email: string }) =>
  //   apiClient.post(AUTH_ENDPOINTS.EMAIL_SEND, payload, {
  //     showToast: false,
  //   }),
  // verifyEmailCode: (payload: { email: string; verification_code: string }) =>
  //   apiClient.post(AUTH_ENDPOINTS.EMAIL_VERIFY, payload, {
  //     showToast: false,
  //   }),
  // checkNickname: (nickname: string) =>
  //   apiClient.get(AUTH_ENDPOINTS.NICKNAME_CHECK, {
  //     params: { nickname },
  //     showToast: false,
  //   }),

  // 임시 우회 함수들 (JSON-server 환경용)
  sendEmailCode: async (payload: { email: string }) => {
    // TODO: 실제 서버 연동 시 이 함수를 제거하고 위의 주석 처리된 함수를 활성화
    console.log('이메일 인증코드 전송 (임시):', payload.email);
    return Promise.resolve({ data: { success: true } });
  },

  verifyEmailCode: async (payload: {
    email: string;
    verification_code: string;
  }) => {
    // TODO: 실제 서버 연동 시 이 함수를 제거하고 위의 주석 처리된 함수를 활성화
    console.log('이메일 인증코드 확인 (임시):', payload);
    return Promise.resolve({ data: { success: true } });
  },

  checkNickname: async (nickname: string) => {
    // TODO: 실제 서버 연동 시 이 함수를 제거하고 위의 주석 처리된 함수를 활성화
    console.log('닉네임 중복 확인 (임시):', nickname);
    return Promise.resolve({ data: { available: true } });
  },

  signup: (payload: SignupPayload) =>
    apiClient.post(AUTH_ENDPOINTS.SIGNUP, payload, {
      showToast: false,
    }),
} as const;

export type SignupRequest = SignupPayload;
