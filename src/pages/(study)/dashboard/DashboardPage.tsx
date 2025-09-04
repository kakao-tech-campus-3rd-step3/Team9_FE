import React from 'react';

/**
 * 스터디 대시보드 컴포넌트
 * - 특정 스터디의 대시보드 페이지 컨텐츠를 표시
 */
const DashboardPage: React.FC = () => {
  return (
    <div className='h-full bg-accent p-8 text-center flex flex-col justify-center items-center'>
      <div className='flex w-full flex-col px-8 pb-4 items-center'>
        {/* 헤더(타이틀) 섹션 */}
      </div>
      <div className='flex gap-4 w-full h-full px-8 justify-center'>
        {/* 대시보드 섹션 */}
      </div>
    </div>
  );
};

export default DashboardPage;
