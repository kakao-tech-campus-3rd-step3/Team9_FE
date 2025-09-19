/**
 * 관리자 페이지 탭 컴포넌트
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_TABS } from '../constants';
import { ROUTES } from '@/constants';
import type { AdminTabType } from '../types';

interface AdminTabsProps {
  activeTab: AdminTabType;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab }) => {
  // 탭 ID를 URL로 매핑
  const getTabUrl = (tabId: string) => {
    const baseUrl = `/${ROUTES.STUDY.ROOT}`;
    switch (tabId) {
      case 'members':
        return `${baseUrl}/${ROUTES.STUDY.ADMIN.MEMBERS}`;
      case 'applicants':
        return `${baseUrl}/${ROUTES.STUDY.ADMIN.APPLICANTS}`;
      case 'study-info':
        return `${baseUrl}/${ROUTES.STUDY.ADMIN.STUDY_INFO}`;
      default:
        return `${baseUrl}/${ROUTES.STUDY.ADMIN.MEMBERS}`;
    }
  };

  return (
    <div className='flex space-x-1 mb-6'>
      {ADMIN_TABS.map((tab) => (
        <Link
          key={tab.id}
          to={getTabUrl(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};
