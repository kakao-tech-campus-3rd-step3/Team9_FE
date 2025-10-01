import { useMutation } from '@tanstack/react-query';
import { signupService } from '../../services';
import type { SignupPayload } from '../../types';

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (payload: SignupPayload) => signupService.signup(payload),
  });
};
