/**
 * 스터디 관리자 페이지 API 타입 정의
 */

// 스터디원 정보
export interface StudyMember {
  member_id: number;
  user_id: number;
  nickname: string;
  email: string;
  role: 'Leader' | 'Member';
  join_date: string;
  message?: string;
  user_detail: {
    file_key?: string;
    location: string;
  };
}

// 스터디원 목록 조회 응답
export interface StudyMembersResponse {
  members: StudyMember[];
  total_count: number;
}

// 스터디원 역할 변경 요청
export interface ChangeRoleRequest {
  member_id: number;
  role: 'Leader' | 'Member';
}

// 스터디원 역할 변경 응답
export interface ChangeRoleResponse {
  success: boolean;
  message: string;
}

// 스터디원 탈퇴 요청
export interface RemoveMemberRequest {
  member_id: number;
}

// 스터디원 탈퇴 응답
export interface RemoveMemberResponse {
  success: boolean;
  message: string;
}

// 신청자 정보 (API 문서에 맞게 수정)
export interface StudyApplication {
  applicationId: number;
  nickname: string;
  applicationMessage: string;
  appliedAt: string;
  userDetail: {
    file_key?: string;
    gender: string;
    interests: string[];
    location: string;
    email?: string;
  };
}

// 신청자 목록 조회 응답
export interface StudyApplicationsResponse {
  applicants: StudyApplication[];
}

// 신청 상태 변경 요청
export interface ChangeApplicationStatusRequest {
  application_id: number;
  status: 'Accepted' | 'Rejected' | 'Pending';
}

// 신청 상태 변경 응답
export interface ChangeApplicationStatusResponse {
  success: boolean;
  message: string;
}

// 스터디 정보
export interface StudyInfo {
  study_id: number;
  study_name: string;
  description: string;
  detailed_description: string;
  category: string;
  max_members: number;
  current_members: number;
  leader_id: number;
  created_at: string;
  updated_at: string;
  // 추가 필드들
  schedule?: string;
  region?: string;
  conditions?: string[];
  file_key?: string; // 스터디 대표 이미지 키
  image_url?: string; // 스터디 대표 이미지 URL (deprecated, file_key 사용)
}

// 스터디 정보 조회 응답
export interface StudyInfoResponse {
  study: StudyInfo;
}

// 스터디 정보 수정 요청
export interface UpdateStudyInfoRequest {
  study_name?: string;
  description?: string;
  detailed_description?: string;
  category?: string;
  max_members?: number;
}

// 스터디 정보 수정 응답
export interface UpdateStudyInfoResponse {
  success: boolean;
  message: string;
  study: StudyInfo;
}

// 리더 위임 요청
export interface DelegateLeadershipRequest {
  new_leader_id: number;
}

// 리더 위임 응답
export interface DelegateLeadershipResponse {
  success: boolean;
  message: string;
}

// API 에러 응답
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
