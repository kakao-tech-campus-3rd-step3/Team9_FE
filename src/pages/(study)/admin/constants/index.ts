/**
 * 관리자 페이지 상수
 */

import type { StudyMember, StudyApplicant, StudyInfo } from '../types';

export const ADMIN_TABS = [
  { id: 'members', label: '스터디원 관리' },
  { id: 'applicants', label: '신청자 관리' },
  { id: 'study-info', label: '스터디 관리' },
] as const;

export const CATEGORIES = [
  '어학',
  '프로그래밍',
  '취업',
  '고시/공무원',
  '취미/교양',
  '자율/기타',
] as const;

// 목업 데이터
export const MOCK_STUDY_MEMBERS: StudyMember[] = [
  {
    id: '1',
    name: '김철수',
    role: 'leader',
    joinDate: '2024-01-15',
    email: 'kimcs@example.com',
  },
  {
    id: '2',
    name: '김민수',
    role: 'member',
    joinDate: '2024-01-20',
    email: 'kimminsu@example.com',
  },
  {
    id: '3',
    name: '이재민',
    role: 'member',
    joinDate: '2024-02-01',
    email: 'leejm@example.com',
  },
  {
    id: '4',
    name: '김준서',
    role: 'member',
    joinDate: '2024-02-10',
    email: 'kimjs@example.com',
  },
];

export const MOCK_APPLICANTS: StudyApplicant[] = [
  {
    id: '1',
    name: '홍길동',
    email: 'honggd@example.com',
    applyDate: '2024-03-01',
    message: '토익 점수 향상을 위해 열심히 참여하겠습니다!',
  },
];

export const MOCK_STUDY_INFO: StudyInfo = {
  id: '1',
  title: '토익 스터디',
  description:
    '토익 점수 향상을 위한 스터디입니다. 매주 토요일 오후 2시에 진행됩니다.',
  shortDescription: '토익 점수 향상을 위한 스터디',
  category: '어학',
  maxMembers: 8,
  currentMembers: 4,
};
