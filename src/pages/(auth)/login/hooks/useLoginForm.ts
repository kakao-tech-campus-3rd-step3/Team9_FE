import { useForm } from 'react-hook-form';
import type { LoginFormData } from '../types';
import { DEFAULT_LOGIN_FORM_VALUES } from '../constants';

/**
 * 로그인 폼 관리 훅
 */
export const useLoginForm = () => {
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: DEFAULT_LOGIN_FORM_VALUES,
  });

  // 로그인 제출 핸들러
  const onSubmit = (data: LoginFormData) => {
    console.log('로그인 데이터:', data);

    // TODO: 실제 API 호출
    // await loginAPI(data);
  };

  return {
    // React Hook Form
    register,
    handleSubmit,
    errors,

    // 핸들러
    onSubmit,
  };
};
