/**
 * 스터디 관리자 페이지 API 서비스 함수들
 */

import { publicClient } from '@/api';
import type {
  StudyMembersResponse,
  ChangeRoleRequest,
  ChangeRoleResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
  StudyApplicationsResponse,
  ChangeApplicationStatusRequest,
  ChangeApplicationStatusResponse,
  StudyInfoResponse,
  UpdateStudyInfoRequest,
  UpdateStudyInfoResponse,
  DelegateLeadershipRequest,
  DelegateLeadershipResponse,
} from '../types';

// API 엔드포인트 상수
const API_ENDPOINTS = {
  STUDY_MEMBERS: (studyId: number) => `/studies/${studyId}/members`,
  CHANGE_MEMBER_ROLE: (studyId: number, memberId: number) =>
    `/studies/${studyId}/members/${memberId}/role`,
  REMOVE_MEMBER: (studyId: number, memberId: number) =>
    `/studies/${studyId}/members/${memberId}`,
  STUDY_APPLICATIONS: (studyId: number) => `/studies/${studyId}/applications`,
  CHANGE_APPLICATION_STATUS: (studyId: number, applicationId: number) =>
    `/studies/${studyId}/applications/${applicationId}/status`,
  STUDY_INFO: (studyId: number) => `/studies/${studyId}`,
  UPDATE_STUDY_INFO: (studyId: number) => `/studies/${studyId}`,
  DELEGATE_LEADERSHIP: (studyId: number) =>
    `/studies/${studyId}/delegate-leadership`,
} as const;

/**
 * 스터디원 목록 조회
 */
export const getStudyMembers = async (
  studyId: number,
): Promise<StudyMembersResponse> => {
  try {
    const response = await publicClient.get(
      API_ENDPOINTS.STUDY_MEMBERS(studyId),
    );
    return response.data;
  } catch (error) {
    console.error('스터디원 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 스터디원 역할 변경
 */
export const changeMemberRole = async (
  studyId: number,
  request: ChangeRoleRequest,
): Promise<ChangeRoleResponse> => {
  try {
    const response = await publicClient.patch(
      API_ENDPOINTS.CHANGE_MEMBER_ROLE(studyId, request.member_id),
      { role: request.role },
    );
    return response.data;
  } catch (error) {
    console.error('스터디원 역할 변경 실패:', error);
    throw error;
  }
};

/**
 * 스터디원 탈퇴 처리
 */
export const removeMember = async (
  studyId: number,
  request: RemoveMemberRequest,
): Promise<RemoveMemberResponse> => {
  try {
    const response = await publicClient.delete(
      API_ENDPOINTS.REMOVE_MEMBER(studyId, request.member_id),
    );
    return response.data;
  } catch (error) {
    console.error('스터디원 탈퇴 처리 실패:', error);
    throw error;
  }
};

/**
 * 신청자 목록 조회
 */
export const getStudyApplications = async (
  studyId: number,
): Promise<StudyApplicationsResponse> => {
  try {
    const response = await publicClient.get(
      API_ENDPOINTS.STUDY_APPLICATIONS(studyId),
    );
    return response.data;
  } catch (error) {
    console.error('신청자 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 신청 상태 변경 (승인/거절)
 */
export const changeApplicationStatus = async (
  studyId: number,
  request: ChangeApplicationStatusRequest,
): Promise<ChangeApplicationStatusResponse> => {
  try {
    const response = await publicClient.patch(
      API_ENDPOINTS.CHANGE_APPLICATION_STATUS(studyId, request.application_id),
      { status: request.status },
    );
    return response.data;
  } catch (error) {
    console.error('신청 상태 변경 실패:', error);
    throw error;
  }
};

/**
 * 스터디 정보 조회
 */
export const getStudyInfo = async (
  studyId: number,
): Promise<StudyInfoResponse> => {
  try {
    const response = await publicClient.get(API_ENDPOINTS.STUDY_INFO(studyId));
    return response.data;
  } catch (error) {
    console.error('스터디 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 스터디 정보 수정
 */
export const updateStudyInfo = async (
  studyId: number,
  request: UpdateStudyInfoRequest,
): Promise<UpdateStudyInfoResponse> => {
  try {
    const response = await publicClient.patch(
      API_ENDPOINTS.UPDATE_STUDY_INFO(studyId),
      request,
    );
    return response.data;
  } catch (error) {
    console.error('스터디 정보 수정 실패:', error);
    throw error;
  }
};

/**
 * 리더 위임
 */
export const delegateLeadership = async (
  studyId: number,
  request: DelegateLeadershipRequest,
): Promise<DelegateLeadershipResponse> => {
  try {
    const response = await publicClient.post(
      API_ENDPOINTS.DELEGATE_LEADERSHIP(studyId),
      request,
    );
    return response.data;
  } catch (error) {
    console.error('리더 위임 실패:', error);
    throw error;
  }
};
