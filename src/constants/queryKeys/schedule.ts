/**
 * 스케줄 관련 queryKey
 */
export const scheduleKeys = {
  me: (year: number, month: number) => ['schedule-me', year, month] as const,
  study: (study_id: number) => ['schedule-study', study_id] as const,

  tune: (study_id: number) => ['schedule-tune', study_id] as const,
} as const;
