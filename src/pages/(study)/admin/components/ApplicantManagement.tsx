/**
 * 신청자 관리 컴포넌트
 */

import React from 'react';
import { User } from 'lucide-react';
import { MOCK_APPLICANTS } from '../constants';

export const ApplicantManagement: React.FC = () => {
  const handleApprove = (applicantId: string) => {
    console.log('신청 승인:', applicantId);
    // TODO: 실제 승인 로직 구현
  };

  const handleReject = (applicantId: string) => {
    console.log('신청 거절:', applicantId);
    // TODO: 실제 거절 로직 구현
  };

  return (
    <div className='bg-card rounded-lg border border-border p-6'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>신청자 관리</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            스터디 신청자를 관리할 수 있습니다.
          </p>
        </div>

        {MOCK_APPLICANTS.length === 0 ? (
          <div className='text-center py-12'>
            <User className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>신청자가 없습니다.</p>
          </div>
        ) : (
          <div className='grid gap-4'>
            {MOCK_APPLICANTS.map((applicant) => (
              <div
                key={applicant.id}
                className='flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border'
              >
                <div className='flex items-center space-x-3'>
                  <User className='h-6 w-6 text-muted-foreground' />
                  <div>
                    <p className='font-medium text-foreground'>
                      {applicant.name}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {applicant.email}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      신청일: {applicant.applyDate}
                    </p>
                    {applicant.message && (
                      <p className='text-xs text-muted-foreground mt-1 max-w-md'>
                        메시지: "{applicant.message}"
                      </p>
                    )}
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => handleApprove(applicant.id)}
                    className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium'
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleReject(applicant.id)}
                    className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium'
                  >
                    거절
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
