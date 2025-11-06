/**
 * 신청자 관리 컴포넌트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { User, Loader2, Check, X } from 'lucide-react';
import {
  getStudyApplications,
  changeApplicationStatus,
  getStudyInfo,
} from '../services';
import { useAdminPage } from '../AdminPage';
import type { StudyApplication } from '../types';
import { ROUTE_PARAMS } from '@/constants';
import { studyKeys } from '@/constants/queryKeys';
import UserAvatar from '@/components/user/UserAvatar';

export const ApplicantManagement: React.FC = () => {
  const { refreshMembers, refreshStudyInfo } = useAdminPage();
  const queryClient = useQueryClient();
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
      console.log('[신청자 목록 상세]', {
        applicantsCount: response.applicants?.length || 0,
        applicants: response.applicants?.map((app, index) => {
          // 백엔드 원본 응답의 모든 필드 확인
          const rawApp = app as unknown as Record<string, unknown>;
          return {
            index,
            applicationId: app.applicationId,
            nickname: app.nickname,
            appliedAt: app.appliedAt,
            // 상태 정보 확인 (다양한 필드명 시도)
            status:
              rawApp.status ||
              rawApp.applicationStatus ||
              rawApp.state ||
              'N/A',
            // 백엔드 원본 응답의 모든 키 확인
            백엔드원본키: Object.keys(rawApp),
            전체데이터: rawApp,
          };
        }),
        전체응답: response,
        전체응답키: Object.keys(response || {}),
      });
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

  // 신청 승인/거절 처리 (API 스펙: APPROVED, REJECTED)
  const handleStatusChange = async (
    applicationId: number,
    status: 'APPROVED' | 'REJECTED',
  ) => {
    if (!studyId) {
      toast.error('스터디 ID가 없습니다.');
      return;
    }

    // 이미 처리 중인 요청인지 확인
    const actionKey = `${status.toLowerCase()}-${applicationId}`;
    if (actionLoading[actionKey]) {
      console.log('[중복 요청 방지] 이미 처리 중인 요청입니다.');
      return;
    }

    // 신청자가 목록에 있는지 확인
    // 목록에 있다는 것 자체가 "승인 대기 중(Pending)" 상태라는 의미
    const targetApplication = applications.find(
      (app) => app.applicationId === applicationId,
    );

    if (!targetApplication) {
      toast.error('해당 신청자를 찾을 수 없습니다. 목록을 새로고침합니다.');
      fetchApplications();
      return;
    }

    const actionText = status === 'APPROVED' ? '승인' : '거절';

    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      console.log(`[신청 상태 변경 시도]`, {
        studyId,
        applicationId,
        status,
        actionText,
        신청자: targetApplication.nickname,
        참고: '신청자 목록에 있다는 것 자체가 "승인 대기 중" 상태를 의미합니다.',
      });

      const response = await changeApplicationStatus(studyId, {
        application_id: applicationId,
        status: status,
      });

      console.log('[신청 상태 변경 응답]', response);

      // API 호출이 성공적으로 완료되었다면 (예외가 발생하지 않았다면) 성공으로 간주
      // 응답이 없어도 (204 No Content) 성공으로 간주
      // success 필드가 false가 아닌 이상 성공으로 간주
      const isSuccess =
        !response ||
        (typeof response === 'object' &&
        response !== null &&
        'success' in response
          ? (response as { success?: boolean }).success !== false
          : true);

      if (!isSuccess) {
        // 명시적으로 실패인 경우만 처리
        console.error('[신청 상태 변경 실패] 응답 success가 false:', response);
        const errorMessage = (response as { message?: string })?.message || '';
        toast.error(`${actionText} 처리에 실패했습니다. ${errorMessage}`);

        // 실패 시 신청자 목록 새로고침
        setTimeout(() => {
          fetchApplications();
        }, 300);
        return;
      }

      // 성공 처리
      console.log('[신청 상태 변경 성공]', response);

      // 성공 알림 표시
      toast.success(`신청이 ${actionText}되었습니다.`);

      // 성공하면:
      // 1. 신청자 목록에서 제거됨 → 목록 새로고침
      // 2. 승인인 경우: 스터디원 목록에 추가됨 + current_members 증가 → 스터디원 목록 새로고침

      // 신청자 목록 새로고침 (제거된 신청자 반영)
      await fetchApplications();

      // 승인인 경우 스터디원 목록 새로고침 (새 멤버 추가 반영)
      if (status === 'APPROVED') {
        console.log('[승인 완료] 스터디원 목록 및 스터디 정보 새로고침');
        setTimeout(async () => {
          refreshMembers();
          // 스터디 정보도 새로고침하여 current_members 업데이트
          refreshStudyInfo();

          // 탐색 페이지의 스터디 목록 쿼리도 무효화하여 current_members 반영
          await queryClient.invalidateQueries({
            queryKey: studyKeys.all,
            refetchType: 'active',
          });
          await queryClient.invalidateQueries({
            queryKey: ['studies'],
            refetchType: 'active',
          });
        }, 300);
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

        // 409 Conflict 에러 처리
        if (statusCode === 409) {
          // 409 에러는 보통 이미 처리된 신청이거나 인원 초과 등의 이유
          const errorCode = errorData?.code || 'UNKNOWN';
          const errorMessage =
            errorData?.message ||
            errorData?.error ||
            '스터디 인원이 가득 차거나 이미 처리된 신청일 수 있습니다.';

          console.error('[409 에러 상세 분석]', {
            errorCode,
            errorMessage,
            errorData,
            applicationId,
            status,
            studyId,
            요청URL: error.config?.url,
            요청메서드: error.config?.method,
            요청데이터: error.config?.data,
            요청헤더: error.config?.headers,
            응답상태: error.response?.status,
            응답헤더: error.response?.headers,
            전체에러: error,
          });

          // 백엔드 개발자를 위한 상세 로그
          console.error('[백엔드 개발자 확인 필요]', {
            문제: '신청 상태 변경 API가 409 INVALID_STATE_CHANGE를 반환함',
            요청내용: {
              endpoint: `/api/studies/${studyId}/applications/${applicationId}`,
              method: 'PATCH',
              body: { status },
            },
            에러내용: {
              code: errorCode,
              message: errorMessage,
              fullErrorData: errorData,
            },
            현재상황: {
              스터디인원: '콘솔에서 스터디 정보 확인 필요',
              신청자목록에존재: applications.some(
                (app) => app.applicationId === applicationId,
              ),
            },
            확인필요사항: [
              '1. 데이터베이스에서 해당 신청(application_id: ' +
                applicationId +
                ')의 현재 상태 확인',
              '2. 스터디 인원이 실제로 가득 찼는지 확인',
              '3. 백엔드 검증 로직 확인',
              '4. 동시성 문제인지 확인',
            ],
          });

          // INVALID_STATE_CHANGE인 경우 이미 처리된 신청일 가능성이 높음
          const isInvalidStateChange =
            errorCode === 'INVALID_STATE_CHANGE' ||
            errorMessage.includes('상태 변경이 유효하지 않습니다');

          // 신청자 목록에서 즉시 제거 (UI 업데이트)
          setApplications((prev) =>
            prev.filter((app) => app.applicationId !== applicationId),
          );

          // 신청자 목록 새로고침으로 실제 상태 확인
          // 또한 승인 시도였다면 스터디원 목록도 확인하여 실제로 승인되었는지 검증
          setTimeout(async () => {
            // 먼저 신청자 목록 새로고침
            await fetchApplications();

            // 승인 시도였다면 스터디원 목록도 확인
            if (status === 'APPROVED') {
              console.log(
                '[409 에러] 승인 시도였으므로 스터디원 목록 확인 중...',
              );
              setTimeout(async () => {
                await refreshMembers();

                // 스터디원 목록을 확인하여 실제로 승인되었는지 검증
                // (이건 MemberManagement 컴포넌트에서 처리해야 하지만,
                // 여기서는 사용자에게 안내만 제공)
              }, 500);
            }

            // 새로고침 후 신청자가 여전히 목록에 있는지 확인
            setTimeout(() => {
              setApplications((currentApplications) => {
                const stillExists = currentApplications.some(
                  (app) => app.applicationId === applicationId,
                );

                if (!stillExists) {
                  // 목록에서 사라졌다면 실제로 처리된 것
                  console.log(
                    `[409 에러 해결] 신청자 ${applicationId}가 목록에서 제거되었습니다. (실제로 처리된 것으로 확인)`,
                  );

                  // 승인 시도였다면 성공 메시지로 변경
                  if (status === 'APPROVED') {
                    console.log(
                      '[409 에러 해결] 실제로 승인되었을 가능성이 높습니다.',
                    );
                  }
                } else {
                  console.warn(
                    `[409 에러] 신청자 ${applicationId}가 여전히 목록에 있습니다.`,
                  );
                }

                return currentApplications;
              });
            }, 100);
          }, 500);

          // 사용자에게 명확한 안내
          if (isInvalidStateChange) {
            toast.error(`${actionText} 요청이 거부되었습니다. ${errorMessage}`);
          } else {
            toast.error(`${actionText} 처리 중 문제가 발생했습니다.`);
          }
        } else {
          const errorMessage =
            errorData?.message ||
            errorData?.error ||
            `알 수 없는 오류가 발생했습니다. (${statusCode})`;

          // 에러 발생 시에도 목록 새로고침 (백엔드 상태 확인)
          setTimeout(() => {
            fetchApplications();
            if (status === 'APPROVED') {
              refreshMembers();
            }
          }, 500);

          toast.error(`${actionText} 처리에 실패했습니다. ${errorMessage}`);
        }
      } else {
        // 알 수 없는 에러도 목록 새로고침
        setTimeout(() => {
          fetchApplications();
          if (status === 'APPROVED') {
            refreshMembers();
          }
        }, 500);
        toast.error(`${actionText} 처리에 실패했습니다.`);
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
      toast.error('스터디 ID가 없습니다.');
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
          await handleStatusChange(applicationId, 'APPROVED');
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
        toast.error(
          `최대 인원이 ${maxMembers}명입니다. 스터디 정보 관리에서 최대 인원을 늘려주세요.`,
        );
        return;
      }

      if (currentMembers >= maxMembers) {
        const shouldIncreaseMaxMembers = window.confirm(
          `현재 스터디원이 ${maxMembers}명으로 최대 인원에 도달했습니다.\n\n${applicantName}님을 승인하려면 최대 인원을 늘려야 합니다.\n최대 인원을 ${maxMembers + 1}명으로 늘리고 승인하시겠습니까?`,
        );

        if (shouldIncreaseMaxMembers) {
          // 최대 인원 증가는 스터디 정보 관리 페이지에서 해야 하므로 안내
          toast.error(
            '스터디 정보 관리 페이지에서 최대 인원을 먼저 늘려주세요.',
          );
          return;
        }
        return;
      }

      if (window.confirm(`${applicantName}님의 신청을 승인하시겠습니까?`)) {
        await handleStatusChange(applicationId, 'APPROVED');
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
        await handleStatusChange(applicationId, 'APPROVED');
      }
    }
  };

  // 신청 거절
  const handleReject = async (applicationId: number, applicantName: string) => {
    if (window.confirm(`${applicantName}님의 신청을 거절하시겠습니까?`)) {
      await handleStatusChange(applicationId, 'REJECTED');
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
