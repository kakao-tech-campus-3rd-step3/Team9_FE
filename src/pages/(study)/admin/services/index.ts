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
  // 에러 핸들링을 위해 try 블록 밖에서 선언
  let requestTimestamp: string | undefined;
  let payload: Record<string, unknown> | undefined;

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
    payload = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== undefined),
    );

    // 타입 검증 로그
    console.log('[API 호출] 스터디 정보 수정', {
      url: API_ENDPOINTS.UPDATE_STUDY_INFO(studyId),
      method: 'PATCH',
      원본request: request,
      raw객체: raw,
      payload: payload,
      payload타입검증: {
        title: typeof payload.title === 'string',
        description: typeof payload.description === 'string',
        detail_description: typeof payload.detail_description === 'string',
        interests: Array.isArray(payload.interests),
        region: typeof payload.region === 'string',
        study_time: typeof payload.study_time === 'string',
        max_members: typeof payload.max_members === 'number',
        conditions: Array.isArray(payload.conditions),
        file_key:
          payload.file_key === undefined ||
          typeof payload.file_key === 'string',
      },
      studyId,
    });

    // 최종 payload 검증 (백엔드 검증 통과 가능성 확인)
    const payloadValidation = {
      모든필드존재: Object.keys(payload || {}).length === 9,
      필드명일치: [
        'title',
        'description',
        'detail_description',
        'interests',
        'region',
        'study_time',
        'max_members',
        'conditions',
        'file_key',
      ].every((field) => field in (payload || {})),
      타입검증: {
        title: typeof payload?.title === 'string' && payload.title.length > 0,
        description: typeof payload?.description === 'string',
        detail_description: typeof payload?.detail_description === 'string',
        interests:
          Array.isArray(payload?.interests) && payload.interests.length > 0,
        region:
          typeof payload?.region === 'string' && payload.region.length > 0,
        study_time: typeof payload?.study_time === 'string',
        max_members:
          typeof payload?.max_members === 'number' && payload.max_members > 0,
        conditions: Array.isArray(payload?.conditions),
        file_key:
          payload?.file_key === undefined ||
          (typeof payload.file_key === 'string' && payload.file_key.length > 0),
      },
      값검증: {
        title_길이:
          typeof payload?.title === 'string' ? payload.title.length : 0,
        description_길이:
          typeof payload?.description === 'string'
            ? payload.description.length
            : 0,
        detail_description_길이:
          typeof payload?.detail_description === 'string'
            ? payload.detail_description.length
            : 0,
        interests_개수: Array.isArray(payload?.interests)
          ? payload.interests.length
          : 0,
        conditions_개수: Array.isArray(payload?.conditions)
          ? payload.conditions.length
          : 0,
        max_members_값: payload?.max_members,
      },
    };

    console.log('[최종 payload 검증]', {
      payload: payload,
      payload필드: Object.keys(payload || {}),
      JSON문자열: JSON.stringify(payload || {}),
      검증결과: payloadValidation,
      Swagger예시와비교: {
        필드수일치: Object.keys(payload || {}).length === 9,
        타입모두올바름: Object.values(payloadValidation.타입검증).every(
          (v) => v === true,
        ),
      },
    });

    // 백엔드 서버 재시작 확인을 위한 타임스탬프 추가
    requestTimestamp = new Date().toISOString();
    const fullRequestUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${API_ENDPOINTS.UPDATE_STUDY_INFO(studyId)}`;

    console.log('[요청 타임스탬프 및 상세 정보]', {
      requestTimestamp,
      현재시간: new Date().toLocaleString('ko-KR'),
      서버URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
      전체요청URL: fullRequestUrl,
      studyId,
      payload필드수: Object.keys(payload || {}).length,
      payload필드목록: Object.keys(payload || {}),
      참고: '이 정보를 백엔드 팀에게 공유하여 문제를 진단할 수 있습니다.',
    });

    const response = await apiClient.patch(
      API_ENDPOINTS.UPDATE_STUDY_INFO(studyId),
      payload, // undefined가 제거된 최종 payload
      {
        showToast: false,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('[API 응답] 스터디 정보 수정 성공', {
      responseData: response.data,
      status: response.status,
    });

    return response.data;
  } catch (error) {
    console.error('[API 에러] 스터디 정보 수정 실패:', error);
    if (error instanceof AxiosError) {
      console.error('[API 에러 상세]', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
        requestData타입: typeof error.config?.data,
        requestData문자열:
          typeof error.config?.data === 'string'
            ? error.config.data
            : JSON.stringify(error.config?.data || {}),
        requestHeaders: error.config?.headers,
      });

      // 백엔드 에러 응답 상세 분석 (변경 사항 확인)
      if (error.response?.data) {
        const errorResponse = error.response.data;

        // 백엔드 팀에게 전달할 수 있는 상세 정보
        // payload가 없으면 error.config?.data에서 재구성 시도
        const actualPayload =
          payload ||
          (error.config?.data && typeof error.config.data === 'object'
            ? error.config.data
            : {});
        const backendDebugInfo = {
          요청정보: {
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            studyId: studyId,
            요청타임스탬프: requestTimestamp || new Date().toISOString(),
            전체요청URL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${error.config?.url}`,
          },
          요청데이터: {
            payload필드수: Object.keys(actualPayload).length,
            payload필드목록: Object.keys(actualPayload),
            payload상세: actualPayload,
          },
          에러응답: {
            status: error.response.status,
            statusText: error.response.statusText,
            code: errorResponse?.code,
            message: errorResponse?.message,
            errors: errorResponse?.errors,
            timestamp: errorResponse?.timestamp,
            path: errorResponse?.path,
          },
        };

        console.error('[백엔드 에러 응답 분석]', {
          전체응답데이터: errorResponse,
          응답키목록: Object.keys(errorResponse || {}),
          에러코드: errorResponse?.code,
          에러메시지: errorResponse?.message,
          에러상세: errorResponse?.errors,
          timestamp: errorResponse?.timestamp,
          path: errorResponse?.path,
          이전과비교: {
            이전에러코드: 'INTERNAL_ERROR',
            현재에러코드: errorResponse?.code,
            에러코드변경: errorResponse?.code !== 'INTERNAL_ERROR',
            이전에러메시지: '일시적인 오류가 발생했습니다.',
            현재에러메시지: errorResponse?.message,
            에러메시지변경:
              errorResponse?.message !== '일시적인 오류가 발생했습니다.',
            이전errors배열: '비어있음',
            현재errors배열: Array.isArray(errorResponse?.errors)
              ? errorResponse.errors.length > 0
                ? errorResponse.errors
                : '비어있음'
              : '없음',
            errors배열변경:
              Array.isArray(errorResponse?.errors) &&
              errorResponse.errors.length > 0,
          },
        });

        // 백엔드 팀에게 전달할 수 있는 상세 디버그 정보
        console.error('🔍 [백엔드 팀에게 전달할 디버그 정보]', {
          중요: '이 정보를 백엔드 팀에게 공유해주세요.',
          요청정보: backendDebugInfo.요청정보,
          요청데이터: backendDebugInfo.요청데이터,
          에러응답: backendDebugInfo.에러응답,
          확인요청사항: [
            '1. 백엔드 서버 로그에서 이 요청이 실제로 처리되었는지 확인',
            '2. 백엔드 로그에 구체적인 에러 메시지가 있는지 확인',
            `3. 요청 데이터(payload)가 백엔드에 정상적으로 도달했는지 확인`,
            '4. 데이터베이스 쿼리나 비즈니스 로직에서 에러가 발생했는지 확인',
            '5. 배포된 환경이 프론트엔드가 요청하는 서버와 일치하는지 확인',
          ],
        });

        // 실제 전송된 요청 데이터 상세 출력 (JSON 문자열로)
        console.error('📤 [실제 전송된 요청 데이터 상세]', {
          전체요청URL: backendDebugInfo.요청정보.전체요청URL,
          요청타임스탬프: backendDebugInfo.요청정보.요청타임스탬프,
          요청메서드: backendDebugInfo.요청정보.method,
          studyId: backendDebugInfo.요청정보.studyId,
          payloadJSON문자열: JSON.stringify(
            backendDebugInfo.요청데이터.payload상세,
            null,
            2,
          ),
          payload필드목록: backendDebugInfo.요청데이터.payload필드목록,
          payload필드수: backendDebugInfo.요청데이터.payload필드수,
          interests포함여부: Array.isArray(
            backendDebugInfo.요청데이터.payload상세?.interests,
          ),
          interests값: backendDebugInfo.요청데이터.payload상세?.interests,
          interests길이: Array.isArray(
            backendDebugInfo.요청데이터.payload상세?.interests,
          )
            ? backendDebugInfo.요청데이터.payload상세.interests.length
            : 0,
          백엔드수정사항확인: {
            CollectionMerge방식적용:
              '백엔드에서 interests와 conditions를 Collection Merge 방식으로 처리하도록 수정됨',
            interests필수:
              'API 명세서: interests는 필수 필드이며 최소 1개 이상',
            현재전송값: backendDebugInfo.요청데이터.payload상세?.interests,
            문제가능성:
              Array.isArray(
                backendDebugInfo.요청데이터.payload상세?.interests,
              ) &&
              backendDebugInfo.요청데이터.payload상세.interests.length === 0
                ? 'interests가 빈 배열로 전송됨 (최소 1개 이상 필요)'
                : 'interests가 포함되지 않음',
          },
        });
      }
    }
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
