import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

type TuneListRequest = {
  study_id: number;
};

type TuneListResponse = {
  tune_id: number;
  title: string;
  start_time: string;
  end_time: string;
};

/**
 * 일정 조율 리스트 서비스 (axios thin)
 */
export const tuneListService = async ({
  study_id,
}: TuneListRequest): Promise<TuneListResponse[]> => {
  const { data } = await apiClient.get<TuneListResponse[]>(
    SCHEDULE_ENDPOINTS.TUNE_LIST(study_id),
  );

  if (!data) {
    throw new Error('스터디 일정 조율 정보 조회에 실패했습니다.');
  }

  return data;
};
