import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';

export type QuizPatchAnswerRequest = {
  submissionId: number;
  answers: {
    question_id: number;
    user_answer: string;
  }[];
};

/**
 * 스터디 퀴즈 답안 수정 서비스 (axios thin)
 */
export const quizPatchAnswerService = async ({
  submissionId,
  answers,
}: QuizPatchAnswerRequest) => {
  const response = await apiClient.patch(
    QUIZ_ENDPOINTS.PATCH_ANSWER(submissionId),
    {
      answers,
    },
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error('스터디 퀴즈 답안 수정에 실패했습니다.');
  }

  return response.data;
};
