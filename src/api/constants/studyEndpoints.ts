// 스터디 도메인 엔드포인트 상수
export const STUDY_ENDPOINTS = {
  STUDIES: '/api/studies',
  STUDY_DETAIL: (id: number) => `/api/studies/${id}`,
  STUDY_CREATE: '/api/studies',
  STUDY_APPLY: (id: number) => `/api/studies/${id}/apply`,
  // IMAGE_UPLOAD: '/api/upload/images', // 실제 이미지 업로드 API 연동 시 추가
} as const;
