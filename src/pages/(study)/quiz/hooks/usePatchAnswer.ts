import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quizKeys } from '@/constants/queryKeys';
import {
  quizPatchAnswerService,
  type QuizPatchAnswerRequest,
} from '../services/quizPatchAnswerService';

export const usePatchAnswer = ({ quiz_id }: { quiz_id: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: QuizPatchAnswerRequest) =>
      quizPatchAnswerService(params),

    onMutate: () => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.start(quiz_id),
        exact: true,
      });
    },

    onSuccess: () => {
      // 퀴즈 삭제 성공 시 해당 스터디의 퀴즈 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: quizKeys.start(quiz_id),
        exact: true,
      });
    },

    onError: (error) => {
      console.error('스터디 퀴즈 완료 실패:', error);
      alert('퀴즈 완료에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
