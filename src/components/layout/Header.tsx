import React, { useState, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Search } from 'lucide-react';
import { Logo, ProfileSkeleton } from '@/components/common';
import { UserProfileSection } from '@/components/user';
import { ROUTES } from '@/constants';

/**
 * 헤더 컴포넌트
 * - 로고와 네비게이션 메뉴를 포함
 * - 현재 페이지에 따른 활성 메뉴 하이라이트
 * - 반응형 디자인으로 모바일에서 토글 메뉴 지원
 */
const Header: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 상수 기반 절대 경로 생성
  const explorePath = `/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.EXPLORE}`;

  // 네비게이션 메뉴 항목
  const navItems = [
    {
      to: ROUTES.HOME,
      label: '홈',
      icon: Home,
      type: 'link' as const,
    },
    {
      to: explorePath,
      label: '스터디 찾기',
      icon: Search,
      type: 'link' as const,
    },
  ];

  return (
    <>
      <header className='sticky top-0 left-0 right-0 z-50 h-20 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'>
        <div className='max-w-7xl mx-auto h-20 flex items-center'>
          {/* 로고 영역 - 항상 최소 크기 유지 */}
          <div className='min-w-48 w-48 lg:w-64 flex items-center justify-center pl-4 pr-2 lg:px-4 h-full'>
            <Logo size='lg' />
          </div>

          {/* 구분선 - 데스크톱에서만 표시 */}
          <div className='hidden lg:block w-px h-12 bg-border'></div>

          {/* 적절한 포지션 유지를 위한 빈 박스*/}
          {/* TODO: 추후 동적 검색창 추가 예정   */}
          <div className='flex-1' />

          {/* 구분선 - 데스크톱에서만 표시 */}
          <div className='hidden lg:block w-px h-12 bg-border'></div>

          {/* 데스크톱 네비게이션 영역 */}
          <div className='hidden lg:flex min-w-64 items-center justify-center px-6 h-full'>
            <nav className='flex items-center space-x-1'>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      location.pathname === item.to
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <IconComponent className='w-4 h-4' />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <div className='lg:hidden flex items-center pl-2 pr-4'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200'
              aria-label='메뉴 토글'
            >
              {isMobileMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          </div>

          {/* 구분선 - 데스크톱에서만 표시 */}
          <div className='hidden lg:block w-px h-12 bg-border'></div>

          {/* 데스크톱 로그인/프로필 영역 */}
          <div className='hidden lg:flex w-40 items-center justify-center px-4 h-full'>
            <Suspense
              fallback={<ProfileSkeleton variant='header' showRole={false} />}
            >
              <UserProfileSection variant='header' />
            </Suspense>
          </div>
        </div>
      </header>

      {/* 모바일 메뉴 - 토글로 표시/숨김 */}
      {isMobileMenuOpen && (
        <div className='lg:hidden fixed top-20 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-lg'>
          <div className='max-w-7xl mx-auto py-3 px-3 space-y-1'>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.to
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <IconComponent className='w-5 h-5' />
                  {item.label}
                </Link>
              );
            })}
            <div className='pt-2 border-t border-border'>
              <Suspense
                fallback={<ProfileSkeleton variant='header' showRole={false} />}
              >
                <UserProfileSection
                  variant='header'
                  onMobileMenuClose={() => setIsMobileMenuOpen(false)}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
