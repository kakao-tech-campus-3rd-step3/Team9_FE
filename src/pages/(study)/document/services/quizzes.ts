import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';

export interface CreateQuizPayload {
  title: string;
  fileIds: number[];
}

export const QuizzesService = {
  create: async (studyId: number, payload: CreateQuizPayload) => {
    // 서버 스펙에 맞춰 snake_case로 변환하여 전송
    const requestBody = {
      title: payload.title,
      file_ids: payload.fileIds,
    } as const;

    const { data } = await apiClient.post(
      QUIZ_ENDPOINTS.CREATE(studyId),
      requestBody,
    );
    return data;
  },
};

export default QuizzesService;
