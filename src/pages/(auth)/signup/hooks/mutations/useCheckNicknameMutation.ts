import { useMutation } from '@tanstack/react-query';
import { signupService } from '../../services';

type Payload = { nickname: string };

export const useCheckNicknameMutation = () => {
  return useMutation({
    mutationFn: async (payload: Payload) =>
      signupService.checkNickname(payload),
  });
};
