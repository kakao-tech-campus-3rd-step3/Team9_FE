import apiClient from '@/api';
import { PROGRESS_ENDPOINTS } from '@/api/constants';
import type {
  RoadmapResponse,
  MemberStatusResponse,
  MyStatusResponse,
  AddChapterRequest,
  UpdateChapterRequest,
} from '../types';

// 진척도 API 그룹
export const ProgressService = {
  // 전체 로드맵 조회
  getRoadmap: async (studyId: number): Promise<RoadmapResponse> => {
    const { data } = await apiClient.get<RoadmapResponse>(
      PROGRESS_ENDPOINTS.ROADMAP(studyId),
    );
    return data;
  },

  // 스터디 개인별 현황판 조회 (모든 멤버)
  getMemberStatus: async (studyId: number): Promise<MemberStatusResponse> => {
    const { data } = await apiClient.get<MemberStatusResponse>(
      PROGRESS_ENDPOINTS.MEMBER_STATUS(studyId),
    );
    return data;
  },

  // 스터디 본인 현황판 조회
  getMyStatus: async (studyId: number): Promise<MyStatusResponse> => {
    const { data } = await apiClient.get<MyStatusResponse>(
      PROGRESS_ENDPOINTS.MY_STATUS(studyId),
    );
    return data;
  },

  // 로드맵 차시 추가
  addChapter: async (studyId: number, payload: AddChapterRequest) => {
    const { data } = await apiClient.post(
      PROGRESS_ENDPOINTS.ADD_CHAPTER(studyId),
      payload,
      {
        showToast: false, // mutation의 onSuccess에서 toast 처리
      },
    );
    return data;
  },

  // 로드맵 차시 수정
  updateChapter: async (chapterId: number, payload: UpdateChapterRequest) => {
    await apiClient.patch(
      PROGRESS_ENDPOINTS.UPDATE_CHAPTER(chapterId),
      payload,
      {
        showToast: false, // mutation의 onSuccess에서 toast 처리
      },
    );
  },

  // 로드맵 차시 완료 처리
  completeChapter: async (chapterId: number) => {
    await apiClient.post(
      PROGRESS_ENDPOINTS.COMPLETE_CHAPTER(chapterId),
      {},
      {
        showToast: false, // mutation의 onSuccess에서 toast 처리
      },
    );
  },

  // 로드맵 차시 삭제
  deleteChapter: async (chapterId: number) => {
    await apiClient.delete(PROGRESS_ENDPOINTS.DELETE_CHAPTER(chapterId), {
      showToast: false, // mutation의 onSuccess에서 toast 처리
    });
  },
};

export default ProgressService;
