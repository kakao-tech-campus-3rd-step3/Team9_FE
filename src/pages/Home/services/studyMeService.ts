import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';

type StudyMeResponse = {
  study_id: number;
  title: string;
}[];

/**
 * 내 스터디 서비스 (axios thin)
 */
export const studyMeService = async (): Promise<StudyMeResponse> => {
  const { data } = await apiClient.get<StudyMeResponse>(
    STUDY_ENDPOINTS.STYDY_ME,
  );

  if (!data) {
    throw new Error('내 스터디 정보 조회에 실패했습니다.');
  }

  return data;
};
