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
  sendEmailCode: (payload: { email: string }) =>
    apiClient.post(AUTH_ENDPOINTS.EMAIL_SEND, payload),
  verifyEmailCode: (payload: { email: string; verification_code: string }) =>
    apiClient.post(AUTH_ENDPOINTS.EMAIL_VERIFY, payload),
  checkNickname: (nickname: string) =>
    apiClient.get(AUTH_ENDPOINTS.NICKNAME_CHECK, { params: { nickname } }),
  signup: (payload: SignupPayload) =>
    apiClient.post(AUTH_ENDPOINTS.SIGNUP, payload),
} as const;

export type SignupRequest = SignupPayload;
