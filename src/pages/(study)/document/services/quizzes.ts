import apiClient from '@/api';
import { QUIZ_ENDPOINTS } from '@/api/constants';

export interface CreateQuizPayload {
  title: string;
  fileIds: number[];
}

export const QuizzesService = {
  create: async (studyId: number, payload: CreateQuizPayload) => {
    const { data } = await apiClient.post(
      QUIZ_ENDPOINTS.CREATE(studyId),
      payload,
    );
    return data;
  },
};

export default QuizzesService;
