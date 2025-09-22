import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas';
import { DEFAULT_LOGIN_FORM_VALUES } from '../constants';
import type { LoginPayload } from '../schemas';
import { useLoginMutation } from './useLoginMutation';
import { rememberedEmailStorage } from '@/utils';

/**
 * 로그인 폼 관리 훅
 * - React Hook Form을 사용한 로그인 폼 상태 관리
 * - 아이디 기억하기 기능 (쿠키 사용)
 * - 폼 유효성 검증 및 제출 처리
 */
export const useLoginForm = () => {
  const { mutate, isPending, isError } = useLoginMutation();

  // 기억된 이메일이 있으면 기본값으로 설정
  const rememberedEmail = rememberedEmailStorage.get();
  const defaultValues = {
    ...DEFAULT_LOGIN_FORM_VALUES,
    email: rememberedEmail || DEFAULT_LOGIN_FORM_VALUES.email,
  };

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginPayload>({
    defaultValues,
    resolver: zodResolver(loginSchema),
    mode: 'onTouched', // blur 시 최초 검증 이후 실시간 검증
  });

  // 아이디 기억하기 체크박스 상태
  const [rememberMe, setRememberMe] = useState(!!rememberedEmail);

  const onSubmit = handleSubmit((data) => {
    // 아이디 기억하기 처리
    if (rememberMe) {
      rememberedEmailStorage.set(data.email);
    } else {
      rememberedEmailStorage.remove();
    }

    mutate(data);
  });

  return {
    // React Hook Form
    register,
    handleSubmit,
    errors,
    isValid,

    // 핸들러
    onSubmit,

    // 상태
    isPending,
    isError,

    // 아이디 기억하기
    rememberMe,
    setRememberMe,
  };
};
