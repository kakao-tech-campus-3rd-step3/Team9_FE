/**
 * 관리자 페이지 상수
 */

// import type { StudyMember, StudyApplication, StudyInfo } from '../types';

export const ADMIN_TABS = [
  { id: 'members', label: '스터디원 관리' },
  { id: 'applicants', label: '신청자 관리' },
  { id: 'study-info', label: '스터디 관리' },
] as const;

// 스터디 생성 페이지와 동일한 카테고리
export const CATEGORIES = [
  '어학',
  '취업',
  '고시/공무원',
  '취미/교양',
  '프로그래밍',
  '자율/기타',
] as const;

// 최대 참여자 수 옵션 (스터디 생성 페이지와 동일)
export const MAX_MEMBER_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

// 목업 데이터 (사용하지 않음 - mock/index.ts에서 관리)
// export const MOCK_STUDY_MEMBERS: StudyMember[] = [...];
// export const MOCK_APPLICANTS: StudyApplication[] = [...];
// export const MOCK_STUDY_INFO: StudyInfo = {...};
