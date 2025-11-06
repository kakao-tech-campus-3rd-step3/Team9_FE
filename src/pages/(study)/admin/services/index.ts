/**
 * 스터디 관리자 페이지 API 서비스 함수들
 */

import { AxiosError } from 'axios';
import apiClient from '@/api';
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
  STUDY_MEMBERS: (studyId: number) => `/api/studies/${studyId}/members`,
  CHANGE_MEMBER_ROLE: (studyId: number, memberId: number) =>
    `/api/studies/${studyId}/members/${memberId}/role`,
  REMOVE_MEMBER: (studyId: number, memberId: number) =>
    `/api/studies/${studyId}/members/${memberId}`,
  STUDY_APPLICATIONS: (studyId: number) => `/api/studies/${studyId}/applicants`,
  CHANGE_APPLICATION_STATUS: (studyId: number, applicationId: number) =>
    `/api/studies/${studyId}/applications/${applicationId}`,
  STUDY_INFO: (studyId: number) => `/api/studies/${studyId}`,
  UPDATE_STUDY_INFO: (studyId: number) => `/api/studies/${studyId}`,
  DELEGATE_LEADERSHIP: (studyId: number) => `/api/studies/${studyId}/leader`,
} as const;

/**
 * 스터디원 목록 조회
 */
export const getStudyMembers = async (
  studyId: number,
): Promise<StudyMembersResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STUDY_MEMBERS(studyId), {
      showToast: false,
    });
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
    const response = await apiClient.patch(
      API_ENDPOINTS.CHANGE_MEMBER_ROLE(studyId, request.member_id),
      { role: request.role },
      { showToast: false },
    );
    return response.data;
  } catch (error) {
    console.error('스터디원 역할 변경 실패:', error);
    throw error;
  }
};

/**
 * 스터디원 탈퇴 처리 (API 스펙: DELETE /api/studies/{study_id}/members/{member_id})
 * 성공 시 204 No Content (body 없음)
 */
export const removeMember = async (
  studyId: number,
  request: RemoveMemberRequest,
): Promise<RemoveMemberResponse> => {
  try {
    console.log('[API 호출] 스터디원 탈퇴', {
      url: API_ENDPOINTS.REMOVE_MEMBER(studyId, request.member_id),
      method: 'DELETE',
      studyId,
      memberId: request.member_id,
    });

    const response = await apiClient.delete(
      API_ENDPOINTS.REMOVE_MEMBER(studyId, request.member_id),
      { showToast: false },
    );

    console.log('[API 응답] 스터디원 탈퇴 성공', {
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      data: response.data,
    });

    // 204 No Content는 body가 없을 수 있으므로 성공 응답 반환
    if (response.status === 204 || !response.data) {
      return {
        success: true,
        message: '스터디원이 탈퇴되었습니다.',
      };
    }

    return response.data;
  } catch (error) {
    console.error('[API 에러] 스터디원 탈퇴 실패:', error);
    if (error instanceof AxiosError) {
      console.error('[API 에러 상세]', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
    }
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
    const response = await apiClient.get(
      API_ENDPOINTS.STUDY_APPLICATIONS(studyId),
      { showToast: false },
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
    const url = API_ENDPOINTS.CHANGE_APPLICATION_STATUS(
      studyId,
      request.application_id,
    );
    const requestBody = { status: request.status };

    console.log('[API 호출] 신청 상태 변경', {
      url,
      method: 'PATCH',
      requestBody,
      전체요청: {
        studyId,
        applicationId: request.application_id,
        status: request.status,
      },
    });

    const response = await apiClient.patch(url, requestBody, {
      showToast: false,
    });

    console.log('[API 응답] 신청 상태 변경 성공', {
      responseData: response.data,
      status: response.status,
      headers: response.headers,
      전체응답: response,
    });
    return response.data;
  } catch (error) {
    console.error('[API 에러] 신청 상태 변경 실패:', error);
    if (error instanceof AxiosError) {
      console.error('[API 에러 상세]', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        requestData: error.config?.data,
      });
    }
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
    const response = await apiClient.get(API_ENDPOINTS.STUDY_INFO(studyId), {
      showToast: false,
    });
    return response.data;
  } catch (error) {
    console.error('스터디 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 스터디 정보 수정 (API 스펙: PATCH /api/studies/{study_id})
 */
export const updateStudyInfo = async (
  studyId: number,
  request: UpdateStudyInfoRequest,
): Promise<UpdateStudyInfoResponse> => {
  try {
    // 방지 코드 패턴 적용: raw 객체 정의 후 undefined 제거
    // API 스펙에 맞는 필드명과 타입 사용 (스네이크 케이스, 올바른 타입)
    const raw: Record<string, unknown> = {
      title: request.title,
      description: request.description,
      detail_description: request.detail_description,
      interests: Array.isArray(request.interests)
        ? request.interests
        : undefined, // string[] (배열)
      region: request.region, // string (Enum일 수도)
      study_time: request.study_time, // string
      max_members:
        request.max_members !== undefined && request.max_members !== null
          ? Number(request.max_members) // 숫자 타입 명시적 변환
          : undefined,
      conditions: Array.isArray(request.conditions)
        ? request.conditions // string[] (배열)
        : undefined,
      file_key: request.file_key, // string | undefined
    };

    // undefined 제거 (NOT NULL 컬럼에 undefined가 들어가면 500 에러)
    const payload = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== undefined),
    );

    const response = await apiClient.patch(
      API_ENDPOINTS.UPDATE_STUDY_INFO(studyId),
      payload,
      {
        showToast: false,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('[API 에러] 스터디 정보 수정 실패:', error);
    throw error;
  }
};

/**
 * 리더 위임 (API 스펙: PUT /api/studies/{study_id}/leader)
 */
export const delegateLeadership = async (
  studyId: number,
  request: DelegateLeadershipRequest,
): Promise<DelegateLeadershipResponse> => {
  try {
    console.log('[API 호출] 리더 위임', {
      url: API_ENDPOINTS.DELEGATE_LEADERSHIP(studyId),
      method: 'PUT',
      requestBody: { newLeaderMemberId: request.newLeaderMemberId },
    });

    const response = await apiClient.put(
      API_ENDPOINTS.DELEGATE_LEADERSHIP(studyId),
      { newLeaderMemberId: request.newLeaderMemberId },
      { showToast: false },
    );

    console.log('[API 응답] 리더 위임 성공', {
      responseData: response.data,
      status: response.status,
    });

    return response.data;
  } catch (error) {
    console.error('[API 에러] 리더 위임 실패:', error);
    if (error instanceof AxiosError) {
      console.error('[API 에러 상세]', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        requestData: error.config?.data,
      });
    }
    throw error;
  }
};
