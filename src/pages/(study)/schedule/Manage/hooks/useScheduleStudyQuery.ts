import { scheduleKeys } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { scheduleStudyService } from '../services';

type UseScheduleStudyQueryParams = {
  study_id: number;
};

export const useScheduleStudyQuery = ({
  study_id,
}: UseScheduleStudyQueryParams) => {
  return useQuery({
    queryKey: scheduleKeys.study(study_id),
    queryFn: () => scheduleStudyService({ study_id }),
  });
};
