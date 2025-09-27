/**
 * 관리자 페이지 탭 컴포넌트
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_TABS } from '../constants';

export const AdminTabs: React.FC = () => {
  return (
    <div className='flex space-x-1 mb-6'>
      {ADMIN_TABS.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.id ?? 'members'}
          className={({ isActive }) =>
            `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
};
