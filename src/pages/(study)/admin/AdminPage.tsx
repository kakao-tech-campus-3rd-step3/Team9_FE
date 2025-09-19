/**
 * 스터디 관리자 페이지
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { AdminTabs } from './components/AdminTabs';
import { MemberManagement } from './components/MemberManagement';
import { ApplicantManagement } from './components/ApplicantManagement';
import { StudyInfoManagement } from './components/StudyInfoManagement';
import type { AdminTabType } from './types';

const AdminPage: React.FC = () => {
  const location = useLocation();

  // URL 기반으로 현재 탭 결정
  const getCurrentTab = (): AdminTabType => {
    const path = location.pathname;
    if (path.includes('/admin/applicants')) return 'applicants';
    if (path.includes('/admin/study-info')) return 'study-info';
    return 'members';
  };

  const activeTab = getCurrentTab();

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
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 - 고정 */}
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background flex-shrink-0'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>관리자 기능</h1>
        </div>
      </div>

      {/* 탭 네비게이션 - 고정 */}
      <div className='px-6 pt-6 bg-background flex-shrink-0'>
        <AdminTabs activeTab={activeTab} />
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className='flex-1 px-6 pb-6 overflow-auto'>
        <div className='bg-card rounded-lg border border-border p-6'>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
