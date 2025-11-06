import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

export type TuneCompleteRequest = {
  tune_id: number;
  title: string;
  content: string;
  start_time: string;
  end_time: string;
};

/**
 * 조율 일정 추가 서비스 (axios thin)
 */
export const tuneCompleteService = async ({
  tune_id,
  title,
  content,
  start_time,
  end_time,
}: TuneCompleteRequest) => {
  const response = await apiClient.put(
    SCHEDULE_ENDPOINTS.TUNE_COMPLETE(tune_id),
    { title, content, start_time, end_time },
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error('일정 추가에 실패했습니다.');
  }

  return response.data;
};
