/**
 * 신청자 관리 컴포넌트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { User, Loader2, Check, X } from 'lucide-react';
import {
  getStudyApplications,
  changeApplicationStatus,
  getStudyInfo,
} from '../services';
import { useAdminPage } from '../AdminPage';
import type { StudyApplication } from '../types';
import { ROUTE_PARAMS } from '@/constants';

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
      const response = await getStudyApplications(studyId);
      setApplications(response.applicants);
    } catch (error) {
      console.error('신청자 목록 조회 실패:', error);
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

      const response = await changeApplicationStatus(studyId, {
        application_id: applicationId,
        status: status,
      });

      if (response.success) {
        // UI에서 해당 신청자 제거
        setApplications((prev) =>
          prev.filter((app) => app.applicationId !== applicationId),
        );

        if (status === 'Accepted') {
          // 스터디원 목록 새로고침
          refreshMembers();
        }

        alert(`신청이 ${actionText}되었습니다.`);
      }
    } catch (error) {
      console.error('신청 상태 변경 실패:', error);
      alert(`${actionText} 처리에 실패했습니다.`);
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
      const studyInfo = studyInfoResponse.study;
      const currentMembers = studyInfo.current_members;
      const maxMembers = studyInfo.max_members;

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
      console.error('스터디 정보 조회 실패:', error);
      // 스터디 정보 조회 실패 시에도 승인 진행
      if (window.confirm(`${applicantName}님의 신청을 승인하시겠습니까?`)) {
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
                  {application.userDetail.file_key ? (
                    <img
                      src={application.userDetail.file_key}
                      alt={application.nickname}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
                      <User className='h-5 w-5 text-muted-foreground' />
                    </div>
                  )}
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
