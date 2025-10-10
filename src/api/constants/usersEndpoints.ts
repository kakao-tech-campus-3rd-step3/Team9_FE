// 사용자 도메인 엔드포인트 상수
export const USERS_ENDPOINTS = {
  // 현재 로그인한 사용자 기본 프로필 정보
  PROFILE: '/api/users',
  // 현재 로그인한 사용자 세부 프로필 정보
  PROFILE_DETAIL: '/api/users/detail',
  // 사용자 스터디 관련 정보 (path: study_id, int64)
  STUDY_BY_ID: (study_id: number) => `/api/users/${study_id}`,
  // 내 스터디 정보
  STUDY_ME: '/api/users/me/studies',
} as const;
