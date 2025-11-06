import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { reflectionKeys } from '@/constants/queryKeys';
import { reflectionService } from '../services';
import type { ReflectionFormData } from '../schemas';

/**
 * 회고 목록 조회
 */
export const useReflectionsQuery = (
  studyId: number,
  params?: {
    author?: string;
    page?: number;
    size?: number;
    sort?: string[];
  },
) => {
  return useQuery({
    queryKey: reflectionKeys.list(studyId, params),
    queryFn: () => reflectionService.getReflections(studyId, params),
    enabled: Number.isFinite(studyId) && studyId > 0,
    staleTime: 60 * 1000, // 1분
  });
};

/**
 * 회고 상세 조회
 */
export const useReflectionDetailQuery = (
  studyId: number,
  reflectionId: number,
) => {
  return useQuery({
    queryKey: reflectionKeys.detail(studyId, reflectionId),
    queryFn: () => reflectionService.getReflectionDetail(studyId, reflectionId),
    enabled:
      Number.isFinite(studyId) &&
      studyId > 0 &&
      Number.isFinite(reflectionId) &&
      reflectionId > 0,
    staleTime: 60 * 1000, // 1분
  });
};

/**
 * 회고 작성 Mutation
 */
export const useCreateReflectionMutation = (studyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReflectionFormData) =>
      reflectionService.createReflection(studyId, payload),
    onSuccess: () => {
      // 목록 캐시 무효화 (모든 파라미터 조합에 대해)
      queryClient.invalidateQueries({
        queryKey: ['reflection-list', studyId],
      });
      toast.success('회고가 작성되었습니다.');
    },
    onError: (error) => {
      console.error('회고 작성 실패:', error);
      // 에러는 apiClient 인터셉터에서 처리됨
    },
  });
};

/**
 * 회고 수정 Mutation
 */
export const useUpdateReflectionMutation = (
  studyId: number,
  reflectionId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReflectionFormData) =>
      reflectionService.updateReflection(studyId, reflectionId, payload),
    onSuccess: () => {
      // 상세 및 목록 캐시 무효화 (모든 파라미터 조합에 대해)
      queryClient.invalidateQueries({
        queryKey: reflectionKeys.detail(studyId, reflectionId),
      });
      queryClient.invalidateQueries({
        queryKey: ['reflection-list', studyId],
      });
      toast.success('회고가 수정되었습니다.');
    },
    onError: (error) => {
      console.error('회고 수정 실패:', error);
      // 에러는 apiClient 인터셉터에서 처리됨
    },
  });
};

/**
 * 회고 삭제 Mutation
 */
export const useDeleteReflectionMutation = (studyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reflectionId: number) =>
      reflectionService.deleteReflection(studyId, reflectionId),
    onSuccess: () => {
      // 목록 캐시 무효화 (모든 파라미터 조합에 대해)
      queryClient.invalidateQueries({
        queryKey: ['reflection-list', studyId],
      });
      toast.success('회고가 삭제되었습니다.');
    },
    onError: (error) => {
      console.error('회고 삭제 실패:', error);
      // 에러는 apiClient 인터셉터에서 처리됨
    },
  });
};
