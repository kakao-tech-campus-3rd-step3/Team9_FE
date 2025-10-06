// 퀴즈 도메인 엔드포인트 상수
export const QUIZ_ENDPOINTS = {
  CREATE: (studyId: number) => `/api/studies/${studyId}/quizzes`,
} as const;

export type QuizEndpointKey = keyof typeof QUIZ_ENDPOINTS;
