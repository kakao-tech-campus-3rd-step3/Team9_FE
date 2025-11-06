import {
  quizRegenerateService,
  type QuizRegenerateRequest,
} from './../services/quizRegenerateService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quizKeys } from '@/constants/queryKeys';

export const useQuizRegenerate = ({ study_id }: { study_id: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: QuizRegenerateRequest) =>
      quizRegenerateService(params),

    onSuccess: () => {
      // 퀴즈 재생성 성공 시 해당 스터디의 퀴즈 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: quizKeys.list(study_id),
        exact: true,
      });
    },

    onError: (error) => {
      console.error('스터디 퀴즈 재생성 실패:', error);
      alert('퀴즈 재생성에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
