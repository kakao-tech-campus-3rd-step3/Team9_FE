import apiClient from '@/api';
import { UPLOAD_ENDPOINTS } from '@/api/constants';

export interface PresignResponse {
  presigned_url: string;
  file_key: string;
}

/**
 * 파일을 업로드하고 최종 file_key를 반환합니다.
 * - 1) 백엔드에 presigned URL 발급 요청
 * - 2) 발급받은 URL로 S3에 PUT 업로드
 * - 3) 최종 file_key 반환 (백엔드 API에 image_key로 사용)
 */
export async function uploadWithPresignedUrl(file: File): Promise<string> {
  // 1단계: presigned URL 발급 요청
  const { data } = await apiClient.post<PresignResponse>(
    UPLOAD_ENDPOINTS.PHOTOS,
    { content_type: file.type },
    { showToast: false },
  );

  // 2단계: S3에 PUT 업로드
  const putRes = await fetch(data.presigned_url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`S3 업로드 실패: ${putRes.status}`);
  }

  // 3단계: 최종 파일 키 반환 (백엔드에 image_key로 전송)
  return data.file_key;
}
