/**
 * 스터디 관리자 페이지
 */

import React, { useState } from 'react';
import type { AdminTabType } from './types';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('members');

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <div>스터디원 관리 컨텐츠</div>;
      case 'applicants':
        return <div>신청자 관리 컨텐츠</div>;
      case 'study-info':
        return <div>스터디 정보 관리 컨텐츠</div>;
      default:
        return <div>스터디원 관리 컨텐츠</div>;
    }
  };

  return (
    <div className='p-6'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold text-foreground mb-6'>
          관리자 페이지
        </h1>

        {/* 탭 네비게이션 영역 - 나중에 AdminTabs 컴포넌트로 교체 */}
        <div className='flex space-x-1 mb-6'>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'members'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            스터디원 관리
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'applicants'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            신청자 관리
          </button>
          <button
            onClick={() => setActiveTab('study-info')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'study-info'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            스터디 관리
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div className='bg-card rounded-lg border border-border p-6'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
