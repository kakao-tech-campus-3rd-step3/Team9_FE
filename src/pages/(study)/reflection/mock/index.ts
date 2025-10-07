import type { Reflection, ReflectionListItem, Schedule } from '../types';

// Mock 데이터
export const mockReflections: ReflectionListItem[] = [
  {
    id: 1,
    title: '첫 번째 회고',
    author: '김경대',
    schedule_title: '2025년 9월 20일 3차 회의',
    updated_at: '2025-09-25T13:00:00',
  },
  {
    id: 2,
    title: '두 번째 회고',
    author: '이영희',
    schedule_title: null,
    updated_at: '2025-09-24T15:30:00',
  },
  {
    id: 3,
    title: '세 번째 회고',
    author: '박민수',
    schedule_title: '2025년 9월 18일 2차 회의',
    updated_at: '2025-09-23T10:15:00',
  },
];

export const mockSchedules: Schedule[] = [
  {
    schedule_id: 1,
    schedule_title: '2025년 9월 20일 3차 회의',
  },
  {
    schedule_id: 2,
    schedule_title: '2025년 9월 18일 2차 회의',
  },
  {
    schedule_id: 3,
    schedule_title: '2025년 9월 15일 1차 회의',
  },
];

export const mockReflectionDetail: Reflection = {
  id: 1,
  study_id: 10,
  study_member_id: 5,
  schedule_id: 1,
  title: '첫 번째 회고',
  satisfaction_score: 7,
  understanding_score: 8,
  participation_score: 5,
  learned_content: 'OOP의 기본 개념을 이해하게 되었습니다.',
  improvement: '다음에는 더 적극적으로 참여하겠습니다.',
  created_at: '2025-09-25T13:00:00',
  updated_at: '2025-09-25T13:00:00',
};
