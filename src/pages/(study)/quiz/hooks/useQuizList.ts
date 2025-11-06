import { quizKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { quizListService } from '../services/quizListService';

type UseQuizListParams = {
  study_id: number;
  cursor?: string;
  pageSize?: boolean;
};

export const useQuizList = ({ study_id }: UseQuizListParams) => {
  return useSuspenseQuery({
    queryKey: quizKeys.list(study_id),
    queryFn: () => quizListService({ study_id }),
  });
};
