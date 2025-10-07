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

export const mockReflectionDetails: Reflection[] = [
  {
    id: 1,
    study_id: 10,
    study_member_id: 5, // 김경대
    schedule_id: 1,
    title: '첫 번째 회고',
    satisfaction_score: 7,
    understanding_score: 8,
    participation_score: 5,
    learned_content:
      'OOP의 기본 개념을 이해하게 되었습니다. 클래스와 객체의 관계, 상속과 다형성에 대해 배웠고, 실제 코드에서 어떻게 활용할 수 있는지 알게 되었습니다.',
    improvement:
      '다음에는 더 적극적으로 참여하겠습니다. 질문을 더 많이 하고, 팀원들과의 소통을 늘려가겠습니다.',
    created_at: '2025-09-25T13:00:00',
    updated_at: '2025-09-25T13:00:00',
  },
  {
    id: 2,
    study_id: 10,
    study_member_id: 6, // 이영희
    schedule_id: null,
    title: '두 번째 회고',
    satisfaction_score: 9,
    understanding_score: 6,
    participation_score: 8,
    learned_content:
      'React의 상태 관리에 대해 깊이 있게 학습했습니다. useState와 useEffect 훅의 사용법을 익혔고, 컴포넌트 간 데이터 전달 방법을 이해했습니다.',
    improvement:
      'TypeScript와 함께 사용하는 방법을 더 공부하고 싶습니다. 타입 정의를 더 정확하게 할 수 있도록 연습하겠습니다.',
    created_at: '2025-09-24T15:30:00',
    updated_at: '2025-09-24T15:30:00',
  },
  {
    id: 3,
    study_id: 10,
    study_member_id: 7, // 박민수
    schedule_id: 2,
    title: '세 번째 회고',
    satisfaction_score: 6,
    understanding_score: 7,
    participation_score: 4,
    learned_content:
      '데이터베이스 설계와 SQL 쿼리 작성에 대해 배웠습니다. 정규화 과정과 인덱스 최적화 방법을 이해했습니다.',
    improvement:
      '실습 시간을 늘려서 더 많은 예제를 다뤄보고 싶습니다. 복잡한 조인 쿼리를 작성하는 연습이 필요합니다.',
    created_at: '2025-09-23T10:15:00',
    updated_at: '2025-09-23T10:15:00',
  },
];

// 하위 호환성을 위한 기본값 (기존 코드가 사용할 수 있도록)
export const mockReflectionDetail = mockReflectionDetails[0];
