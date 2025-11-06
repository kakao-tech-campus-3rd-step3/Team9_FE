import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';

export type QuizCompleteRequest = {
  submission_id: number;
  answers: {
    question_id: number;
    user_answer: string;
  }[];
};

export const quizCompleteService = async ({
  submission_id,
  answers,
}: QuizCompleteRequest) => {
  // 서버는 제출 완료 시 답안 배열을 요청 본문으로 받습니다.
  const response = await apiClient.post(
    QUIZ_ENDPOINTS.COMPLETE(submission_id),
    { answers },
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error('스터디 퀴즈 완료 처리에 실패했습니다.');
  }

  return response.data;
};
