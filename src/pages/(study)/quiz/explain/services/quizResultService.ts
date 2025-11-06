import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';
import type { QuizSubmissionPayload } from '../../types/submission';

export type QuizResultRequest = {
  submission_id: number;
};

export const quizResultService = async ({
  submission_id,
}: QuizResultRequest): Promise<QuizSubmissionPayload> => {
  const { data } = await apiClient.get<QuizSubmissionPayload>(
    QUIZ_ENDPOINTS.RESULT(submission_id),
  );

  if (!data) {
    throw new Error('퀴즈 제출 결과를 조회하지 못했습니다.');
  }

  return data;
};
