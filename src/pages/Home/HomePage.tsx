import React from 'react';

/**
 * 홈페이지 컴포넌트
 * - 메인 페이지 컨텐츠를 표시
 */
const HomePage: React.FC = () => {
  return (
    <div className='h-full bg-accent p-8 text-center flex flex-col justify-center items-center'>
      <h2 className='text-muted-foreground mb-2'>메인 컨텐츠 영역</h2>
      <p className='text-muted-foreground'>
        여기에 실제 홈 페이지 컨텐츠가 들어갈 자리입니다.
      </p>
    </div>
  );
};

export default HomePage;
