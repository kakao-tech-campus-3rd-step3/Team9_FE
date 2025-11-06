import apiClient from '@/api';
import { DASHBOARD_ENDPOINTS } from '@/api/constants';

export interface DashboardApiResponse {
  study_title: string;
  latest_notice?: {
    notice_id: number;
    title: string;
    author_name: string;
    created_at: string; // ISO
  } | null;
  upcoming_schedule?: {
    schedule_id: number;
    title: string;
    start_time: string; // ISO
    d_day: number; // 0: today, >0 future, <0 past
    participant_count: number;
    total_member_count: number;
  } | null;
}

export const getStudyDashboard = async (
  studyId: number,
): Promise<DashboardApiResponse> => {
  const { data } = await apiClient.get<DashboardApiResponse>(
    DASHBOARD_ENDPOINTS.DASHBOARD(studyId),
    { showToast: false },
  );
  return data;
};
