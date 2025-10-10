/**
 * 신청자 관리 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { User, Loader2, Check, X } from 'lucide-react';
import { getStudyApplications, changeApplicationStatus } from '../services';
import {
  getMockApplications,
  approveApplication,
  rejectApplication,
  MOCK_STUDY_ID,
  mockStudyInfoResponse,
} from '../mock';
import { useAdminPage } from '../AdminPage';
import type { StudyApplication } from '../types';

export const ApplicantManagement: React.FC = () => {
  const { refreshMembers } = useAdminPage();
  const [applications, setApplications] = useState<StudyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  // 신청자 목록 조회
  const fetchApplications = async () => {
    try {
      setLoading(true);
      // 개발 환경에서는 Mock 데이터 사용
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        setApplications(getMockApplications().applications);
      } else {
        const response = await getStudyApplications(MOCK_STUDY_ID);
        setApplications(response.applications);
      }
    } catch (error) {
      console.error('신청자 목록 조회 실패:', error);
      // 에러 시 Mock 데이터 사용
      setApplications(getMockApplications().applications);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 신청 승인/거절 처리
  const handleStatusChange = async (
    applicationId: number,
    status: 'Approved' | 'Rejected',
  ) => {
    const actionKey = `${status.toLowerCase()}-${applicationId}`;
    const actionText = status === 'Approved' ? '승인' : '거절';

    try {
      setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

      if (import.meta.env.DEV) {
        // Mock 응답 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let success = false;
        if (status === 'Approved') {
          success = approveApplication(applicationId);
          // 스터디원 목록 새로고침
          refreshMembers();
        } else {
          success = rejectApplication(applicationId);
        }

        if (success) {
          // UI에서 해당 신청자 제거
          setApplications((prev) =>
            prev.filter((app) => app.application_id !== applicationId),
          );
          alert(`신청이 ${actionText}되었습니다.`);
        } else {
          alert(`${actionText} 처리에 실패했습니다.`);
        }
      } else {
        const response = await changeApplicationStatus(MOCK_STUDY_ID, {
          application_id: applicationId,
          status: status,
        });

        if (response.success) {
          if (status === 'Approved') {
            setApplications((prev) =>
              prev.filter((app) => app.application_id !== applicationId),
            );
            // 스터디원 목록 새로고침
            refreshMembers();
          } else {
            setApplications((prev) =>
              prev.filter((app) => app.application_id !== applicationId),
            );
          }
          alert(`신청이 ${actionText}되었습니다.`);
        }
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
    // 최대 멤버 수 체크
    const studyInfo = mockStudyInfoResponse.study;
    const currentMembers = studyInfo.current_members;
    const maxMembers = studyInfo.max_members;

    if (currentMembers >= maxMembers) {
      const shouldIncreaseMaxMembers = window.confirm(
        `현재 스터디원이 ${maxMembers}명으로 최대 인원에 도달했습니다.\n\n${applicantName}님을 승인하려면 최대 인원을 늘려야 합니다.\n최대 인원을 ${maxMembers + 1}명으로 늘리고 승인하시겠습니까?`,
      );

      if (shouldIncreaseMaxMembers) {
        // 최대 인원 증가
        studyInfo.max_members = maxMembers + 1;
        await handleStatusChange(applicationId, 'Approved');
      }
      return;
    }

    if (window.confirm(`${applicantName}님의 신청을 승인하시겠습니까?`)) {
      await handleStatusChange(applicationId, 'Approved');
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
                key={application.application_id}
                className='flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border'
              >
                <div className='flex items-center space-x-3'>
                  {application.user_detail.file_key ? (
                    <img
                      src={application.user_detail.file_key}
                      alt={application.user_detail.nickname}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
                      <User className='h-5 w-5 text-muted-foreground' />
                    </div>
                  )}
                  <div>
                    <p className='font-medium text-foreground'>
                      {application.user_detail.nickname}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {application.user_detail.email}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      신청일: {application.application_date}
                    </p>
                    {application.message && (
                      <p className='text-xs text-muted-foreground mt-1 max-w-md'>
                        "{application.message}"
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() =>
                      handleApprove(
                        application.application_id,
                        application.user_detail.nickname,
                      )
                    }
                    disabled={
                      actionLoading[`approved-${application.application_id}`]
                    }
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center space-x-1'
                  >
                    {actionLoading[`approved-${application.application_id}`] ? (
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
                        application.application_id,
                        application.user_detail.nickname,
                      )
                    }
                    disabled={
                      actionLoading[`rejected-${application.application_id}`]
                    }
                    className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center space-x-1'
                  >
                    {actionLoading[`rejected-${application.application_id}`] ? (
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
