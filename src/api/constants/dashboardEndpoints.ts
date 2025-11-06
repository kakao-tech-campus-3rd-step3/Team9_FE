export const DASHBOARD_ENDPOINTS = {
  // 스터디 대시보드
  DASHBOARD: (studyId: number) => `/api/studies/${studyId}/dashboard`,
  // 내 진척도
  MY_STATUS: (studyId: number) => `/api/studies/${studyId}/status/me`,
  // 과거 일정
  PAST_SCHEDULES: (studyId: number) => `/api/studies/${studyId}/schedules/past`,
  // 랭킹
  RANKING: (studyId: number) => `/api/studies/${studyId}/ranking`,
  // 내 랭킹
  MY_RANKING: (studyId: number) => `/api/studies/${studyId}/ranking/me`,
  // 최근 퀴즈
  QUIZZES_RECENT: (studyId: number) => `/api/studies/${studyId}/quizzes/recent`,
} as const;
