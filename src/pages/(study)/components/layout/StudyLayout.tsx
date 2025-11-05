import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './sidebar/Sidebar';

/**
 * (study) 도메인 전용 레이아웃
 * - 좌측: 도메인 사이드바
 * - 우측: 도메인 컨텐츠
 */
function StudyLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex h-screen bg-background overflow-hidden'>
      {/* 데스크톱 사이드바 */}
      <aside className='hidden md:block w-64 shrink-0 h-full bg-card border-r border-border overflow-y-auto'>
        <Sidebar />
      </aside>

      {/* 모바일: 플로팅 햄버거 버튼 */}
      {!open && (
        <button
          type='button'
          className='md:hidden fixed right-3 top-3 z-20 p-3 rounded-xl bg-background/95 border border-border shadow-lg hover:bg-accent text-foreground backdrop-blur'
          aria-label='사이드바 열기'
          onClick={() => setOpen(true)}
        >
          <Menu className='w-6 h-6' />
        </button>
      )}

      {/* 모바일 사이드바 오버레이 */}
      {open && (
        <div
          className='md:hidden fixed inset-0 bg-black/50 z-40'
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* 모바일 사이드바 슬라이드 */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 bg-background border-r border-border z-50 shadow-xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        role='dialog'
        aria-modal='true'
      >
        <div className='h-full overflow-y-auto'>
          <Sidebar />
        </div>
      </aside>

      {/* 모바일: 플로팅 닫기 버튼 (사이드바 열렸을 때만) */}
      {open && (
        <button
          type='button'
          className='md:hidden fixed right-3 top-3 z-[60] p-3 rounded-xl bg-background/95 border border-border shadow-lg hover:bg-accent text-foreground backdrop-blur'
          aria-label='사이드바 닫기'
          onClick={() => setOpen(false)}
        >
          <X className='w-6 h-6' />
        </button>
      )}

      <main className='flex-1 min-w-0 flex flex-col min-h-0 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
}

export default StudyLayout;
