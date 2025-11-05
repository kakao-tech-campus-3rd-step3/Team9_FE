import apiClient from '@/api';
import { studyEndpoints } from '@/api/constants';

export interface ProgressMeApiResponse {
  progressMemberStatusDto: Array<{
    nickname: string;
    role: string;
    attendance_count: number;
    quiz_count: number;
    reflection_count: number;
  }>;
}

export const getMyProgress = async (
  studyId: number,
): Promise<ProgressMeApiResponse> => {
  const { data } = await apiClient.get<ProgressMeApiResponse>(
    studyEndpoints.myStatus(studyId),
    { showToast: false },
  );
  return data;
};
