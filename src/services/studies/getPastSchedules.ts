import apiClient from '@/api';
import { DASHBOARD_ENDPOINTS } from '@/api/constants';

export interface PastSchedulesApiResponseItem {
  schedule_id: number;
  schedule_title: string;
}

export type PastSchedulesApiResponse = PastSchedulesApiResponseItem[];

export const getPastSchedules = async (
  studyId: number,
): Promise<PastSchedulesApiResponse> => {
  const { data } = await apiClient.get<PastSchedulesApiResponse>(
    DASHBOARD_ENDPOINTS.PAST_SCHEDULES(studyId),
    { showToast: false },
  );
  return data;
};
