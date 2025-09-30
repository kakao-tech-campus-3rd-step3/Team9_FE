import { useQuery } from '@tanstack/react-query';
import { downloadImageService } from '@/services/images/downloadImage';

/**
 * 이미지 키를 presigned URL로 변환하는 훅 (TanStack Query 사용)
 * @param imageKey 이미지 키
 * @returns { imageUrl: string, isLoading: boolean, error: Error | null }
 */
export const useImageUrl = (imageKey?: string) => {
  const query = useQuery({
    queryKey: ['image-url', imageKey],
    queryFn: () => downloadImageService.getImagePresignedUrl(imageKey || ''),
    enabled: Boolean(imageKey && imageKey.trim().length > 0),
    staleTime: 5 * 60 * 1000,
  });

  return {
    imageUrl: query.data || '',
    isLoading: query.isLoading,
    error: query.error,
  };
};
