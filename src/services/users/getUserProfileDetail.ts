import apiClient from '@/api';
import { USERS_ENDPOINTS } from '@/api/constants';
import type { UserProfileDetail } from '@/types';

export const getUserProfileDetail = async (): Promise<UserProfileDetail> => {
  const { data } = await apiClient.get<UserProfileDetail>(
    USERS_ENDPOINTS.PROFILE_DETAIL,
  );
  return data;
};
