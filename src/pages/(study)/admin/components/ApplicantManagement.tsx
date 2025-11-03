/**
 * 신청자 관리 컴포넌트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { User, Loader2, Check, X } from 'lucide-react';
import {
  getStudyApplications,
  changeApplicationStatus,
  getStudyInfo,
} from '../services';
import { useAdminPage } from '../AdminPage';
import type { StudyApplication } from '../types';
import { ROUTE_PARAMS } from '@/constants';
import UserAvatar from '@/components/user/UserAvatar';

export const ApplicantManagement: React.FC = () => {
  const { refreshMembers } = useAdminPage();
  const params = useParams<{ [ROUTE_PARAMS.studyId]: string }>();
  const studyId = params[ROUTE_PARAMS.studyId]
    ? Number(params[ROUTE_PARAMS.studyId])
    : null;

  const [applications, setApplications] = useState<StudyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  // 신청자 목록 조회
  const fetchApplications = useCallback(async () => {
    if (!studyId) {
      console.error('스터디 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[신청자 목록 조회] studyId:', studyId);
      const response = await getStudyApplications(studyId);
      console.log('[신청자 목록 조회 성공]', response);
      setApplications(response.applicants || []);
    } catch (error) {
      console.error('[신청자 목록 조회 실패]', error);
      if (error instanceof AxiosError) {
        console.error('응답 상태:', error.response?.status);
        console.error('응답 데이터:', error.response?.data);
      }
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [studyId]);

  useEffect(() => {
    if (studyId) {
      fetchApplications();
    }
  }, [studyId, fetchApplications]);

  // 신청 승인/거절 처리
  const handleStatusChange = async (
    applicationId: number,
    status: 'Accepted' | 'Rejected',
  ) => {
    if (!studyId) {
      alert('스터디 ID가 없습니다.');
      return;
    }

    const actionKey = `${status.toLowerCase()}-${applicationId}`;
    const actionText = status === 'Accepted' ? '승인' : '거절';

    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      console.log(`[신청 상태 변경 시도]`, {
        studyId,
        applicationId,
        status,
        actionText,
      });

      const response = await changeApplicationStatus(studyId, {
        application_id: applicationId,
        status: status,
      });

      console.log('[신청 상태 변경 응답]', response);
      console.log('[신청 상태 변경 응답 구조]', {
        hasSuccess: 'success' in response,
        responseKeys: Object.keys(response || {}),
        responseType: typeof response,
      });

      // 응답 처리 (success 필드가 있으면 확인, 없으면 성공으로 간주)
      if (response && 'success' in response && response.success === false) {
        console.error('[신청 상태 변경 실패] 응답 success가 false:', response);
        alert(`${actionText} 처리에 실패했습니다. ${response.message || ''}`);
        // 실패 시 신청자 목록 새로고침 (상태가 변경되었을 수 있음)
        fetchApplications();
      } else {
        // success가 true이거나 없는 경우 성공으로 간주
        console.log('[신청 상태 변경 성공]', response);
        setApplications((prev) =>
          prev.filter((app) => app.applicationId !== applicationId),
        );

        if (status === 'Accepted') {
          refreshMembers();
        }

        alert(`신청이 ${actionText}되었습니다.`);
      }
    } catch (error) {
      console.error('[신청 상태 변경 에러]', error);

      // 에러 상세 정보 출력
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
      }
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const errorData = error.response?.data as
          | {
              message?: string;
              error?: string;
              code?: string;
              details?: string;
            }
          | undefined;

        console.error('응답 상태:', statusCode);
        console.error('응답 데이터:', errorData);
        console.error('요청 URL:', error.config?.url);
        console.error('요청 데이터:', error.config?.data);

        // 409 Conflict 에러 처리 (인원 초과 등)
        if (statusCode === 409) {
          // 백엔드 응답의 모든 에러 정보 수집
          const errorMessage =
            errorData?.message ||
            errorData?.error ||
            errorData?.details ||
            '스터디 인원이 가득 차거나 다른 이유로 승인할 수 없습니다.';

          const errorCode = errorData?.code || 'UNKNOWN';

          // 더 상세한 에러 정보 제공
          const detailMessage = errorData?.details
            ? `\n\n상세 정보: ${errorData.details}`
            : '';

          // 에러 코드별 안내 메시지
          let solutionMessage = '';
          if (
            errorCode === 'INVALID_STATE_CHANGE' ||
            errorMessage.includes('상태 변경')
          ) {
            solutionMessage =
              '💡 이 에러는 다음과 같은 이유로 발생할 수 있습니다:\n- 이미 처리된 신청일 수 있습니다.\n- 신청 상태가 변경될 수 없는 상태일 수 있습니다.\n- 다른 관리자가 이미 처리했을 수 있습니다.\n\n콘솔의 [API 에러 상세] 로그를 확인해주세요.';
          } else {
            solutionMessage =
              '💡 해결 방법:\n- 스터디 정보 관리에서 최대 인원을 늘려주세요.\n- 현재 스터디원 수를 확인해주세요.\n- 신청자 목록을 새로고침해보세요.';
          }

          console.error('[409 에러 상세 분석]', {
            errorCode,
            errorMessage,
            fullErrorData: errorData,
            requestUrl: error.config?.url,
            requestData: error.config?.data,
          });

          // 409 에러 발생 시 신청자 목록 새로고침 (상태가 변경되었을 수 있음)
          fetchApplications();

          alert(
            `⚠️ ${actionText} 처리에 실패했습니다.\n\n에러: ${errorMessage}\n에러 코드: ${errorCode}${detailMessage}\n\n${solutionMessage}\n\n(에러 코드: 409 Conflict)\n\n💡 신청자 목록이 자동으로 새로고침되었습니다.`,
          );
        } else {
          const errorMessage =
            errorData?.message ||
            errorData?.error ||
            `알 수 없는 오류가 발생했습니다. (${statusCode})`;

          alert(`${actionText} 처리에 실패했습니다.\n\n${errorMessage}`);
        }
      } else {
        alert(`${actionText} 처리에 실패했습니다.`);
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  // 신청 승인
  const handleApprove = async (
    applicationId: number,
    applicantName: string,
  ) => {
    if (!studyId) {
      alert('스터디 ID가 없습니다.');
      return;
    }

    try {
      // 최대 멤버 수 체크
      const studyInfoResponse = await getStudyInfo(studyId);
      console.log('[스터디 정보 조회 응답 (승인 전)]', studyInfoResponse);
      console.log('[스터디 정보 조회 응답 구조]', {
        hasStudy: studyInfoResponse ? 'study' in studyInfoResponse : false,
        responseKeys: studyInfoResponse ? Object.keys(studyInfoResponse) : [],
        responseType: typeof studyInfoResponse,
      });

      // 응답 구조가 다를 수 있으므로 유연하게 처리
      let rawStudyInfo: unknown = null;

      if (studyInfoResponse && studyInfoResponse.study) {
        // { study: {...} } 형태
        rawStudyInfo = studyInfoResponse.study;
      } else if (studyInfoResponse && typeof studyInfoResponse === 'object') {
        // 직접 study 객체인 경우 또는 다른 구조
        rawStudyInfo = studyInfoResponse;
      }

      if (!rawStudyInfo) {
        console.warn(
          '[승인 처리] 스터디 정보를 가져올 수 없습니다. 최대 인원 체크를 건너뜁니다.',
          { response: studyInfoResponse },
        );
        // 스터디 정보가 없어도 승인 시도 (백엔드에서 검증)
        if (window.confirm(`${applicantName}님의 신청을 승인하시겠습니까?`)) {
          await handleStatusChange(applicationId, 'Accepted');
        }
        return;
      }

      // 필드 매핑 (백엔드 응답이 다를 수 있음)
      const rawData = rawStudyInfo as Record<string, unknown>;
      const studyInfo = {
        current_members: (typeof rawData?.current_members === 'number'
          ? rawData.current_members
          : typeof rawData?.currentMembers === 'number'
            ? rawData.currentMembers
            : 0) as number,
        max_members: (typeof rawData?.max_members === 'number'
          ? rawData.max_members
          : typeof rawData?.maxMembers === 'number'
            ? rawData.maxMembers
            : 0) as number,
      };

      const currentMembers = studyInfo.current_members;
      const maxMembers = studyInfo.max_members;

      console.log('[스터디 인원 정보]', {
        currentMembers,
        maxMembers,
        rawStudyInfo,
        mappedStudyInfo: studyInfo,
      });

      // 최대 인원이 1명이거나 현재 인원이 이미 최대 인원에 도달한 경우
      if (maxMembers <= 1) {
        alert(
          `현재 최대 인원이 ${maxMembers}명으로 설정되어 있습니다.\n\n${applicantName}님을 승인하려면 스터디 정보 관리 페이지에서 최대 인원을 ${maxMembers + 1}명 이상으로 늘려주세요.`,
        );
        return;
      }

      if (currentMembers >= maxMembers) {
        const shouldIncreaseMaxMembers = window.confirm(
          `현재 스터디원이 ${maxMembers}명으로 최대 인원에 도달했습니다.\n\n${applicantName}님을 승인하려면 최대 인원을 늘려야 합니다.\n최대 인원을 ${maxMembers + 1}명으로 늘리고 승인하시겠습니까?`,
        );

        if (shouldIncreaseMaxMembers) {
          // 최대 인원 증가는 스터디 정보 관리 페이지에서 해야 하므로 안내
          alert('스터디 정보 관리 페이지에서 최대 인원을 먼저 늘려주세요.');
          return;
        }
        return;
      }

      if (window.confirm(`${applicantName}님의 신청을 승인하시겠습니까?`)) {
        await handleStatusChange(applicationId, 'Accepted');
      }
    } catch (error) {
      console.error('[승인 처리] 스터디 정보 조회 실패:', error);
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
      }
      if (error instanceof AxiosError) {
        console.error('응답 상태:', error.response?.status);
        console.error('응답 데이터:', error.response?.data);
      }

      // 스터디 정보 조회 실패해도 승인 시도 (백엔드에서 검증)
      console.warn(
        '[승인 처리] 스터디 정보 조회 실패로 인해 최대 인원 체크를 건너뜁니다. 백엔드에서 검증합니다.',
      );
      if (
        window.confirm(
          `${applicantName}님의 신청을 승인하시겠습니까?\n\n(스터디 정보를 불러오지 못해 인원 체크를 건너뜁니다. 백엔드에서 검증됩니다.)`,
        )
      ) {
        await handleStatusChange(applicationId, 'Accepted');
      }
    }
  };

  // 신청 거절
  const handleReject = async (applicationId: number, applicantName: string) => {
    if (window.confirm(`${applicantName}님의 신청을 거절하시겠습니까?`)) {
      await handleStatusChange(applicationId, 'Rejected');
    }
  };

  if (loading) {
    return (
      <div className='bg-card rounded-lg border border-border p-6'>
        <div className='flex justify-center items-center h-32'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      </div>
    );
  }

  return (
    <div className='bg-card rounded-lg border border-border p-6'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>신청자 관리</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            스터디 신청자를 관리할 수 있습니다.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className='text-center py-12'>
            <User className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>신청자가 없습니다.</p>
          </div>
        ) : (
          <div className='grid gap-4'>
            {applications.map((application) => (
              <div
                key={application.applicationId}
                className='flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border'
              >
                <div className='flex items-center space-x-3'>
                  <UserAvatar
                    imageKey={application.userDetail.file_key}
                    name={application.nickname}
                    className='h-10 w-10'
                  />
                  <div>
                    <p className='font-medium text-foreground'>
                      {application.nickname}
                    </p>
                    {application.userDetail.email && (
                      <p className='text-sm text-muted-foreground'>
                        {application.userDetail.email}
                      </p>
                    )}
                    <p className='text-xs text-muted-foreground'>
                      신청일:{' '}
                      {new Date(application.appliedAt).toLocaleDateString(
                        'ko-KR',
                      )}
                    </p>
                    {application.applicationMessage && (
                      <p className='text-xs text-muted-foreground mt-1 max-w-md'>
                        "{application.applicationMessage}"
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() =>
                      handleApprove(
                        application.applicationId,
                        application.nickname,
                      )
                    }
                    disabled={
                      actionLoading[`accepted-${application.applicationId}`]
                    }
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center space-x-1'
                  >
                    {actionLoading[`accepted-${application.applicationId}`] ? (
                      <Loader2 className='h-3 w-3 animate-spin' />
                    ) : (
                      <>
                        <Check className='h-3 w-3' />
                        <span>수락</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleReject(
                        application.applicationId,
                        application.nickname,
                      )
                    }
                    disabled={
                      actionLoading[`rejected-${application.applicationId}`]
                    }
                    className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center space-x-1'
                  >
                    {actionLoading[`rejected-${application.applicationId}`] ? (
                      <Loader2 className='h-3 w-3 animate-spin' />
                    ) : (
                      <>
                        <X className='h-3 w-3' />
                        <span>거절</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
