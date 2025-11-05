import { publicClient } from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import type {
  SignupPayload,
  EmailVerifySendPayload,
  EmailVerifyConfirmPayload,
  NicknameCheckPayload,
} from '../types/signup';

export const signupService = {
  sendEmailCode: (payload: EmailVerifySendPayload) =>
    publicClient.post(AUTH_ENDPOINTS.EMAIL_SEND, payload),
  verifyEmailCode: (payload: EmailVerifyConfirmPayload) =>
    publicClient.post(AUTH_ENDPOINTS.EMAIL_VERIFY, payload),
  checkNickname: (payload: NicknameCheckPayload) =>
    publicClient.get(AUTH_ENDPOINTS.NICKNAME_CHECK, { params: payload }),
  signup: (payload: SignupPayload) =>
    publicClient.post(AUTH_ENDPOINTS.SIGNUP, payload),
} as const;
