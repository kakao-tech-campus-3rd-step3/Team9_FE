import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Logo } from '@/components';
import { AUTH_TEXTS } from '../constants';
import { useSignupForm } from './hooks/useSignupForm';
import { Step1Form, Step2Form } from './components';

/**
 * 회원가입 페이지 컴포넌트
 * - 2단계 구성: 계정 정보 입력 → 프로필 정보 입력
 * - 단계별 진행 상태 표시
 * - 이전/다음 단계 이동 가능
 */
const SignupPage: React.FC = () => {
  // 회원가입 폼 훅 사용
  const signupForm = useSignupForm();
  const { handleSubmit, currentStep, onSubmit } = signupForm;

  return (
    <div className='min-h-screen bg-background flex flex-col items-center justify-start gap-4 p-6'>
      {/* 단계 표시 게이지 */}
      <div className='space-y-1 w-full'>
        <div className='w-full bg-input rounded-full h-2 overflow-hidden'>
          <div
            className={`h-full bg-primary transition-all duration-500 ease-in-out ${
              currentStep === 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>
        <div className='text-center text-xs text-muted-foreground font-semibold'>
          {currentStep}/2 단계
        </div>
      </div>

      <div className='w-full max-w-sm space-y-4'>
        {/* 고정 헤더 영역 */}
        <div className='space-y-4 mb-6'>
          {/* 로고 */}
          <div className='text-center'>
            <Logo showText={false} className='w-24 h-24 mx-auto' />
          </div>

          {/* 타이틀 및 서브타이틀 */}
          <div className='text-center space-y-2'>
            <h3 className='font-bold text-foreground'>
              {currentStep === 1
                ? AUTH_TEXTS.SIGNUP.STEP1.TITLE
                : AUTH_TEXTS.SIGNUP.STEP2.TITLE}
            </h3>
            <p className='text-muted-foreground font-semibold'>
              {currentStep === 1
                ? AUTH_TEXTS.SIGNUP.STEP1.SUBTITLE
                : AUTH_TEXTS.SIGNUP.STEP2.SUBTITLE}
            </p>
          </div>
        </div>

        {/* 동적 컨텐츠 영역 */}
        <form
          className='space-y-4'
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          {currentStep === 1 ? (
            <Step1Form {...signupForm} />
          ) : (
            <Step2Form {...signupForm} />
          )}
        </form>

        {/* 로그인 링크 */}
        <div className='text-center pt-2'>
          <p className='text-muted-foreground text-sm'>
            {AUTH_TEXTS.SIGNUP.LOGIN_LINK}{' '}
            <Link
              to={ROUTES.LOGIN}
              className='text-primary hover:text-primary-hover font-medium transition-colors ml-1 cursor-pointer'
            >
              {AUTH_TEXTS.SIGNUP.LOGIN_TEXT}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
