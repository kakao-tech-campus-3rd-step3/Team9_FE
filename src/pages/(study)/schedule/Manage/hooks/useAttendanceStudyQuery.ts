import { attendanceKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { attendanceStudyService } from '../services';

type UseAttendanceStudyQueryParams = {
  study_id: number;
};

export const useAttendanceStudyQuery = ({
  study_id,
}: UseAttendanceStudyQueryParams) => {
  return useSuspenseQuery({
    queryKey: attendanceKeys.study(study_id),
    queryFn: () => attendanceStudyService({ study_id }),
  });
};
