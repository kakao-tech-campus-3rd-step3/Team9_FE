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
    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    imageKey: 'studies/react-study-1.jpg', // API에서 사용할 이미지 키
  },
  {
    id: 102,
    title: '토익 900점 목표 스터디',
    description: '매주 모의고사 풀고 리뷰하는 스터디입니다.',
    category: '어학',
    currentMembers: 1,
    maxMembers: 6,
    region: '경기',
    imageUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    imageKey: 'studies/toeic-study-1.jpg',
  },
  {
    id: 103,
    title: '취업 준비 스터디',
    description: '이력서 작성부터 면접 준비까지 함께하는 스터디',
    category: '취업',
    currentMembers: 3,
    maxMembers: 5,
    region: '대구',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    imageKey: 'studies/job-study-1.jpg',
  },
  {
    id: 104,
    title: '고시 공부 스터디',
    description: '9급 공무원 시험 준비 스터디입니다.',
    category: '고시/공무원',
    currentMembers: 4,
    maxMembers: 8,
    region: '부산',
    imageUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    imageKey: 'studies/exam-study-1.jpg',
  },
  {
    id: 105,
    title: '독서 모임',
    description: '월 1권씩 읽고 토론하는 독서 스터디',
    category: '취미/교양',
    currentMembers: 2,
    maxMembers: 10,
    region: '서울',
    imageUrl:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    imageKey: 'studies/reading-study-1.jpg',
  },
  {
    id: 106,
    title: '알고리즘 스터디',
    description: '백준 문제 풀이와 알고리즘 학습',
    category: '프로그래밍',
    currentMembers: 5,
    maxMembers: 7,
    region: '경기',
    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    imageKey: 'studies/algorithm-study-1.jpg',
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
