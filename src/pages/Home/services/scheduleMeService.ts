import apiClient from '@/api';
import { SCHEDULE_ENDPOINTS } from '@/api/constants';

type ScheduleMeResponse = {
  schedule_id: number;
  study_id: number;
  title: string;
  start_time: string;
  end_time: string;
}[];

type ScheduleMeRequest = {
  year: number;
  month: number;
};

/**
 * 내 스케줄 서비스 (axios thin)
 */
export const scheduleMeService = async ({
  year,
  month,
}: ScheduleMeRequest): Promise<ScheduleMeResponse> => {
  const { data } = await apiClient.get<ScheduleMeResponse>(
    SCHEDULE_ENDPOINTS.ME,
    {
      params: {
        year,
        month,
      },
    },
  );

  if (!data) {
    throw new Error('내 스케줄 정보 조회에 실패했습니다.');
  }

  return data;
};
