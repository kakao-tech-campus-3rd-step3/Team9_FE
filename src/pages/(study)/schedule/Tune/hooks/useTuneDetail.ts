import { scheduleKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { tuneDetailService } from '../services';

type TuneDetailParams = {
  tune_id: number;
};

export const useTuneDetail = ({ tune_id }: TuneDetailParams) => {
  return useSuspenseQuery({
    queryKey: scheduleKeys.tune_detail(tune_id),
    queryFn: () => tuneDetailService({ tune_id }),
  });
};
