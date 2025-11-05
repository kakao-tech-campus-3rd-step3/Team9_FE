import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

export type TuneParticipantAddRequest = {
  tune_id: number;
  candidate_dates: number[];
};

/**
 * 조율 시간 추가 서비스 (axios thin)
 */
export const tuneParticipantAddService = async ({
  tune_id,
  candidate_dates,
}: TuneParticipantAddRequest) => {
  const response = await apiClient.post(
    SCHEDULE_ENDPOINTS.TUNE_PARTICIPANT_ADD(tune_id),
    { candidate_dates },
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error('조율 시간 추가에 실패했습니다.');
  }

  return response.data;
};
