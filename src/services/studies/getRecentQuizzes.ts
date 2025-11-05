import apiClient from '@/api';
import { studyEndpoints } from '@/api/constants';

export type SubmissionStatus = 'NOT_TAKEN' | 'TAKEN' | 'SUBMITTED' | string;

export interface RecentQuizItem {
  quiz_id: number;
  quiz_title: string;
  submission_status: SubmissionStatus;
}

export type RecentQuizzesApiResponse = RecentQuizItem[];

export const getRecentQuizzes = async (
  studyId: number,
  size: number = 3,
): Promise<RecentQuizzesApiResponse> => {
  const { data } = await apiClient.get<RecentQuizzesApiResponse>(
    studyEndpoints.quizzesRecent(studyId),
    { params: { size }, showToast: false },
  );
  return data;
};
