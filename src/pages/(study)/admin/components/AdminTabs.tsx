/**
 * 관리자 페이지 탭 컴포넌트
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_TABS } from '../constants';
import type { AdminTabType } from '../types';

interface AdminTabsProps {
  activeTab: AdminTabType;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab }) => {
  return (
    <div className='flex space-x-1 mb-6'>
      {ADMIN_TABS.map((tab) => (
        <Link
          key={tab.id}
          to={tab.id ?? 'members'}
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
