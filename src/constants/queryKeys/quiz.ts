/**
 * 퀴즈 관련 queryKey
 */
export const quizKeys = {
  list: (study_id: number) => ['quiz-list', study_id] as const,

  start: (quiz_id: number) => ['quiz-start', quiz_id] as const,
} as const;
