/**
 * 인증 상태 및 권한 관리 훅
 */

import { useAuthStore } from '@/stores/auth';
import { mapStudyRoleToUserRole } from '@/utils';
import type { UserRole, StudyRole } from '@/types';
import {
  hasPermission,
  isAdmin,
  isStudyLeader,
  isStudyMember,
  canAccess,
} from '@/types';

// 인증 상태 및 권한 관리 훅
export const useAuthStatus = () => {
  const { accessToken, isInitialized, user } = useAuthStore();
  const isLogin = !!accessToken;

  // 스터디 문맥이 있으면 스터디 역할 우선, 없으면 로그인 기반 기본 역할
  const userRole: UserRole = user.currentStudy?.role
    ? mapStudyRoleToUserRole(user.currentStudy.role as StudyRole)
    : isLogin
      ? 'STUDY_MEMBER'
      : 'GUEST';

  return {
    // 기본 인증 상태
    isLogin,
    isInitialized,
    isAuthLoading: !isInitialized,
    isAuthenticated: isInitialized && isLogin,
    isGuest: isInitialized && !isLogin,

    // 사용자 정보
    user,

    // 역할 정보
    userRole,

    // 권한 체크
    hasPermission: (requiredRole: UserRole) =>
      hasPermission(userRole, requiredRole),
    canAccess: (targetRole: UserRole) => canAccess(userRole, targetRole),

    // 역할 체크 헬퍼
    isAdmin: isAdmin(userRole),
    isStudyLeader: isStudyLeader(userRole),
    isStudyMember: isStudyMember(userRole),
  };
};
