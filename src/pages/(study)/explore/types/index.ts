/**
 * 스터디 탐색 페이지 관련 타입 정의
 */

export interface Study {
  id: number;
  title: string;
  description: string;
  category: string;
  currentMembers: number;
  maxMembers: number;
  region: string;
  imageUrl?: string;
  detailedDescription?: string;
  schedule?: string;
  duration?: string;
  requirements?: string[];
}

export interface ToastState {
  isVisible: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface StudyListParams {
  page?: number;
  size?: number;
  keyword?: string;
  interests?: string[];
  locations?: string[];
}

export interface StudyApplyRequest {
  study_id: number;
  message?: string;
}
