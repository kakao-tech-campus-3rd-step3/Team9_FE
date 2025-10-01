import { useMutation } from '@tanstack/react-query';
import { signupService } from '../../services';

type Payload = { email: string; verification_code: string };

export const useVerifyEmailCodeMutation = () => {
  return useMutation({
    mutationFn: async (payload: Payload) =>
      signupService.verifyEmailCode(payload),
  });
};
