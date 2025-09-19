/**
 * 스터디원 관리 컴포넌트
 */

import React from 'react';
import { User } from 'lucide-react';
import { MOCK_STUDY_MEMBERS } from '../constants';

export const MemberManagement: React.FC = () => {
  const handleRemoveMember = (memberId: string) => {
    console.log('스터디원 제거:', memberId);
    // TODO: 실제 제거 로직 구현
  };

  return (
    <div className='bg-card rounded-lg border border-border p-6'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>
            스터디원 관리
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            현재 스터디원을 관리할 수 있습니다.
          </p>
        </div>

        <div className='grid gap-4'>
          {MOCK_STUDY_MEMBERS.map((member) => (
            <div
              key={member.id}
              className='flex items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border'
            >
              <div className='flex items-center space-x-3'>
                <User className='h-6 w-6 text-muted-foreground' />
                <div>
                  <p className='font-medium text-foreground'>{member.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {member.email}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    가입일: {member.joinDate}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    member.role === 'leader'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {member.role === 'leader' ? '리더' : '멤버'}
                </span>
                {member.role !== 'leader' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className='px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors'
                  >
                    탈퇴
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
