/**
 * 사용자 역할 타입 및 권한 관리
 */

// 사용자 역할 타입
export type UserRole = 'ADMIN' | 'STUDY_LEADER' | 'STUDY_MEMBER' | 'GUEST';

// 권한 레벨 (숫자가 높을수록 더 많은 권한)
export const ROLE_PERMISSIONS = {
  ADMIN: 4, // 관리자 - 모든 권한
  STUDY_LEADER: 3, // 스터디 리더 - 스터디 관리 권한
  STUDY_MEMBER: 2, // 스터디 멤버 - 기본 권한
  GUEST: 1, // 게스트 - 로그인만 가능
} as const;

// 권한 체크 (역할 기반 접근 제어)
export const hasPermission = (userRole: UserRole, requiredRole: UserRole) =>
  ROLE_PERMISSIONS[userRole] >= ROLE_PERMISSIONS[requiredRole];

// 역할 체크 헬퍼 함수들
export const isAdmin = (role: UserRole) => role === 'ADMIN';
export const isStudyLeader = (role: UserRole) => role === 'STUDY_LEADER';
export const isStudyMember = (role: UserRole) => role === 'STUDY_MEMBER';
export const isGuest = (role: UserRole) => role === 'GUEST';

// 역할 기반 접근 권한 체크 (계층적)
export const canAccess = (userRole: UserRole, targetRole: UserRole) =>
  ROLE_PERMISSIONS[userRole] >= ROLE_PERMISSIONS[targetRole];
