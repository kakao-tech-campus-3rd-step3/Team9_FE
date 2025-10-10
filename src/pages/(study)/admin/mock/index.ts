/**
 * 스터디 관리자 페이지 Mock 데이터
 */

import type {
  StudyMembersResponse,
  StudyApplicationsResponse,
  StudyInfoResponse,
  StudyMember,
  StudyApplication,
} from '../types';

// Mock 스터디 ID
export const MOCK_STUDY_ID = 1;

// 전역 Mock 데이터 상태 (개발 환경에서만 사용)
let mockMembers: StudyMember[] = [];
let mockApplications: StudyApplication[] = [];

// 초기 Mock 데이터 설정
const initializeMockData = () => {
  if (mockMembers.length === 0) {
    mockMembers = [
      {
        member_id: 1,
        user_id: 101,
        nickname: '김철수',
        email: 'kimcs@example.com',
        role: 'Leader',
        join_date: '2024-01-15',
        message: '열심히 참여하겠습니다!',
        user_detail: {
          file_key: '/avatars/kimcs.jpg',
          location: '서울시 강남구',
        },
      },
      {
        member_id: 2,
        user_id: 102,
        nickname: '김민수',
        email: 'kimminsu@example.com',
        role: 'Member',
        join_date: '2024-01-20',
        message: '함께 성장해요!',
        user_detail: {
          file_key: '/avatars/kimminsu.jpg',
          location: '서울시 서초구',
        },
      },
      {
        member_id: 3,
        user_id: 103,
        nickname: '이재민',
        email: 'leejm@example.com',
        role: 'Member',
        join_date: '2024-02-01',
        message: '화이팅!',
        user_detail: {
          location: '서울시 마포구',
        },
      },
      {
        member_id: 4,
        user_id: 104,
        nickname: '김준서',
        email: 'kimjs@example.com',
        role: 'Member',
        join_date: '2024-02-10',
        message: '열심히 해보겠습니다.',
        user_detail: {
          file_key: '/avatars/kimjs.jpg',
          location: '서울시 송파구',
        },
      },
    ];
  }

  if (mockApplications.length === 0) {
    mockApplications = [
      {
        application_id: 1,
        user_id: 201,
        study_id: 1,
        application_date: '2024-03-01',
        status: 'Pending',
        message: '토익 점수 향상을 위해 열심히 참여하겠습니다!',
        user_detail: {
          nickname: '홍길동',
          email: 'honggd@example.com',
          file_key: '/avatars/honggd.jpg',
          location: '서울시 영등포구',
        },
      },
      {
        application_id: 2,
        user_id: 202,
        study_id: 1,
        application_date: '2024-03-05',
        status: 'Pending',
        message: '프론트엔드 개발자로 성장하고 싶어요!',
        user_detail: {
          nickname: '박영희',
          email: 'parkyh@example.com',
          location: '서울시 중구',
        },
      },
      {
        application_id: 3,
        user_id: 203,
        study_id: 1,
        application_date: '2024-03-08',
        status: 'Pending',
        message: 'React와 TypeScript를 배우고 싶습니다.',
        user_detail: {
          nickname: '최민수',
          email: 'choims@example.com',
          file_key: '/avatars/choims.jpg',
          location: '서울시 강동구',
        },
      },
    ];
  }
};

// 초기화 실행
initializeMockData();

// Mock 데이터 조회 함수들
export const getMockMembers = (): StudyMembersResponse => ({
  members: [...mockMembers],
  total_count: mockMembers.length,
});

export const getMockApplications = (): StudyApplicationsResponse => ({
  applications: [...mockApplications],
  total_count: mockApplications.length,
});

// 신청 승인 처리 (Mock)
export const approveApplication = (applicationId: number): boolean => {
  const applicationIndex = mockApplications.findIndex(
    (app) => app.application_id === applicationId,
  );

  if (applicationIndex === -1) return false;

  const application = mockApplications[applicationIndex];

  // 신청자 목록에서 제거
  mockApplications.splice(applicationIndex, 1);

  // 스터디원 목록에 추가
  const newMember: StudyMember = {
    member_id: Math.max(...mockMembers.map((m) => m.member_id), 0) + 1,
    user_id: application.user_id,
    nickname: application.user_detail.nickname,
    email: application.user_detail.email,
    role: 'Member',
    join_date: new Date().toISOString().split('T')[0],
    message: application.message,
    user_detail: application.user_detail,
  };

  mockMembers.push(newMember);

  // 스터디 정보의 현재 멤버 수 업데이트
  mockStudyInfoResponse.study.current_members = mockMembers.length;

  return true;
};

// 신청 거절 처리 (Mock)
export const rejectApplication = (applicationId: number): boolean => {
  const applicationIndex = mockApplications.findIndex(
    (app) => app.application_id === applicationId,
  );

  if (applicationIndex === -1) return false;

  // 신청자 목록에서 제거
  mockApplications.splice(applicationIndex, 1);
  return true;
};

// 하위 호환성을 위한 정적 응답 (사용하지 않음)
export const mockStudyMembersResponse: StudyMembersResponse = getMockMembers();
export const mockStudyApplicationsResponse: StudyApplicationsResponse =
  getMockApplications();

// 스터디 정보 Mock 데이터
export const mockStudyInfoResponse: StudyInfoResponse = {
  study: {
    study_id: 1,
    study_name: '토익 스터디',
    description: '토익 점수 향상을 위한 스터디',
    detailed_description:
      '매주 토익 모의고사를 풀고 함께 공부하는 스터디입니다. 목표 점수는 900점 이상입니다.',
    category: '어학',
    max_members: 4, // 현재 멤버 수와 동일하게 설정
    current_members: 4,
    leader_id: 101,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-03-10T14:30:00Z',
    // 추가 필드들
    schedule: '매주 토요일 오후 2시',
    region: '온라인',
    conditions: ['토익 700점 이상', '열정적인 참여'],
  },
};
