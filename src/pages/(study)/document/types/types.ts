/**
 * 문서 관리 페이지 타입 정의
 */

export interface Material {
  id: string;
  title: string;
  content: string;
  category: string;
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

export interface MaterialCategory {
  id: string;
  name: string;
  week: number;
}

export interface MaterialFormData {
  title: string;
  content: string;
  category: string;
}
