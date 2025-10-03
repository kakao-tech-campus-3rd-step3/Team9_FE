import { studyKeys } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { studyMeService } from '../services';

export const useStudyMeQuery = () => {
  return useQuery({ queryKey: [studyKeys.me], queryFn: studyMeService });
};
