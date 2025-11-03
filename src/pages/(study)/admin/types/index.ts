/**
 * 스터디 관리자 페이지 API 타입 정의
 */

// 스터디원 정보
// API 문서 기준: { nickname, role, message, user_detail: { file_key, gender, interests, location } }
// 실제 사용 시 필요한 추가 필드들은 optional로 처리
export interface StudyMember {
  member_id?: number; // API 문서에 없지만 실제로 필요 (리더 위임, 역할 변경, 탈퇴 등)
  user_id?: number; // API 문서에 없지만 실제로 필요할 수 있음
  nickname: string; // API 문서: 필수
  email?: string; // API 문서에 없지만 UI 표시용
  role: 'Leader' | 'Member'; // API 문서: 필수
  join_date?: string; // API 문서에 없음 (이미 UI에서 제거됨)
  message?: string; // API 문서: 선택
  user_detail: {
    file_key?: string; // API 문서: 선택
    gender?: string; // API 문서에 있음
    interests?: string[]; // API 문서에 있음
    location: string; // API 문서: 필수
    email?: string; // API 문서에 없지만 필요할 수 있음
  };
}

// 스터디원 목록 조회 응답
// API 문서 기준: { members: [...] }
export interface StudyMembersResponse {
  members: StudyMember[];
  total_count?: number; // API 문서에 없지만 실제 응답에 포함될 수 있음
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
