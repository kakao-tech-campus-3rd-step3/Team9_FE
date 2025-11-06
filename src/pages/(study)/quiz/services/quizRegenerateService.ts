import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';

export type QuizRegenerateRequest = {
  quiz_id: number;
};

/**
 * 스터디 퀴즈 재생성 서비스 (axios thin)
 */
export const quizRegenerateService = async ({
  quiz_id,
}: QuizRegenerateRequest) => {
  const response = await apiClient.post(QUIZ_ENDPOINTS.REGENERATE(quiz_id));

  if (response.status < 200 || response.status >= 300) {
    throw new Error('스터디 퀴즈 재생성에 실패했습니다.');
  }

  return response.data;
};
