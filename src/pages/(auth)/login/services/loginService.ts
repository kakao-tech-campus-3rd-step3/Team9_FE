import apiClient from '@/api';
import { AUTH_ENDPOINTS } from '@/api/constants';
import type { LoginFormData } from '../types';

export const loginService = {
  login: (payload: LoginFormData) =>
    apiClient.post(AUTH_ENDPOINTS.LOGIN, payload),
} as const;
