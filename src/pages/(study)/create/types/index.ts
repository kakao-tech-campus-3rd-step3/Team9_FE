/**
 * 스터디 생성 페이지 관련 타입 정의
 */

export interface StudyFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  maxMembers: number;
  schedule: string;
  region: string;
  conditions: string[];
}

export interface ToastState {
  isVisible: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CreateStudyRequest {
  title: string;
  description: string;
  short_description: string;
  category: string;
  max_members: number;
  schedule: string;
  region: string;
  conditions: string[];
  file_key?: string; // 이미지 파일 키 (스웨거 방식)
}
