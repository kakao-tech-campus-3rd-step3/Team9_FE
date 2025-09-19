import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';

/**
 * (study) 도메인 전용 레이아웃
 * - 좌측: 도메인 사이드바
 * - 우측: 도메인 컨텐츠
 */
function StudyLayout() {
  return (
    <div className='flex h-screen bg-background'>
      <div className='w-64 fixed left-0 top-0 h-full bg-card border-r border-border overflow-y-auto z-10'>
        <Sidebar />
      </div>
      <main className='flex-1 ml-64 flex flex-col min-h-0 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
}

export default StudyLayout;
