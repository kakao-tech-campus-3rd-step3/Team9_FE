import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { progressKeys } from '@/constants/queryKeys';
import { ProgressService } from '../services';
import type { AddChapterRequest, UpdateChapterRequest } from '../types';

// 전체 로드맵 조회
export const useStudyRoadmapQuery = (studyId: number) => {
  return useQuery({
    queryKey: progressKeys.roadmap(studyId),
    queryFn: () => ProgressService.getRoadmap(studyId),
    enabled: Number.isFinite(studyId) && studyId > 0,
    staleTime: 60 * 1000,
  });
};

// 스터디 개인별 현황판 조회 (모든 멤버)
export const useStudyMemberStatusQuery = (studyId: number) => {
  return useQuery({
    queryKey: progressKeys.memberStatus(studyId),
    queryFn: () => ProgressService.getMemberStatus(studyId),
    enabled: Number.isFinite(studyId) && studyId > 0,
    staleTime: 60 * 1000,
  });
};

// 스터디 본인 현황판 조회
export const useMyStudyStatusQuery = (studyId: number) => {
  return useQuery({
    queryKey: progressKeys.myStatus(studyId),
    queryFn: () => ProgressService.getMyStatus(studyId),
    enabled: Number.isFinite(studyId) && studyId > 0,
    staleTime: 60 * 1000,
  });
};

// 차시 추가 뮤테이션
export const useAddChapterMutation = (studyId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddChapterRequest) =>
      ProgressService.addChapter(studyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.roadmap(studyId),
      });
      toast.success('차시가 추가되었습니다.');
    },
    onError: () => {
      toast.error('차시 추가 중 오류가 발생했습니다.');
    },
  });
};

// 차시 수정 뮤테이션
export const useUpdateChapterMutation = (studyId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      chapterId,
      payload,
    }: {
      chapterId: number;
      payload: UpdateChapterRequest;
    }) => ProgressService.updateChapter(chapterId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.roadmap(studyId),
      });
      toast.success('차시가 수정되었습니다.');
    },
    onError: () => {
      toast.error('차시 수정 중 오류가 발생했습니다.');
    },
  });
};

// 차시 완료 처리 뮤테이션
export const useCompleteChapterMutation = (studyId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chapterId: number) =>
      ProgressService.completeChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.roadmap(studyId),
      });
      toast.success('차시가 완료 처리되었습니다.');
    },
    onError: () => {
      toast.error('차시 완료 처리 중 오류가 발생했습니다.');
    },
  });
};

// 차시 삭제 뮤테이션
export const useDeleteChapterMutation = (studyId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chapterId: number) => ProgressService.deleteChapter(chapterId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: progressKeys.roadmap(studyId),
      });
      toast.success('차시가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('차시 삭제 중 오류가 발생했습니다.');
    },
  });
};
