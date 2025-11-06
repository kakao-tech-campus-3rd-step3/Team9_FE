import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceKeys } from '@/constants/queryKeys';
import { attendanceMeService, type AttendanceMeRequest } from '../services';

export const useAttendanceMeMutation = ({ study_id }: { study_id: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AttendanceMeRequest) => attendanceMeService(params),

    onSuccess: (_, variables) => {
      // 출석 정보 업데이트 성공 시 해당 스터디의 출석 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.me(variables.schedule_id),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.study(study_id),
      });
    },

    onError: (error) => {
      console.error('스터디 출석 정보 업데이트 실패:', error);
      alert('출석 정보 업데이트에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
