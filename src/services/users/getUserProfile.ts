import apiClient from '@/api';
import { USERS_ENDPOINTS } from '@/api/constants';
import type { UserProfile } from '@/types';

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>(USERS_ENDPOINTS.PROFILE);
  return data;
};
