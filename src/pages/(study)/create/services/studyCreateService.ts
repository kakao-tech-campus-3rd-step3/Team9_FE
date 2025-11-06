import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';
import { uploadPhotoWithPresignedUrl } from '@/utils/upload';
import type { CreateStudyRequest, ImageUploadResponse } from '../types';

/**
 * 스터디 생성 서비스
 * - 스터디 생성
 * - 이미지 업로드
 * - 기존 API 에러 처리 구조 활용
 */
export const studyCreateService = {
  // 스터디 생성 (스웨거 방식 - file_key 사용)
  createStudy: async (payload: CreateStudyRequest) => {
    const requestData: Record<string, unknown> = {
      title: payload.title,
      // 백엔드 description = 한 줄 소개 (100자 제한)
      description: payload.short_description,
      // 백엔드 detail_description = 상세 설명
      detail_description: payload.description,
      interests: payload.interests, // 이미 배열로 전달됨
      region: payload.region,
      study_time: payload.schedule,
      max_members: payload.max_members,
      conditions: payload.conditions,
    };

    // file_key가 있을 때만 요청에 포함
    if (payload.file_key) {
      requestData.file_key = payload.file_key;
    }

    console.log('스터디 생성 API 요청 데이터:', requestData);

    const { data } = await apiClient.post(
      STUDY_ENDPOINTS.STUDY_CREATE,
      requestData,
    );
    return data;
  },

  // Pre-signed URL 요청 (스웨거 API 사용)
  getPresignedUrl: async (
    contentType: string,
  ): Promise<ImageUploadResponse> => {
    const { data } = await apiClient.post<ImageUploadResponse>(
      STUDY_ENDPOINTS.IMAGE_UPLOAD,
      {
        content_type: contentType,
      },
    );
    return data;
  },

  // S3에 직접 이미지 업로드
  uploadToS3: async (presignedUrl: string, file: File): Promise<void> => {
    await apiClient.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },

  // 전체 이미지 업로드 플로우 (회원가입과 동일한 방식 사용)
  uploadImage: async (file: File): Promise<{ file_key: string }> => {
    try {
      // uploadPhotoWithPresignedUrl를 사용하여 S3에 직접 업로드
      // 이 함수는 presigned URL 요청과 S3 업로드를 모두 처리함
      const fileKey = await uploadPhotoWithPresignedUrl(file);

      console.log('✅ 스터디 이미지 업로드 성공:', fileKey);
      return { file_key: fileKey };
    } catch (error) {
      console.error('❌ 스터디 이미지 업로드 실패:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  },
} as const;
