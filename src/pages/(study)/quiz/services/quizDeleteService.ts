import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';

export type QuizDeleteRequest = {
  quiz_id: number;
};

/**
 * 스터디 퀴즈 삭제 서비스 (axios thin)
 */
export const quizDeleteService = async ({ quiz_id }: QuizDeleteRequest) => {
  const response = await apiClient.delete(QUIZ_ENDPOINTS.DELETE(quiz_id));

  if (response.status < 200 || response.status >= 300) {
    throw new Error('스터디 퀴즈 삭제에 실패했습니다.');
  }

  return response.data;
};
