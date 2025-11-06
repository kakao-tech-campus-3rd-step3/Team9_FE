// 스터디 도메인 엔드포인트 상수
export const STUDY_ENDPOINTS = {
  // 스터디 목록 조회 (탐색) - develop과 호환
  STUDIES: '/api/studies',
  LIST: '/api/studies', // 관리자 페이지 호환성
  // 스터디 상세 조회 - develop과 호환
  STUDY_DETAIL: (id: number) => `/api/studies/${id}`,
  DETAIL: (study_id: number) => `/api/studies/${study_id}`, // 관리자 페이지 호환성
  // 스터디 생성
  STUDY_CREATE: '/api/studies',
  // 스터디 정보 조회 (관리자용)
  STUDY_INFO: (study_id: number) => `/api/studies/${study_id}`,
  // 스터디 정보 수정
  UPDATE_STUDY_INFO: (study_id: number) => `/api/studies/${study_id}`,
  // 스터디 신청 - develop과 호환
  STUDY_APPLY: (id: number) => `/api/studies/${id}/apply`,
  APPLY: (study_id: number) => `/api/studies/${study_id}/applications`, // 관리자 페이지 호환성
  // 스터디 신청자 목록 조회
  STUDY_APPLICATIONS: (study_id: number) =>
    `/api/studies/${study_id}/applications`,
  // 신청 상태 변경
  CHANGE_APPLICATION_STATUS: (study_id: number, application_id: number) =>
    `/api/studies/${study_id}/applications/${application_id}`,
  // 이미지 업로드 (스웨거에 있는 API)
  IMAGE_UPLOAD: '/api/upload/photos',
} as const;
