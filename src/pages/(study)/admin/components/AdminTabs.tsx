/**
 * 관리자 페이지 탭 컴포넌트
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ADMIN_TABS } from '../constants';

export const AdminTabs: React.FC = () => {
  return (
    <nav className='flex px-4 gap-2 border-b border-border mb-6'>
      {ADMIN_TABS.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.id ?? 'members'}
          className={({ isActive }) =>
            `p-2 ${isActive ? 'border-primary border-b-2' : ''}`
          }
        >
          {({ isActive }) => (
            <div
              className={`px-4 py-2 border rounded-2xl min-w-30 text-center text-sm border-primary transition-colors ${
                isActive
                  ? 'font-bold bg-primary text-white'
                  : 'font-medium text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {tab.label}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
