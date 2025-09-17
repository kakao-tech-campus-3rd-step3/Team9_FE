/**
 * 스터디 관리자 페이지
 */

import React, { useState } from 'react';
import { AdminTabs } from './components/AdminTabs';
import { MemberManagement } from './components/MemberManagement';
import { ApplicantManagement } from './components/ApplicantManagement';
import { StudyInfoManagement } from './components/StudyInfoManagement';
import type { AdminTabType } from './types';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('members');

  const renderContent = () => {
    switch (activeTab) {
      case 'members':
        return <MemberManagement />;
      case 'applicants':
        return <ApplicantManagement />;
      case 'study-info':
        return <StudyInfoManagement />;
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
