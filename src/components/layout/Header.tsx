import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Logo } from '@/components/common';
import { ROUTES } from '@/constants';

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

/**
 * 헤더 컴포넌트
 * - 로고와 네비게이션 메뉴를 포함
 * - 스터디 탐색 페이지에서만 검색창 표시
 * - 현재 페이지에 따른 활성 메뉴 하이라이트
 */
const Header: React.FC<HeaderProps> = ({ searchTerm = '', onSearchChange }) => {
  const location = useLocation();
  // 상수 기반 절대 경로 생성
  const explorePath = `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.EXPLORE}`;
  const dashboardPath = `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.DASHBOARD}`;
  const isStudyExplorePage = location.pathname === explorePath;

  // 네비게이션 메뉴 항목
  const navItems = [
    { to: ROUTES.HOME, label: '홈', type: 'link' as const },
    { to: explorePath, label: '스터디 탐색', type: 'link' as const },
    { to: dashboardPath, label: '스터디 대시보드', type: 'link' as const },
  ];

  return (
    <header className='sticky top-0 left-0 right-0 z-50 h-16 bg-white border-b border-border shadow-sm'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Logo size='lg' className='flex-shrink-0' />

        {/* 검색창 (스터디 탐색 페이지에서만 표시) */}
        {isStudyExplorePage && (
          <div className='flex-1 max-w-md mx-8'>
            <div className='relative'>
              <input
                type='text'
                placeholder='스터디 검색'
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Enter 키를 눌렀을 때 검색 실행
                    console.log('검색 실행:', searchTerm);
                  }
                }}
                className='w-full pl-4 pr-12 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
              />
              <button
                type='button'
                onClick={() => {
                  // 검색 버튼을 클릭했을 때 검색 실행
                  console.log('검색 실행:', searchTerm);
                }}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors'
              >
                <Search className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}

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
