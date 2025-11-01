import { scheduleKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { tuneListService } from '../services/tuneListService';

type UseTuneListParams = {
  study_id: number;
};

export const useTuneList = ({ study_id }: UseTuneListParams) => {
  return useSuspenseQuery({
    queryKey: scheduleKeys.tune(study_id),
    queryFn: () => tuneListService({ study_id }),
  });
};
