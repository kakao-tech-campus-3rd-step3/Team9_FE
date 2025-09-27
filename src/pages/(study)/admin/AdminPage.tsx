/**
 * 스터디 관리자 페이지
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminTabs } from './components/AdminTabs';

const AdminPage: React.FC = () => {
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
        <AdminTabs />
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className='flex-1 px-6 pb-6 overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
