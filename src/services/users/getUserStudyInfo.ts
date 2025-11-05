import apiClient from '@/api';
import { USERS_ENDPOINTS } from '@/api/constants';
import type { UserStudyInfo } from '@/types';

export const getUserStudyInfo = async (
  studyId: number,
): Promise<UserStudyInfo> => {
  const { data } = await apiClient.get<UserStudyInfo>(
    USERS_ENDPOINTS.STUDY_BY_ID(studyId),
  );
  return data;
};
