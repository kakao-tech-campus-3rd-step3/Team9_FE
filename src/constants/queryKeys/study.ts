/**
 * 스터디 관련 queryKey
 */
export const studyKeys = {
  me: ['study-me'] as const,
  all: ['study'] as const,
  detailScope: () => [...studyKeys.all, 'detail'] as const,
  detail: (id: string) => [...studyKeys.detailScope(), id] as const,
} as const;
