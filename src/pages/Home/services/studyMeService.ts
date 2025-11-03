import apiClient from '@/api';
import { USERS_ENDPOINTS } from '@/api/constants';
import type { StudyMe } from '../types/study';

type StudyMeResponse = StudyMe[];

/**
 * 내 스터디 서비스 (axios thin)
 */
export const studyMeService = async (): Promise<StudyMeResponse> => {
  const { data } = await apiClient.get<StudyMeResponse>(
    USERS_ENDPOINTS.STUDY_ME,
  );

  if (!data) {
    throw new Error('내 스터디 정보 조회에 실패했습니다.');
  }

  return data;
};
