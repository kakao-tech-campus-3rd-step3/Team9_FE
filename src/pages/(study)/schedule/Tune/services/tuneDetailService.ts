import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

type TuneDetailRequest = {
  tune_id: number;
};

type Participant = {
  id: number;
  name: string;
  candidate_number: number;
};

export type TuneDetailResponse = {
  tune_id: number;
  title: string;
  description: string;
  candidate_dates: number[];
  available_start_time: string;
  available_end_time: string;
  participants: Participant[];
};

/**
 * 일정 조율 상세 서비스 (axios thin)
 */
export const tuneDetailService = async ({
  tune_id,
}: TuneDetailRequest): Promise<TuneDetailResponse> => {
  const { data } = await apiClient.get<TuneDetailResponse>(
    SCHEDULE_ENDPOINTS.TUNE_DETAIL(tune_id),
  );

  if (!data) {
    throw new Error('스터디 일정 조율 정보 조회에 실패했습니다.');
  }

  return data;
};
