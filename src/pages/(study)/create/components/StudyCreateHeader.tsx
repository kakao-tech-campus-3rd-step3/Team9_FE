/**
 * 스터디 생성 페이지 헤더 컴포넌트
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common';
import { ROUTES } from '@/constants';

const StudyCreateHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Logo size='lg' className='flex-shrink-0' />

        {/* 네비게이션 */}
        <nav className='flex items-center space-x-6'>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
          >
            홈
          </button>
          <button
            onClick={() => navigate(ROUTES.STUDY.EXPLORE)}
            className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
          >
            스터디 탐색
          </button>
        </nav>
      </div>
    </header>
  );
};

export default StudyCreateHeader;
