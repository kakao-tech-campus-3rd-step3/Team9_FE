import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  scheduleAddService,
  type ScheduleAddRequest,
} from '../services/scheduleAddService';
import { scheduleKeys } from '@/constants/queryKeys';

export const useScheduleAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ScheduleAddRequest) => scheduleAddService(params),

    onSuccess: (_, variables) => {
      // 일정 생성 성공 시 해당 스터디의 일정 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.study(variables.study_id),
        exact: true,
      });
    },

    onError: (error) => {
      console.error('스터디 일정 생성 실패:', error);
      alert('일정 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
