// 사용자 도메인 엔드포인트 상수
export const USERS_ENDPOINTS = {
  // 현재 로그인한 사용자 기본 프로필 정보
  PROFILE: '/api/users/me',
  // 현재 로그인한 사용자 세부 프로필 정보
  PROFILE_DETAIL: '/api/users/me/detail',
  // 특정 스터디 정보 (path: study_id, int64)
  STUDY_BY_ID: (study_id: number) => `/api/users/me/studies/${study_id}`,
  // 현재 로그인한 사용자의 스터디 신청 목록
  STUDY_APPLICATIONS: '/api/users/me/studies/applications',
  // 내 스터디 정보
  STYDY_ME: '/api/users/me/studies',
} as const;
