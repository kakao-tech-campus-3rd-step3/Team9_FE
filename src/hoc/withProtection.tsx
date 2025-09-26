/**
 * 페이지 접근 제어를 위한 통합 HOC
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { ROUTES } from '@/constants';
import type { UserRole } from '@/types/auth';

// 접근 제어 옵션 타입
interface ProtectionOptions {
  /** 인증 필요 여부 */
  requireAuth?: boolean;
  /** 게스트만 접근 가능 여부 */
  guestOnly?: boolean;
  /** 필요한 최소 역할 (계층적 접근) */
  minRole?: UserRole;
  /** 로그인한 사용자에게만 보이는 페이지 (리다이렉트 없음) */
  loginOnly?: boolean;
  /** 리다이렉트 경로 */
  redirectTo?: string;
}

// 페이지 접근 제어 통합 HOC
export const withProtection = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  options: ProtectionOptions = {},
) => {
  return (props: P) => {
    const { isAuthenticated, isAuthLoading, isGuest, canAccess } =
      useAuthStatus();
    const location = useLocation();

    // 초기화 중이면 빈 화면 렌더링
    if (isAuthLoading) {
      return <></>;
    }

    const { requireAuth, guestOnly, minRole, loginOnly, redirectTo } = options;

    // 1. 게스트 전용 체크
    if (guestOnly) {
      if (isAuthenticated) {
        return (
          <Navigate
            to={redirectTo || ROUTES.HOME}
            state={{ from: location.pathname }}
            replace
          />
        );
      }
      if (!isGuest) {
        return <></>;
      }
    }

    // 2. 로그인 필요 체크
    if (requireAuth && !isAuthenticated) {
      return (
        <Navigate
          to={redirectTo || ROUTES.LOGIN}
          state={{ from: location.pathname }}
          replace
        />
      );
    }

    // 3. 로그인한 사용자에게만 보이는 페이지 (리다이렉트 없음)
    if (loginOnly && !isAuthenticated) {
      return <></>;
    }

    // 4. 역할 기반 접근 체크
    if (minRole && (!isAuthenticated || !canAccess(minRole))) {
      return (
        <Navigate
          to={redirectTo || ROUTES.HOME}
          state={{ from: location.pathname }}
          replace
        />
      );
    }

    // 모든 조건을 만족하면 컴포넌트 렌더링
    return <Component {...props} />;
  };
};
