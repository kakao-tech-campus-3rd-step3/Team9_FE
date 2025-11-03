import { studyKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { studyMeService } from '../services';

export const useStudyMeQuery = () => {
  return useSuspenseQuery({
    queryKey: studyKeys.me,
    queryFn: studyMeService,
  });
};
