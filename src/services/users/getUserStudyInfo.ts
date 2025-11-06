import apiClient from '@/api';
import { USERS_ENDPOINTS } from '@/api/constants';
import type { UserStudyInfo } from '@/types';

export const getUserStudyInfo = async (
  studyId: number,
): Promise<UserStudyInfo> => {
  const { data } = await apiClient.get<UserStudyInfo>(
    USERS_ENDPOINTS.STUDY_BY_ID(studyId),
    {
      showToast: false, // 403 에러는 자동 토스트 표시하지 않음 (권한 문제)
    },
  );
  return data;
};
