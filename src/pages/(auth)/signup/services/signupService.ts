import apiClient from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import type {
  SignupPayload,
  EmailVerifySendPayload,
  EmailVerifyConfirmPayload,
  NicknameCheckPayload,
} from '../types/signup';

export const signupService = {
  sendEmailCode: (payload: EmailVerifySendPayload) =>
    apiClient.post(AUTH_ENDPOINTS.EMAIL_SEND, payload, {
      showToast: false,
    }),
  verifyEmailCode: (payload: EmailVerifyConfirmPayload) =>
    apiClient.post(AUTH_ENDPOINTS.EMAIL_VERIFY, payload, {
      showToast: false,
    }),
  checkNickname: (payload: NicknameCheckPayload) =>
    apiClient.get(AUTH_ENDPOINTS.NICKNAME_CHECK, {
      params: payload,
      showToast: false,
    }),

  signup: (payload: SignupPayload) =>
    apiClient.post(AUTH_ENDPOINTS.SIGNUP, payload, {
      showToast: false,
    }),
} as const;
