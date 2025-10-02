import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';
import type { CreateStudyRequest } from '../types';

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

  // 이미지 업로드 (임시 - 실제 서버 연동 시 수정 필요)
  uploadImage: async (file: File) => {
    // TODO: 실제 이미지 업로드 API 연동 시 아래 코드로 교체
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('folder', 'study');
    // const { data } = await apiClient.post(STUDY_ENDPOINTS.IMAGE_UPLOAD, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // });
    // return data;

    // 임시: 클라이언트에서 파일 키 생성 (실제 서버 연동 전까지)
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const fileKey = `study/${randomId}${timestamp}/main.${fileExtension}`;

    console.log('임시 파일 키 생성:', fileKey);
    return { file_key: fileKey };
  },
} as const;
