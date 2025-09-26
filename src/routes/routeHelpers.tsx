/**
 * 라우트 보호 헬퍼 함수들
 */

import React from 'react';
import { withProtection } from '@/hoc';
import type { UserRole } from '@/types/auth';

// 인증이 필요한 페이지
export const auth = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
) => withProtection(Component, { requireAuth: true });

// 게스트 전용 페이지
export const guest = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
) => withProtection(Component, { guestOnly: true });

// 로그인한 사용자에게만 보이는 페이지 (리다이렉트 없음)
export const loginOnly = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
) => withProtection(Component, { loginOnly: true });

// 역할 기반 페이지 (계층적 접근)
export const role = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  minRole: UserRole,
) => withProtection(Component, { requireAuth: true, minRole });
