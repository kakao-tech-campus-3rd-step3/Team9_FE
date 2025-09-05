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
      <Sidebar />
      <main className='flex-1 flex flex-col min-h-0'>
        <Outlet />
      </main>
    </div>
  );
}

export default StudyLayout;
