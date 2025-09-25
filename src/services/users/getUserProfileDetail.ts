import apiClient from '@/api';
import { USERS_ENDPOINTS } from '@/api/constants';
import type { UserProfileDetail } from '@/types';
import { USER_SERVICE_CONFIG } from './config';

export const getUserProfileDetail = async (): Promise<UserProfileDetail> => {
  const { data } = await apiClient.get<UserProfileDetail>(
    USERS_ENDPOINTS.PROFILE_DETAIL,
    USER_SERVICE_CONFIG,
  );
  return data;
};
