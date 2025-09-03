/**
 * 스터디 탐색 페이지 헤더 컴포넌트
 */

import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

        {/* 네비게이션 */}
        <nav className='flex items-center space-x-6'>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
          >
            홈
          </button>
          <button
            onClick={() => navigate(ROUTES.STUDY.CREATE)}
            className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
          >
            스터디 생성
          </button>
        </nav>
      </div>
    </header>
  );
};

export default StudyExploreHeader;
