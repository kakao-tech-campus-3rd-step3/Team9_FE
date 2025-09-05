/**
 * 스터디 탐색 페이지 데이터
 */

import type { Study } from '../types';

// 목업 스터디 데이터
export const MOCK_STUDIES: Study[] = [
  {
    id: 101,
    title: "React 스터디 '파도' 1기",
    description: '함께 React를 정복할 스터디원을 모집합니다. 초보도 환영!',
    category: '프로그래밍',
    currentMembers: 2,
    maxMembers: 8,
    region: '서울',
  },
  {
    id: 102,
    title: '토익 900점 목표 스터디',
    description: '매주 모의고사 풀고 리뷰하는 스터디입니다.',
    category: '어학',
    currentMembers: 1,
    maxMembers: 6,
    region: '경기',
  },
  {
    id: 103,
    title: '취업 준비 스터디',
    description: '이력서 작성부터 면접 준비까지 함께하는 스터디',
    category: '취업',
    currentMembers: 3,
    maxMembers: 5,
    region: '대구',
  },
  {
    id: 104,
    title: '고시 공부 스터디',
    description: '9급 공무원 시험 준비 스터디입니다.',
    category: '고시/공무원',
    currentMembers: 4,
    maxMembers: 8,
    region: '부산',
  },
  {
    id: 105,
    title: '독서 모임',
    description: '월 1권씩 읽고 토론하는 독서 스터디',
    category: '취미/교양',
    currentMembers: 2,
    maxMembers: 10,
    region: '서울',
  },
  {
    id: 106,
    title: '알고리즘 스터디',
    description: '백준 문제 풀이와 알고리즘 학습',
    category: '프로그래밍',
    currentMembers: 5,
    maxMembers: 7,
    region: '경기',
  },
];

// 카테고리 목록
export const CATEGORIES = [
  '전체',
  '어학',
  '취업',
  '고시/공무원',
  '취미/교양',
  '프로그래밍',
  '자율/기타',
] as const;
