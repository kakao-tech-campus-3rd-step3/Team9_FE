import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';
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
    const requestData = {
      title: payload.title,
      description: payload.description,
      detail_description: payload.short_description,
      interests: [payload.category], // 카테고리를 interests 배열로 변환
      region: payload.region,
      study_time: payload.schedule,
      max_members: payload.max_members,
      conditions: payload.conditions,
      file_key: payload.file_key, // 이미지 파일 키
    };

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

  // 전체 이미지 업로드 플로우 (임시 구현 - 서버 준비 전까지)
  uploadImage: async (file: File): Promise<{ file_key: string }> => {
    // TODO: 실제 서버 연동 시 아래 주석 해제하고 위의 실제 구현 사용
    // try {
    //   // 1. Pre-signed URL 요청 (스웨거 API 사용)
    //   const presignedResponse = await studyCreateService.getPresignedUrl(
    //     file.type,
    //   );

    //   // 2. S3에 직접 업로드
    //   await studyCreateService.uploadToS3(
    //     presignedResponse.presigned_url,
    //     file,
    //   );

    //   console.log('이미지 업로드 성공:', presignedResponse.file_key);
    //   return { file_key: presignedResponse.file_key };
    // } catch (error) {
    //   console.error('이미지 업로드 실패:', error);
    //   throw new Error('이미지 업로드에 실패했습니다.');
    // }

    // 임시: 클라이언트에서 파일 키 생성 (서버 준비 전까지)
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileKey = `study/${randomId}${timestamp}/main.${fileExtension}`;

    console.log('임시 파일 키 생성:', fileKey);
    return { file_key: fileKey };
  },
} as const;
