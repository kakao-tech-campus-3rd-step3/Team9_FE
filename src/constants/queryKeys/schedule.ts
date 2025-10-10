/**
 * 스케줄 관련 queryKey
 */
export const scheduleKeys = {
  me: (year: number, month: number) => ['schedule-me', year, month] as const,
} as const;
