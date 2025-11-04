/**
 * 스터디 탐색 페이지 API 서비스
 */

import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';
import type { Study } from '../types';

// 백엔드 응답 타입
interface StudyListResponse {
  studies: Array<{
    study_id: number;
    title: string;
    description: string;
    detail_description?: string;
    interests: string[]; // 카테고리 배열
    region: string;
    study_time?: string;
    max_members: number;
    current_members: number;
    file_key?: string;
    conditions?: string[];
  }>;
  total_count?: number;
}

/**
 * 스터디 목록 조회
 */
export const getStudyList = async (): Promise<Study[]> => {
  try {
    const response = await apiClient.get<StudyListResponse>(
      STUDY_ENDPOINTS.LIST,
      {
        showToast: false,
      },
    );

    // 백엔드 응답을 프론트엔드 타입으로 변환
    const studies: Study[] = (response.data.studies || []).map((study) => ({
      id: study.study_id,
      title: study.title,
      description: study.description,
      category:
        Array.isArray(study.interests) && study.interests.length > 0
          ? study.interests[0]
          : '',
      currentMembers: study.current_members,
      maxMembers: study.max_members,
      region: study.region,
      detailedDescription: study.detail_description,
      schedule: study.study_time,
      requirements: study.conditions || [],
      imageUrl: study.file_key
        ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/images/${study.file_key}`
        : undefined,
    }));

    return studies;
  } catch (error) {
    console.error('스터디 목록 조회 실패:', error);
    throw error;
  }
};
