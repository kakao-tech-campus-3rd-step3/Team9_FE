import { useMutation } from '@tanstack/react-query';
import { signupService } from '../../services';

type Payload = { email: string };

export const useSendEmailCodeMutation = () => {
  return useMutation({
    mutationFn: async (payload: Payload) =>
      signupService.sendEmailCode(payload),
  });
};
