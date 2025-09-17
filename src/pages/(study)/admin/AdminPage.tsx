/**
 * 스터디 관리자 페이지
 */

import React, { useState } from 'react';
import { AdminTabs } from './components/AdminTabs';
import { MemberManagement } from './components/MemberManagement';
import type { AdminTabType } from './types';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('members');

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <MemberManagement />;
      case 'applicants':
        return <div>신청자 관리 컨텐츠</div>;
      case 'study-info':
        return <div>스터디 정보 관리 컨텐츠</div>;
      default:
        return <MemberManagement />;
    }
  };

  return (
    <div className='p-6'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold text-foreground mb-6'>
          관리자 페이지
        </h1>

        {/* 탭 네비게이션 */}
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 컨텐츠 영역 */}
        <div className='bg-card rounded-lg border border-border p-6'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
