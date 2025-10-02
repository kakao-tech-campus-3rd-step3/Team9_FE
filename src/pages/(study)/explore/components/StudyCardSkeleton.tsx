import React from 'react';

/**
 * 스터디 카드 로딩 스켈레톤 컴포넌트
 */
const StudyCardSkeleton: React.FC = () => {
  return (
    <div className='bg-card border border-border rounded-lg p-4 animate-pulse'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <div className='h-5 bg-muted rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-muted rounded w-1/2'></div>
        </div>
        <div className='h-6 bg-muted rounded w-16'></div>
      </div>

      <div className='space-y-2 mb-4'>
        <div className='h-4 bg-muted rounded w-full'></div>
        <div className='h-4 bg-muted rounded w-5/6'></div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex space-x-2'>
          <div className='h-6 bg-muted rounded w-12'></div>
          <div className='h-6 bg-muted rounded w-16'></div>
        </div>
        <div className='h-8 bg-muted rounded w-20'></div>
      </div>
    </div>
  );
};

export default StudyCardSkeleton;
