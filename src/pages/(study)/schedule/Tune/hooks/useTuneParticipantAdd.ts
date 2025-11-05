import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  tuneParticipantAddService,
  type TuneParticipantAddRequest,
} from '../services';
import { scheduleKeys } from '@/constants/queryKeys';

export const useTuneParticipantAdd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: TuneParticipantAddRequest) =>
      tuneParticipantAddService(params),

    onSuccess: (_, variables) => {
      // 일정 생성 성공 시 해당 스터디의 조율 상세 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.tune_detail(variables.tune_id),
        exact: true,
      });
    },

    onError: (error) => {
      console.error('스터디 조율 추가 실패:', error);
      alert('조율 시간 추가에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
