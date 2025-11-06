/**
 * 스터디 관련 queryKey
 */
export const studyKeys = {
  me: ['study-me'] as const,
  all: ['study'] as const,
  detailScope: () => [...studyKeys.all, 'detail'] as const,
  detail: (id: string) => [...studyKeys.detailScope(), id] as const,
  dashboard: (id: number) =>
    [...studyKeys.detailScope(), id, 'dashboard'] as const,
  myStatus: (id: number) =>
    [...studyKeys.detailScope(), id, 'status', 'me'] as const,
  pastSchedules: (id: number) =>
    [...studyKeys.detailScope(), id, 'schedules', 'past'] as const,
  rankingList: (id: number) =>
    [...studyKeys.detailScope(), id, 'ranking', 'list'] as const,
  myRanking: (id: number) =>
    [...studyKeys.detailScope(), id, 'ranking', 'me'] as const,
  quizzesRecent: (id: number, size: number) =>
    [...studyKeys.detailScope(), id, 'quizzes', 'recent', size] as const,
} as const;
