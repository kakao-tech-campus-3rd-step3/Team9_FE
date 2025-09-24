/**
 * 인증 상태 초기화 로딩 컴포넌트
 */

import React from 'react';
import { useAuthStore } from '@/stores/auth';
import LoadingSpinner from './LoadingSpinner';

// AuthInitializer Props 타입
interface AuthInitializerProps {
  children: React.ReactNode;
}

// 인증 상태 초기화 컴포넌트
const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const { isInitialized } = useAuthStore();

  // 초기화 중이면 로딩 스피너 표시
  if (!isInitialized) {
    return <LoadingSpinner message='인증 상태를 확인하는 중...' fullScreen />;
  }

  // 초기화 완료 시 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AuthInitializer;
