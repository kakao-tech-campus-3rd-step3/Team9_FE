import { quizKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  quizResultService,
  type QuizResultRequest,
} from '../services/quizResultService';

export const useQuizResult = ({ submission_id }: QuizResultRequest) => {
  return useSuspenseQuery({
    queryKey: quizKeys.result(submission_id),
    queryFn: () => quizResultService({ submission_id }),
  });
};
