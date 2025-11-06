// 퀴즈 도메인 엔드포인트 상수
export const QUIZ_ENDPOINTS = {
  CREATE: (studyId: number) => `/api/studies/${studyId}/quizzes`,

  DELETE: (quizId: number) => `/api/quizzes/${quizId}`,

  LIST: (studyId: number) => `/api/studies/${studyId}/quizzes`,

  REGENERATE: (quizId: number) => `/api/quizzes/${quizId}/regenerate`,

  START: (quizId: number) => `/api/quizzes/${quizId}`,

  COMPLETE: (submissionId: number) =>
    `/api/submissions/${submissionId}/complete`,

  RESULT: (submissionId: number) => `/api/submissions/${submissionId}/result`,

  PATCH_ANSWER: (submissionId: number) =>
    `/api/submissions/${submissionId}/answers`,
} as const;

export type QuizEndpointKey = keyof typeof QUIZ_ENDPOINTS;
