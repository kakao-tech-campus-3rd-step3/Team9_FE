import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';
import type { StudyListParams, StudyApplyRequest } from '../types';

/**
 * 스터디 탐색 서비스
 * - 스터디 목록 조회 및 검색
 * - 스터디 신청
 * - 기존 API 에러 처리 구조 활용
 */
export const studyExploreService = {
  // 스터디 목록 조회 및 검색
  getStudies: async (params: StudyListParams = {}) => {
    const { data } = await apiClient.get(STUDY_ENDPOINTS.STUDIES, {
      params: {
        page: params.page || 0,
        size: params.size || 10,
        keyword: params.keyword,
        interests: params.interests?.join(','),
        locations: params.locations?.join(','),
      },
    });
    return data.studies;
  },

  // 스터디 상세 조회
  getStudyDetail: async (id: number) => {
    const { data } = await apiClient.get(STUDY_ENDPOINTS.STUDY_DETAIL(id));
    return data;
  },

  // 스터디 신청
  applyStudy: async (payload: StudyApplyRequest) => {
    const { data } = await apiClient.post(
      STUDY_ENDPOINTS.STUDY_APPLY(payload.study_id),
      { message: payload.message },
      { showToast: false }, // 신청은 별도 토스트 처리
    );
    return data;
  },
} as const;
