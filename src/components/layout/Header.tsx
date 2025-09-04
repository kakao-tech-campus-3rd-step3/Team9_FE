import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '@/components/common';
import { ROUTES } from '@/constants';

/**
 * 헤더 컴포넌트
 * - 로고와 네비게이션 메뉴를 포함
 * - 현재 페이지에 따른 활성 메뉴 하이라이트
 */
const Header: React.FC = () => {
  const location = useLocation();

  // 네비게이션 메뉴 항목
  const navItems = [
    { to: ROUTES.HOME, label: '홈' },
    { to: ROUTES.EXAMPLE, label: '예시' },
  ];

  return (
    <header className='sticky top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border shadow-sm bg-white'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Logo size='lg' className='flex-shrink-0' />

        <nav className='flex items-center space-x-6'>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.to
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
