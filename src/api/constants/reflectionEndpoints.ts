// 회고 도메인 엔드포인트 상수
export const REFLECTION_ENDPOINTS = {
  // 회고 목록 조회
  LIST: (study_id: number) => `/api/studies/${study_id}/reflections`,
  // 회고 상세 조회
  DETAIL: (study_id: number, reflection_id: number) =>
    `/api/studies/${study_id}/reflections/${reflection_id}`,
  // 회고 작성
  CREATE: (study_id: number) => `/api/studies/${study_id}/reflections`,
  // 회고 수정
  UPDATE: (study_id: number, reflection_id: number) =>
    `/api/studies/${study_id}/reflections/${reflection_id}`,
  // 회고 삭제
  DELETE: (study_id: number, reflection_id: number) =>
    `/api/studies/${study_id}/reflections/${reflection_id}`,
} as const;
