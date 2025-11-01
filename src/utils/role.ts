/**
 * 역할 관련 유틸리티 함수
 */

import type { StudyRole, UserRole } from '@/types';

/**
 * 스터디 역할을 한국어로 변환
 */
export const getStudyRoleLabel = (role: StudyRole): string => {
  switch (role) {
    case 'LEADER':
      return '리더';
    case 'MEMBER':
      return '멤버';
    default:
      return '멤버';
  }
};

/**
 * 사용자 역할을 한국어로 변환
 */
export const getUserRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return '관리자';
    case 'STUDY_LEADER':
      return '스터디 리더';
    case 'STUDY_MEMBER':
      return '스터디 멤버';
    case 'GUEST':
      return '게스트';
    default:
      return '게스트';
  }
};

/**
 * 현재 스터디 역할에 따른 색상 클래스 반환
 */
export const getRoleColorClass = (role: StudyRole): string => {
  switch (role) {
    case 'LEADER':
      return 'text-orange-600 bg-orange-100';
    case 'MEMBER':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};
