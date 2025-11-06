import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleKeys } from '@/constants/queryKeys';
import { toast } from 'react-toastify';
import {
  tuneCompleteService,
  type TuneCompleteRequest,
} from '../services/tuneCompleteService';

export const useTuneComplete = ({ study_id }: { study_id: number }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: TuneCompleteRequest) => tuneCompleteService(params),

    onSuccess: () => {
      // 일정 생성 성공 시 해당 스터디의 조율 상세 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.tune(study_id),
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.study(study_id),
        exact: true,
      });

      toast.success('일정이 성공적으로 추가되었습니다!');
    },

    onError: (error) => {
      console.error('스터디 일정 추가 실패:', error);
      toast.error('일정 추가에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
