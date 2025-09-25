import apiClient from '@/api';
import { USERS_ENDPOINTS } from '@/api/constants';
import type { UserProfile } from '@/types';
import { USER_SERVICE_CONFIG } from './config';

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>(
    USERS_ENDPOINTS.PROFILE,
    USER_SERVICE_CONFIG,
  );
  return data;
};
