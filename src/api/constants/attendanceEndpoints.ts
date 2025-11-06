// 출석 엔드포인트 상수
export const ATTENDANCE_ENDPOINTS = {
  // 전체 참여 현황 조회
  STUDY: (study_id: number) => `/api/studies/${study_id}/attendances`,

  ATTENDANCES_ME: (schedule_id: number) =>
    `/api/schedules/${schedule_id}/attendances/me`,

  ME: (schedule_id: number) => `/api/schedules/${schedule_id}/me`,
} as const;
