import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleKeys } from '@/constants/queryKeys';
import {
  tuneAddService,
  type TuneAddRequest,
} from '../services/tuneAddService';

export const useTuneAdd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: TuneAddRequest) => tuneAddService(params),

    onSuccess: (_, variables) => {
      // 일정 생성 성공 시 해당 스터디의 일정 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.tune(variables.study_id),
        exact: true,
      });
    },

    onError: (error) => {
      console.error('스터디 일정 생성 실패:', error);
      alert('일정 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
