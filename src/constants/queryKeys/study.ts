/**
 * 스터디 관련 queryKey
 */
export const studyKeys = {
  all: ['study'] as const,
  detailScope: () => [...studyKeys.all, 'detail'] as const,
  detail: (id: string) => [...studyKeys.detailScope(), id] as const,
} as const;
