import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceKeys, scheduleKeys } from '@/constants/queryKeys';
import {
  scheduleDeleteService,
  type ScheduleDeleteRequest,
} from '../services/scheduleDeleteService';

export const useScheduleDelete = ({ study_id }: { study_id: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ScheduleDeleteRequest) =>
      scheduleDeleteService(params),

    onSuccess: () => {
      // 일정 삭제 성공 시 해당 스터디의 일정 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.study(study_id),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.study(study_id),
        exact: true,
      });
    },

    onError: (error) => {
      console.error('스터디 일정 삭제 실패:', error);
      alert('일정 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
