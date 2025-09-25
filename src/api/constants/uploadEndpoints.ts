// 업로드 도메인 엔드포인트 상수
export const UPLOAD_ENDPOINTS = {
  PHOTOS: '/api/upload/photos',
  FILES: '/api/upload/files',
} as const;

export type UploadEndpointKey = keyof typeof UPLOAD_ENDPOINTS;
