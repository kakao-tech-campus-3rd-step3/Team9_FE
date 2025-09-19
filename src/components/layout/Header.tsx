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
  // 상수 기반 절대 경로 생성
  const explorePath = `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.EXPLORE}`;
  const dashboardPath = `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.DASHBOARD}`;

  // 네비게이션 메뉴 항목
  const navItems = [
    { to: ROUTES.HOME, label: '홈', type: 'link' as const },
    { to: explorePath, label: '스터디 탐색', type: 'link' as const },
    { to: dashboardPath, label: '스터디 대시보드', type: 'link' as const },
    { to: ROUTES.LOGIN, label: '로그인', type: 'link' as const },
  ];

  return (
    <header className='sticky top-0 left-0 right-0 z-50 h-16 bg-white border-b border-border shadow-sm'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Logo size='lg' className='flex-shrink-0' />

        <nav className='flex items-center space-x-6'>
          {navItems.map((item) => (
            <Link
              key={item.label}
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
