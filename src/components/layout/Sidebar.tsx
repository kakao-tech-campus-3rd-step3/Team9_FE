import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../common';

/**
 * 사이드바 컴포넌트
 * - 좌측 네비게이션 메뉴
 * - 현재 페이지에 따른 활성 메뉴 스타일링
 */
const Sidebar: React.FC = () => {
  const location = useLocation();

  // 사이드바 네비게이션 메뉴 항목
  const navItems = [
    { to: '/', label: '홈으로' },
    { to: '/example', label: '예시 페이지' },
  ];

  return (
    <aside className='w-64 bg-card border-r border-border shadow-sm'>
      <div className='p-4 border-b border-border'>
        <Logo size='md' />
      </div>

      <nav className='p-4'>
        <ul className='space-y-2'>
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
