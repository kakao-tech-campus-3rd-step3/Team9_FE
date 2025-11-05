// 출석 엔드포인트 상수
export const ATTENDANCE_ENDPOINTS = {
  // 전체 참여 현황 조회
  STUDY: (study_id: number) => `/api/studies/${study_id}/attendances`,
} as const;
