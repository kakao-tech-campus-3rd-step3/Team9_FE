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
  id: number;
  name: string;
}

export interface MyRanking {
  rank: number;
  score: number;
}

// 랭킹 관련 타입
export interface RankingItem {
  userId: number;
  userName: string;
  rank: number;
  score: number;
  isMe?: boolean;
}

export interface RankingData {
  rankings: RankingItem[];
  myRanking: RankingItem;
  totalCount: number;
}

// 진척도 관련 타입
export interface ProgressData {
  attendance: {
    current: number;
    total: number;
    percentage: number;
  };
  quiz: {
    current: number;
    total: number;
    percentage: number;
  };
  reflection: {
    current: number;
    total: number;
    percentage: number;
  };
}

// 회고 관련 타입
export interface PastSchedule {
  id: number;
  title: string;
  date: string;
  type: 'study' | 'meeting' | 'deadline';
}

export interface RetrospectData {
  pendingSchedules: PastSchedule[];
  totalCount: number;
}

// 퀴즈 관련 타입
export interface QuizData {
  pendingCount: number;
  totalCount: number;
}

// 대시보드 통합 데이터 타입
export interface DashboardData {
  study_title: string;
  latest_notice?: Notice;
  upcoming_schedule?: Schedule;
  ranking?: RankingData;
  progress?: ProgressData;
  retrospect?: RetrospectData;
  quiz?: QuizData;
}
