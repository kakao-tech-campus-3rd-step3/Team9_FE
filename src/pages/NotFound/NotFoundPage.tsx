import React from 'react';
import { Link } from 'react-router-dom';

// 404 페이지
const NotFoundPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-card p-8 flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-destructive mb-4'>404</h1>
        <h3 className='text-lg font-bold text-muted-foreground mb-2'>
          페이지를 찾을 수 없습니다
        </h3>
        <p className='text-muted-foreground mb-6'>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          to='/'
          className='inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors'
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
