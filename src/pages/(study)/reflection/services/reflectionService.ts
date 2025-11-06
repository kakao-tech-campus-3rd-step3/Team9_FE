import apiClient from '@/api';
import { REFLECTION_ENDPOINTS } from '@/api/constants';
import type { Reflection, ReflectionListItem } from '../types';
import type { ReflectionFormData } from '../schemas';

// API 응답 타입 (서버에서 받는 형식 - camelCase)
interface ReflectionListApiResponse {
  reflections: Array<{
    reflectionId: number;
    title: string;
    authorName: string;
    scheduleTitle: string | null;
    updated_at: string;
  }>;
  page: number;
  size: number;
  hasNext: boolean;
}

interface ReflectionDetailApiResponse {
  id: number;
  title: string;
  studyId: number;
  studyMemberId: number;
  scheduleId: number | null;
  satisfactionScore: number;
  understandingScore: number;
  participationScore: number;
  learnedContent: string;
  improvement: string;
  createdAt: string;
  updatedAt: string;
}

// API 요청 타입 (camelCase)
interface ReflectionCreateRequest {
  title: string;
  scheduleId: number | null;
  satisfactionScore: number;
  understandingScore: number;
  participationScore: number;
  learnedContent: string;
  improvement: string;
}

// API 응답을 프론트엔드 타입으로 변환
const mapApiResponseToReflection = (
  apiResponse: ReflectionDetailApiResponse,
): Reflection => ({
  id: apiResponse.id,
  study_id: apiResponse.studyId,
  study_member_id: apiResponse.studyMemberId,
  schedule_id: apiResponse.scheduleId,
  title: apiResponse.title,
  satisfaction_score: apiResponse.satisfactionScore,
  understanding_score: apiResponse.understandingScore,
  participation_score: apiResponse.participationScore,
  learned_content: apiResponse.learnedContent,
  improvement: apiResponse.improvement,
  created_at: apiResponse.createdAt,
  updated_at: apiResponse.updatedAt,
});

const mapApiListItemToReflectionListItem = (
  apiItem: ReflectionListApiResponse['reflections'][0],
): ReflectionListItem => ({
  id: apiItem.reflectionId,
  title: apiItem.title,
  author: apiItem.authorName,
  schedule_title: apiItem.scheduleTitle,
  updated_at: apiItem.updated_at,
});

// ReflectionFormData를 API 요청 형식으로 변환
const mapFormDataToRequest = (
  formData: ReflectionFormData,
): ReflectionCreateRequest => ({
  title: formData.title,
  scheduleId: formData.schedule_id ?? null,
  satisfactionScore: formData.satisfaction_score,
  understandingScore: formData.understanding_score,
  participationScore: formData.participation_score,
  learnedContent: formData.learned_content,
  improvement: formData.improvement,
});

/**
 * 회고 API 서비스
 */
export const reflectionService = {
  /**
   * 회고 목록 조회
   */
  getReflections: async (
    studyId: number,
    params?: {
      author?: string;
      page?: number;
      size?: number;
      sort?: string[];
    },
  ) => {
    const queryParams: Record<string, string | number | string[]> = {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    };

    if (params?.author) {
      queryParams.author = params.author;
    }

    if (params?.sort && params.sort.length > 0) {
      queryParams.sort = params.sort;
    }

    const { data } = await apiClient.get<ReflectionListApiResponse>(
      REFLECTION_ENDPOINTS.LIST(studyId),
      {
        params: queryParams,
        showToast: false, // 목록 조회는 토스트 표시하지 않음
      },
    );

    return {
      reflections: data.reflections.map(mapApiListItemToReflectionListItem),
      page: data.page,
      size: data.size,
      hasNext: data.hasNext,
    };
  },

  /**
   * 회고 상세 조회
   */
  getReflectionDetail: async (
    studyId: number,
    reflectionId: number,
  ): Promise<Reflection> => {
    const { data } = await apiClient.get<ReflectionDetailApiResponse>(
      REFLECTION_ENDPOINTS.DETAIL(studyId, reflectionId),
      {
        showToast: false,
      },
    );

    return mapApiResponseToReflection(data);
  },

  /**
   * 회고 작성
   */
  createReflection: async (
    studyId: number,
    payload: ReflectionFormData,
  ): Promise<Reflection> => {
    const requestBody = mapFormDataToRequest(payload);
    const { data } = await apiClient.post<ReflectionDetailApiResponse>(
      REFLECTION_ENDPOINTS.CREATE(studyId),
      requestBody,
    );

    return mapApiResponseToReflection(data);
  },

  /**
   * 회고 수정
   */
  updateReflection: async (
    studyId: number,
    reflectionId: number,
    payload: ReflectionFormData,
  ): Promise<Reflection> => {
    const requestBody = mapFormDataToRequest(payload);
    const { data } = await apiClient.patch<ReflectionDetailApiResponse>(
      REFLECTION_ENDPOINTS.UPDATE(studyId, reflectionId),
      requestBody,
    );

    return mapApiResponseToReflection(data);
  },

  /**
   * 회고 삭제
   */
  deleteReflection: async (
    studyId: number,
    reflectionId: number,
  ): Promise<void> => {
    await apiClient.delete(REFLECTION_ENDPOINTS.DELETE(studyId, reflectionId), {
      showToast: false, // 삭제 성공 시 별도 토스트 처리
    });
  },
} as const;
