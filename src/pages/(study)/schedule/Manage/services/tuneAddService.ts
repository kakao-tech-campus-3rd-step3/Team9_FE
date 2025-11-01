import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

export type TuneAddRequest = {
  study_id: number;
  title: string;
  content: string;
  start_date: string;
  end_date: string;
  available_start_time: string;
  available_end_time: string;
};

/**
 * 일정 조율 서비스 (axios thin)
 */
export const tuneAddService = async ({
  study_id,
  title,
  content,
  start_date,
  end_date,
  available_start_time,
  available_end_time,
}: TuneAddRequest) => {
  const response = await apiClient.post(SCHEDULE_ENDPOINTS.TUNE_ADD(study_id), {
    title,
    content,
    start_date,
    end_date,
    available_start_time,
    available_end_time,
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error('일정 조율 생성에 실패했습니다.');
  }

  return response.data;
};
