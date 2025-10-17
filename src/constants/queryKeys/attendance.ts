/**
 * 일정 관련 queryKey
 */
export const attendanceKeys = {
  study: (study_id: number) => ['attendance-study', study_id] as const,
} as const;
