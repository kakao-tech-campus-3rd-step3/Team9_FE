import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

export type ScheduleAddRequest = {
  study_id: number;
  title: string;
  content: string;
  start_time: string;
  end_time: string;
};

/**
 * 스터디 스케줄 서비스 (axios thin)
 */
export const scheduleAddService = async ({
  study_id,
  title,
  content,
  start_time,
  end_time,
}: ScheduleAddRequest) => {
  const response = await apiClient.post(SCHEDULE_ENDPOINTS.STUDY(study_id), {
    title,
    content,
    start_time,
    end_time,
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error('스터디 일정 생성에 실패했습니다.');
  }

  return response.data;
};
