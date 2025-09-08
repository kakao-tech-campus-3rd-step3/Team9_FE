import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Logo } from '@/components';
import { AUTH_TEXTS } from '../constants';
import { LoginForm } from './components';

/**
 * 로그인 페이지 컴포넌트
 */
const LoginPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-6'>
      <div className='w-full max-w-sm space-y-4'>
        {/* 로고 */}
        <div className='text-center'>
          <Logo showText={false} className='w-24 h-24 mx-auto' />
        </div>

        {/* 로그인 폼 */}
        <div className='space-y-4'>
          <div className='text-center space-y-2'>
            <h3 className='font-bold text-foreground'>
              {AUTH_TEXTS.LOGIN.TITLE}
            </h3>
            <p className='text-muted-foreground font-semibold'>
              {AUTH_TEXTS.LOGIN.SUBTITLE}
            </p>
          </div>

          <LoginForm />
        </div>

        {/* 회원가입 링크 */}
        <div className='text-center pt-2'>
          <p className='text-muted-foreground text-sm'>
            {AUTH_TEXTS.LOGIN.SIGNUP_LINK}{' '}
            <Link
              to={ROUTES.SIGNUP}
              className='text-primary hover:text-primary-hover font-medium transition-colors ml-1'
            >
              {AUTH_TEXTS.LOGIN.SIGNUP_TEXT}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
