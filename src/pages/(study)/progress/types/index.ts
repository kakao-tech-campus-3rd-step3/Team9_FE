/**
 * 진척도 페이지 관련 타입 정의
 */

// 차시(Chapter) 타입
export interface Chapter {
  id?: number;
  content: string;
  completed: boolean;
}

// 진척도 멤버 상태 타입
export interface ProgressMemberStatus {
  nickname: string;
  role: string;
  attendance_count: number;
  quiz_count: number;
  reflection_count?: number;
}

// 로드맵 조회 응답 타입
export interface RoadmapResponse {
  chapters: Chapter[];
}

// 개인별 현황판 조회 응답 타입
export interface MemberStatusResponse {
  progressMemberStatusDto: ProgressMemberStatus[];
}

// 본인 현황판 조회 응답 타입
export interface MyStatusResponse {
  progressMemberStatusDto: ProgressMemberStatus[];
}

// 차시 추가 요청 타입
export interface AddChapterRequest {
  content: string;
}

// 차시 수정 요청 타입
export interface UpdateChapterRequest {
  content: string;
}
