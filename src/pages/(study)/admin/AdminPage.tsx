/**
 * 스터디 관리자 페이지
 */

import React, { createContext, useContext, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminTabs } from './components/AdminTabs';

// 관리자 페이지 컨텍스트 타입
interface AdminPageContextType {
  refreshMembers: () => void;
  setRefreshMembersFn: (fn: () => void) => void;
  refreshStudyInfo: () => void;
  setRefreshStudyInfoFn: (fn: () => void) => void;
}

// 컨텍스트 생성
const AdminPageContext = createContext<AdminPageContextType | null>(null);

// 컨텍스트 훅
export const useAdminPage = () => {
  const context = useContext(AdminPageContext);
  if (!context) {
    throw new Error('useAdminPage must be used within AdminPage');
  }
  return context;
};

const AdminPage: React.FC = () => {
  const refreshMembersRef = useRef<(() => void) | null>(null);
  const refreshStudyInfoRef = useRef<(() => void) | null>(null);

  const refreshMembers = () => {
    if (refreshMembersRef.current) {
      refreshMembersRef.current();
    }
  };

  const setRefreshMembersFn = (fn: () => void) => {
    refreshMembersRef.current = fn;
  };

  const refreshStudyInfo = () => {
    if (refreshStudyInfoRef.current) {
      refreshStudyInfoRef.current();
    }
  };

  const setRefreshStudyInfoFn = (fn: () => void) => {
    refreshStudyInfoRef.current = fn;
  };

  const contextValue: AdminPageContextType = {
    refreshMembers,
    setRefreshMembersFn,
    refreshStudyInfo,
    setRefreshStudyInfoFn,
  };

  return (
    <AdminPageContext.Provider value={contextValue}>
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
    </AdminPageContext.Provider>
  );
};

export default AdminPage;
