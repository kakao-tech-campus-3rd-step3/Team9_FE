/**
 * 대시보드 관련 타입 정의
 */

export interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isImportant: boolean;
}

export interface Document {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'image';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Schedule {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'study' | 'meeting' | 'deadline';
  participants: string[];
}

export interface StudyInfo {
  name: string;
}

export interface MyRanking {
  rank: number;
  score: number;
}
