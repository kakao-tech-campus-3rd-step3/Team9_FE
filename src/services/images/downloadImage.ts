import apiClient from '@/api';
import { DOWNLOAD_ENDPOINTS } from '@/api/constants';

export interface DownloadPresignResponse {
  presigned_url: string;
}

/**
 * 이미지 다운로드 서비스
 */
export const downloadImageService = {
  /**
   * 이미지 키로 다운로드 presigned URL을 받아서 반환
   */
  getImagePresignedUrl: async (imageKey: string): Promise<string> => {
    if (!imageKey) return '';

    try {
      const { data } = await apiClient.post<DownloadPresignResponse>(
        DOWNLOAD_ENDPOINTS.PHOTOS,
        { file_key: imageKey },
        { showToast: false },
      );
      return data.presigned_url;
    } catch (error) {
      console.error('이미지 다운로드 URL 생성 실패:', error);
      return '';
    }
  },
};
