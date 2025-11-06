import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';
import type { QuizType, SubmissionStatus } from '../types';

type QuizListRequest = {
  study_id: number;
  cursor?: number | null;
  pageSize?: number;
};

type QuizListResponse = {
  content: {
    quiz_id: number;
    title: string;
    created_by: string;
    question_count: number;
    time_limit_seconds: number;
    quiz_status: QuizType;
    submission_status: SubmissionStatus;
    score: number;
    submission_id: number;
  }[];
  next_cursor: number | null;
  has_next: boolean;
};

/**
 * 스터디 퀴즈 리스트 서비스 (axios thin)
 */
export const quizListService = async ({
  study_id,
  cursor = null,
  pageSize = 100,
}: QuizListRequest): Promise<QuizListResponse> => {
  const { data } = await apiClient.get<QuizListResponse>(
    QUIZ_ENDPOINTS.LIST(study_id),
    {
      params: {
        cursor,
        pageSize,
      },
    },
  );

  if (!data) {
    throw new Error('스터디 일정 정보 조회에 실패했습니다.');
  }

  return data;
};
