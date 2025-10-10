import { useMutation } from '@tanstack/react-query';
import {
  uploadPhotoWithPresignedUrl,
  uploadFileWithPresignedUrl,
} from '@/utils/upload';

/**
 * 파일 업로드 뮤테이션 훅 (TanStack Query 사용)
 */
export const usePhotoUploadMutation = () => {
  return useMutation({
    mutationFn: (file: File) => uploadPhotoWithPresignedUrl(file),
  });
};

export const useFileUploadMutation = () => {
  return useMutation({
    mutationFn: (file: File) => uploadFileWithPresignedUrl(file),
  });
};
