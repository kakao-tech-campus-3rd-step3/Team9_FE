import React from 'react';
import type { FieldErrors } from 'react-hook-form';
import type { UseFormRegister } from 'react-hook-form';
import { Input } from '../../components';
import { AUTH_TEXTS } from '../../constants';
import type { SignupFormData, SignupStep } from '../types';

interface Step1FormProps {
  register: UseFormRegister<SignupFormData>;
  handleStepChange: (step: SignupStep) => void;
  errors: FieldErrors<SignupFormData>;
  isValid?: boolean;
}

/**
 * 1단계: 계정 정보 입력 폼
 */
export const Step1Form: React.FC<Step1FormProps> = ({
  register,
  handleStepChange,
  errors,
  isValid,
}) => {
  return (
    <div className='space-y-4'>
      {/* 이메일 입력 및 인증 */}
      <div className='flex gap-2'>
        <Input
          type='email'
          id='email'
          placeholder={AUTH_TEXTS.SIGNUP.STEP1.EMAIL_PLACEHOLDER}
          className='flex-1'
          autoComplete='email'
          aria-invalid={!!errors.email || undefined}
          error={errors.email?.message as string | undefined}
          {...register('email')}
        />
        <button
          type='button'
          className='px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors text-sm whitespace-nowrap cursor-pointer'
          aria-label='이메일 인증번호 전송'
        >
          {AUTH_TEXTS.SIGNUP.STEP1.EMAIL_VERIFY_BUTTON}
        </button>
      </div>

      {/* 인증번호 입력 및 확인 */}
      <div className='flex gap-2'>
        <Input
          type='text'
          id='verifyCode'
          placeholder={AUTH_TEXTS.SIGNUP.STEP1.VERIFY_CODE_PLACEHOLDER}
          maxLength={6}
          className='flex-1'
          autoComplete='one-time-code'
          aria-invalid={!!errors.verifyCode || undefined}
          error={errors.verifyCode?.message as string | undefined}
          {...register('verifyCode')}
        />
        <button
          type='button'
          className='px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors text-sm whitespace-nowrap cursor-pointer'
          aria-label='인증번호 확인'
        >
          {AUTH_TEXTS.SIGNUP.STEP1.VERIFY_BUTTON}
        </button>
      </div>

      {/* 비밀번호 입력 */}
      <Input
        type='password'
        id='password'
        placeholder={AUTH_TEXTS.SIGNUP.STEP1.PASSWORD_PLACEHOLDER}
        autoComplete='new-password'
        aria-invalid={!!errors.password || undefined}
        error={errors.password?.message as string | undefined}
        {...register('password')}
      />

      {/* 비밀번호 확인 */}
      <Input
        type='password'
        id='confirmPassword'
        placeholder={AUTH_TEXTS.SIGNUP.STEP1.CONFIRM_PASSWORD_PLACEHOLDER}
        autoComplete='new-password'
        aria-invalid={!!errors.confirmPassword || undefined}
        error={errors.confirmPassword?.message as string | undefined}
        {...register('confirmPassword')}
      />

      {/* 다음 단계 버튼 */}
      <button
        type='button'
        onClick={() => handleStepChange(2)}
        disabled={!isValid}
        className='w-full bg-primary text-primary-foreground py-2 px-3 mt-4 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 font-medium cursor-pointer'
        aria-label='다음 단계로 이동'
      >
        {AUTH_TEXTS.SIGNUP.STEP1.NEXT_BUTTON}
      </button>
    </div>
  );
};
