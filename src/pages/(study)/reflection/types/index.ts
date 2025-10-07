// 회고 관련 타입 정의

export interface Reflection {
  id: number;
  study_id: number;
  study_member_id: number;
  schedule_id: number | null;
  title: string;
  satisfaction_score: number;
  understanding_score: number;
  participation_score: number;
  learned_content: string;
  improvement: string;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  schedule_id: number;
  schedule_title: string;
}

export interface ReflectionFormData {
  schedule_id: number | null;
  title: string;
  satisfaction_score: number;
  understanding_score: number;
  participation_score: number;
  learned_content: string;
  improvement: string;
}

export interface ReflectionListItem {
  id: number;
  title: string;
  author: string;
  schedule_title: string | null;
  updated_at: string;
}
