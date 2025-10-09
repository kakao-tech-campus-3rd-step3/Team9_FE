import { scheduleKeys } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { scheduleMeService } from '../services';

type UseScheduleMeQueryParams = {
  year: number;
  month: number;
};

export const useScheduleMeQuery = ({
  year,
  month,
}: UseScheduleMeQueryParams) => {
  return useQuery({
    queryKey: [scheduleKeys.me(year, month)],
    queryFn: () => scheduleMeService({ year, month }),
  });
};
