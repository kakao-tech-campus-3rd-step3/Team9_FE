// 진척도 도메인 엔드포인트 상수
export const PROGRESS_ENDPOINTS = {
  // 전체 로드맵 조회
  ROADMAP: (study_id: number) => `/api/studies/${study_id}/chapter`,
  // 스터디 개인별 현황판 조회 (모든 멤버)
  MEMBER_STATUS: (study_id: number) => `/api/studies/${study_id}/status`,
  // 스터디 본인 현황판 조회
  MY_STATUS: (study_id: number) => `/api/studies/${study_id}/status/me`,
  // 로드맵 차시 추가
  ADD_CHAPTER: (study_id: number) => `/api/studies/${study_id}/chapter`,
  // 로드맵 차시 수정
  UPDATE_CHAPTER: (chapter_id: number) => `/api/studies/${chapter_id}`,
  // 로드맵 차시 완료 처리
  COMPLETE_CHAPTER: (chapter_id: number) =>
    `/api/studies/${chapter_id}/complete`,
  // 로드맵 차시 삭제
  DELETE_CHAPTER: (chapter_id: number) => `/api/studies/${chapter_id}`,
} as const;
