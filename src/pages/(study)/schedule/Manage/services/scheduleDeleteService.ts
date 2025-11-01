import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

export type ScheduleDeleteRequest = {
  schedule_id: number;
};

/**
 * 스터디 스케줄 서비스 (axios thin)
 */
export const scheduleDeleteService = async ({
  schedule_id,
}: ScheduleDeleteRequest) => {
  const response = await apiClient.delete(
    SCHEDULE_ENDPOINTS.SCHEDULE_DELETE(schedule_id),
    {
      params: { schedule_id },
    },
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error('스터디 일정 삭제에 실패했습니다.');
  }

  return response.data;
};
