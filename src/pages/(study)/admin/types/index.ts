/**
 * 관리자 페이지 타입 정의
 */

export interface StudyMember {
  id: string;
  name: string;
  role: 'leader' | 'member';
  joinDate: string;
  email: string;
}

export interface StudyApplicant {
  id: string;
  name: string;
  email: string;
  applyDate: string;
  message?: string;
}

export interface StudyInfo {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  maxMembers: number;
  currentMembers: number;
  image?: string;
  schedule: string;
  region: string;
  conditions: string[];
}

export type AdminTabType = 'members' | 'applicants' | 'study-info';
