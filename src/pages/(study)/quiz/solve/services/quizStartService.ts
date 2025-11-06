import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';

type QuizStartRequest = {
  quiz_id: number;
};

export type QuizStartChoice = {
  choice_id: number;
  choice_text: string;
};

export type QuizStartQuestion = {
  question_id: number;
  question_type: string;
  question_text: string;
  choices: QuizStartChoice[];
  user_answer?: string;
};

export type QuizStartResponse = {
  submission_id: number;
  quiz_title: string;
  time_limit_seconds: number;
  remaining_seconds?: number;
  questions: QuizStartQuestion[];
};

/**
 * 스터디 퀴즈 시작 서비스
 * - 백엔드에서 제공하는 quiz start 응답 예시를 타입으로 반영
 */
export const quizStartService = async ({
  quiz_id,
}: QuizStartRequest): Promise<QuizStartResponse> => {
  const { data } = await apiClient.get<QuizStartResponse>(
    QUIZ_ENDPOINTS.START(quiz_id),
  );

  if (!data) {
    throw new Error('스터디 퀴즈 시작에 실패했습니다.');
  }

  return data;
};
