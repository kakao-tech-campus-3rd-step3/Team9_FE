import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';
import type { StudyListParams, StudyApplyRequest, Study } from '../types';

// API 응답 타입 정의
interface ApiStudyResponse {
  id: number;
  title: string;
  description: string;
  file_key?: string;
  detail_description?: string;
  interests?: string[];
  region?: string;
  study_time?: string;
  conditions?: string[];
  current_members?: number;
  max_members?: number;
}

// API 응답을 프론트엔드 타입으로 변환하는 매퍼 함수
const mapApiResponseToStudy = (apiStudy: ApiStudyResponse): Study => ({
  id: apiStudy.id,
  title: apiStudy.title,
  description: apiStudy.description,
  category: apiStudy.interests?.[0] || '프로그래밍', // 첫 번째 interest를 카테고리로 사용
  currentMembers: apiStudy.current_members || 1,
  maxMembers: apiStudy.max_members || 10,
  region: apiStudy.region || '전체',
  imageUrl: apiStudy.file_key
    ? `https://gogumalatte.site/api/download/photos/${apiStudy.file_key}`
    : undefined,
  detailedDescription: apiStudy.detail_description || apiStudy.description,
  schedule: apiStudy.study_time,
  requirements: apiStudy.conditions,
});

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

    // 각 스터디의 상세 정보를 병렬로 조회
    const studiesWithDetails = await Promise.all(
      data.studies.map(async (study: ApiStudyResponse) => {
        try {
          const detailResponse = await apiClient.get(
            STUDY_ENDPOINTS.STUDY_DETAIL(study.id),
          );
          return { ...study, ...detailResponse.data } as ApiStudyResponse;
        } catch (error) {
          console.warn(`Failed to fetch details for study ${study.id}:`, error);
          return study; // 상세 정보 조회 실패 시 기본 정보만 반환
        }
      }),
    );

    return studiesWithDetails.map(mapApiResponseToStudy);
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
