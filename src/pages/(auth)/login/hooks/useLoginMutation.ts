import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData } from '../types';
import { ROUTES } from '@/constants';
import { toast } from 'react-toastify';
import { loginService } from '../services';

export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => loginService.login(data),
    onSuccess: () => {
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
