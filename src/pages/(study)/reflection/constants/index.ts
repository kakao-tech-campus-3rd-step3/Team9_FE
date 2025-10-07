// 회고 페이지 관련 상수

export const REFLECTION_TEXTS = {
  PAGE_TITLE: '스터디 회고 목록',
  LIST_TITLE: '회고 목록',
  DETAIL_TITLE: '회고 작성',
  WRITE_BUTTON: '회고 작성',
  MY_REFLECTIONS_ONLY: '내 회고만 보기',
  OVERALL_SATISFACTION: '전체 만족도',
  CONTENT_UNDERSTANDING: '내용 이해도',
  PARTICIPATION: '참여도',
  LEARNED_CONTENT_QUESTION: '이번 스터디에서 공부한 점과 느낀점은 무엇인가요?',
  IMPROVEMENT_QUESTION: '다음 스터디에서 개선할 점은 무엇인가요?',
  SELECT_SCHEDULE_PLACEHOLDER: '연관된 스터디 일정을 선택해주세요..',
  NO_SCHEDULE_SELECTED: '선택 안함',
} as const;

export const SCORE_LABELS = {
  SATISFACTION: '전체 만족도',
  UNDERSTANDING: '내용 이해도',
  PARTICIPATION: '참여도',
} as const;

export const SCORE_RANGE = {
  MIN: 1,
  MAX: 10,
} as const;
