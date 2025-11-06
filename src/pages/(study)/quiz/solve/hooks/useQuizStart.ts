import { quizKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { quizStartService } from '../services/quizStartService';

type UseQuizStartParams = {
  quiz_id: number;
};

export const useQuizStart = ({ quiz_id }: UseQuizStartParams) => {
  return useSuspenseQuery({
    queryKey: quizKeys.start(quiz_id),
    queryFn: () => quizStartService({ quiz_id }),
  });
};
