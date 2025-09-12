import React from 'react';
import { Input } from '../../components';
import { AUTH_TEXTS } from '../../constants';
import { useLoginForm } from '../hooks/useLoginForm';

/**
 * 로그인 폼 컴포넌트
 */
export const LoginForm: React.FC = () => {
  const {
    register,
    onSubmit,
    isPending,
    isError,
    rememberMe,
    setRememberMe,
    errors,
    isValid,
  } = useLoginForm();

  return (
    <form className='space-y-4' noValidate onSubmit={onSubmit}>
      {/* 이메일 입력 */}
      <Input
        type='email'
        id='email'
        placeholder={AUTH_TEXTS.LOGIN.EMAIL_PLACEHOLDER}
        autoComplete='email'
        aria-invalid={!!errors.email || undefined}
        error={errors.email?.message as string | undefined}
        {...register('email')}
      />

      {/* 비밀번호 입력 */}
      <Input
        type='password'
        id='password'
        placeholder={AUTH_TEXTS.LOGIN.PASSWORD_PLACEHOLDER}
        autoComplete='current-password'
        aria-invalid={!!errors.password || undefined}
        error={errors.password?.message as string | undefined}
        {...register('password')}
      />

      {/* 아이디 기억하기 체크박스 */}
      <div className='flex items-center justify-between'>
        <label className='flex items-center space-x-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2'
          />
          <span className='text-sm text-gray-700'>
            {AUTH_TEXTS.LOGIN.REMEMBER_ME}
          </span>
        </label>
      </div>

      {/* 로그인 버튼 */}
      <button
        type='submit'
        disabled={isPending || !isValid}
        className='w-full bg-primary text-primary-foreground py-2 px-3 mt-4 rounded hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isPending ? (
          <span
            className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent align-[-0.125em]'
            aria-label='로딩 중'
          />
        ) : (
          AUTH_TEXTS.LOGIN.BUTTON
        )}
      </button>

      {/* 에러 메시지 */}
      {isError && (
        <div className='text-red-500 text-sm text-center mt-2'>
          {AUTH_TEXTS.LOGIN.ERROR_MESSAGE}
        </div>
      )}
    </form>
  );
};
