import { attendanceKeys } from '@/constants/queryKeys';
import { useSuspenseQuery } from '@tanstack/react-query';
import { attendanceGetMeService } from '../services';

type AttendanceMeQueryParams = {
  schedule_id: number;
};

export const useAttendanceMeQuery = ({
  schedule_id,
}: AttendanceMeQueryParams) => {
  return useSuspenseQuery({
    queryKey: attendanceKeys.me(schedule_id),
    queryFn: () => attendanceGetMeService({ schedule_id }),
  });
};
