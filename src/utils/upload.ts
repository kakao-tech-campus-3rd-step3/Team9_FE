import apiClient from '@/api';
import { UPLOAD_ENDPOINTS } from '@/api/constants';

export interface PresignResponse {
  presigned_url: string;
  file_key: string;
}

async function presignedUpload(
  endpoint: (typeof UPLOAD_ENDPOINTS)[keyof typeof UPLOAD_ENDPOINTS],
  file: File,
): Promise<string> {
  const { data } = await apiClient.post<PresignResponse>(
    endpoint,
    { content_type: file.type },
    { showToast: false },
  );

  const putRes = await fetch(data.presigned_url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`S3 업로드 실패: ${putRes.status}`);
  }

  return data.file_key;
}

/**
 * 파일을 업로드하고 최종 file_key를 반환합니다.
 * - 1) 백엔드에 presigned URL 발급 요청
 * - 2) 발급받은 URL로 S3에 PUT 업로드
 * - 3) 최종 file_key 반환 (백엔드 API에 image_key로 사용)
 */
export async function uploadPhotoWithPresignedUrl(file: File): Promise<string> {
  return presignedUpload(UPLOAD_ENDPOINTS.PHOTOS, file);
}

/** 일반 파일 업로드 (문서 등) - FILES 엔드포인트 사용 */
export async function uploadFileWithPresignedUrl(file: File): Promise<string> {
  // Swagger: { name: string } only
  const { data } = await apiClient.post<PresignResponse>(
    UPLOAD_ENDPOINTS.FILES,
    { name: file.name },
    { showToast: false },
  );

  const putRes = await fetch(data.presigned_url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`S3 업로드 실패: ${putRes.status}`);
  }

  return data.file_key;
}
