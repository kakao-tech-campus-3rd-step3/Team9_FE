import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Logo } from '@/components/common';
import { ROUTES } from '@/constants';

interface HeaderProps {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
  searchPlaceholder?: string;
}

/**
 * 헤더 컴포넌트
 * - 로고와 네비게이션 메뉴를 포함
 * - 통일된 검색창 제공
 * - 현재 페이지에 따른 활성 메뉴 하이라이트
 */
const Header: React.FC<HeaderProps> = ({
  searchTerm = '',
  onSearchChange,
  onSearch,
  searchPlaceholder = '검색어를 입력하세요...',
}) => {
  const location = useLocation();

  // 상수 기반 절대 경로 생성
  const explorePath = `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.EXPLORE}`;
  const dashboardPath = `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.DASHBOARD}`;
  const isStudyExplorePage = location.pathname === explorePath;

  // 네비게이션 메뉴 항목
  const navItems = [
    { to: ROUTES.HOME, label: '홈', type: 'link' as const },
    { to: explorePath, label: '스터디 찾기', type: 'link' as const },
    { to: dashboardPath, label: '내 스터디', type: 'link' as const },
  ];

  return (
    <header className='sticky top-0 left-0 right-0 z-50 h-20 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'>
      <div className='h-20 flex items-center'>
        {/* 로고 영역 */}
        <div className='w-64 flex items-center justify-center px-4 h-full'>
          <Logo size='lg' />
        </div>

        {/* 구분선 */}
        <div className='w-px h-12 bg-border'></div>

        {/* 탐색 영역 */}
        <div className='flex-1 flex items-center px-6 h-full'>
          <div className='relative w-full max-w-md'>
            <div className='relative group'>
              <input
                type='text'
                placeholder={
                  isStudyExplorePage
                    ? '스터디를 검색해보세요...'
                    : searchPlaceholder
                }
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch?.();
                  }
                }}
                className='w-full pl-4 pr-12 py-3 border-0 border-b-2 border-border bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:border-border-primary focus:ring-0 focus:outline-none transition-all duration-300 group-hover:border-border-primary/50'
              />
              <button
                type='button'
                onClick={onSearch}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110'
              >
                <Search className='h-5 w-5' />
              </button>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className='w-px h-12 bg-border'></div>

        {/* 네비게이션 영역 */}
        <div className='min-w-64 flex items-center justify-center px-6 h-full'>
          <nav className='flex items-center space-x-1'>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === item.to
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 구분선 */}
        <div className='w-px h-12 bg-border'></div>

        {/* 로그인/프로필 영역 */}
        <div className='w-40 flex items-center justify-center px-4 h-full'>
          <Link
            to={ROUTES.LOGIN}
            className='px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm'
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
