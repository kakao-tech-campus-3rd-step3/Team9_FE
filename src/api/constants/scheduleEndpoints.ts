// 사용자 도메인 엔드포인트 상수
export const SCHEDULE_ENDPOINTS = {
  // 내 전체 월별 일정
  ME: '/api/schedules/me',
  // 스터디 id를 이용한 스터디 일정
  STUDY: (study_id: number) => `/api/studies/${study_id}/schedules`,

  SCHEDULE_DELETE: (schedule_id: number) => `/api/schedules/${schedule_id}`,

  TUNE_ADD: (study_id: number) => `/api/studies/${study_id}/schedule-tunes`,
} as const;
