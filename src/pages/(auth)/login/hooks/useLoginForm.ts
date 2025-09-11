import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas';
import { DEFAULT_LOGIN_FORM_VALUES } from '../constants';
import type { LoginFormData } from '../schemas';
import { useLoginMutation } from './useLoginMutation';

/**
 * 로그인 폼 관리 훅
 */
export const useLoginForm = () => {
  const { mutate, isPending, isError } = useLoginMutation();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: DEFAULT_LOGIN_FORM_VALUES,
    resolver: zodResolver(loginSchema),
    mode: 'onTouched', // blur 시 최초 검증 이후 실시간 검증
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  return {
    // React Hook Form
    register,
    handleSubmit,
    errors,

    // 핸들러
    onSubmit,

    // 상태
    isPending,
    isError,
  };
};
