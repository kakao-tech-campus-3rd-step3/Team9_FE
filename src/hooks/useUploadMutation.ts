import { useMutation } from '@tanstack/react-query';
import { uploadWithPresignedUrl } from '@/utils/upload';

/**
 * 파일 업로드 뮤테이션 훅 (TanStack Query 사용)
 */
export const useUploadMutation = () => {
  return useMutation({
    mutationFn: (file: File) => uploadWithPresignedUrl(file),
  });
};
