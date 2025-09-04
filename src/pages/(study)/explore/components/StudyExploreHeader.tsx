/**
 * 스터디 탐색 페이지 전용 헤더
 * - 검색창이 포함된 헤더
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Logo } from '@/components/common';
import { ROUTES } from '@/constants';

interface StudyExploreHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const StudyExploreHeader: React.FC<StudyExploreHeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const location = useLocation();

  // 네비게이션 메뉴 항목
  const navItems = [
    { to: ROUTES.HOME, label: '홈' },
    { to: ROUTES.STUDY.EXPLORE, label: '스터디 탐색' },
  ];

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Logo size='lg' className='flex-shrink-0' />

        {/* 검색창 */}
        <div className='flex-1 max-w-md mx-8'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5' />
            <input
              type='text'
              placeholder='스터디 검색...'
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
            />
          </div>
        </div>

        {/* 네비게이션 메뉴 */}
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

export default StudyExploreHeader;
