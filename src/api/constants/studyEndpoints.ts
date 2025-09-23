// 스터디 도메인 엔드포인트 상수
export const STUDY_ENDPOINTS = {
  STUDIES: '/api/studies',
  STUDY_DETAIL: (id: number) => `/api/studies/${id}`,
  STUDY_CREATE: '/api/studies',
  STUDY_APPLY: (id: number) => `/api/studies/${id}/apply`,
  // 이미지 업로드 (스웨거에 있는 API)
  IMAGE_UPLOAD: '/api/upload/photos',
} as const;
