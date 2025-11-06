import apiClient from '@/api';
import type { QuizSubmissionPayload } from '@/pages/(study)/quiz/types/submission';

/**
 * Submit quiz results to backend.
 *
 * NOTE: adjust the endpoint path to match your backend API.
 */
export const submitQuizResults = async (
  studyId: string | number,
  quizId: string | number,
  payload: QuizSubmissionPayload,
) => {
  // default endpoint - change if your backend uses a different path
  const path = `/studies/${studyId}/quizzes/${quizId}/submissions`;
  const res = await apiClient.post(path, payload);
  return res.data;
};

export default {
  submitQuizResults,
};
