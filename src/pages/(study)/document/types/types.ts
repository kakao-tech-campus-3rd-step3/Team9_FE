/**
 * 문서 관리 페이지 타입 정의
 */

export interface Material {
  id: string;
  title: string;
  content: string;
  week: number;
  category: string; // 공지 | 학습자료 등
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

// 업로드 요청 바디의 파일 항목 스키마
export interface UploadFileItem {
  id: number | null;
  name: string;
  key: string; // 스토리지 키 또는 식별자
  size: number;
  file_type: string; // 예: .pdf, .pptx
}

export interface MaterialCategory {
  id: string;
  name: string;
  week: number;
}

export interface MaterialFormData {
  title: string;
  content: string;
  week: number;
  category: string;
  files: UploadFileItem[]; // 업로드 요청 바디와 동일 구조
}

// 문서 API 타입 (서비스가 재사용)
export interface MaterialUploadPayload {
  title: string;
  category: string;
  week: number | null; // LEARNING일 때만 숫자, 그 외는 null
  content: string;
  files: UploadFileItem[];
}

export interface MaterialListParams {
  studyId: number;
  category?: string[];
  week?: number[];
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}
