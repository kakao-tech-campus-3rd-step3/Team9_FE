import React from 'react';
import { Input } from '../../components';
import { AUTH_TEXTS } from '../../constants';
import { useLoginForm } from '../hooks/useLoginForm';

/**
 * 로그인 폼 컴포넌트
 */
export const LoginForm: React.FC = () => {
  const { register, handleSubmit, onSubmit } = useLoginForm();

  return (
    <form className='space-y-4' noValidate onSubmit={handleSubmit(onSubmit)}>
      {/* 이메일 입력 */}
      <Input
        type='email'
        id='email'
        placeholder={AUTH_TEXTS.LOGIN.EMAIL_PLACEHOLDER}
        autoComplete='email'
        {...register('email')}
      />

      {/* 비밀번호 입력 */}
      <Input
        type='password'
        id='password'
        placeholder={AUTH_TEXTS.LOGIN.PASSWORD_PLACEHOLDER}
        autoComplete='current-password'
        {...register('password')}
      />

      {/* 로그인 버튼 */}
      <button
        type='submit'
        className='w-full bg-primary text-primary-foreground py-2 px-3 mt-4 rounded hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 font-bold cursor-pointer'
      >
        {AUTH_TEXTS.LOGIN.BUTTON}
      </button>
    </form>
  );
};
