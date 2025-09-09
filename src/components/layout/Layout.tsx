import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export type LayoutType =
  | 'none'
  | 'header-only'
  | 'header-with-back'
  | 'sidebar-only'
  | 'header-sidebar';

interface LayoutProps {
  layoutType?: LayoutType;
  children?: React.ReactNode;
}

/**
 * 레이아웃 컴포넌트
 * - 다양한 레이아웃 타입을 지원 (헤더, 사이드바 조합)
 * - 반응형 레이아웃 구조 제공
 */
const Layout: React.FC<LayoutProps> = ({ layoutType = 'none', children }) => {
  const renderLayout = () => {
    switch (layoutType) {
      case 'header-only':
        return (
          <div className='min-h-screen bg-background'>
            <Header />
            <main className='flex-1 overflow-auto'>
              {children || <Outlet />}
            </main>
          </div>
        );

      case 'sidebar-only':
        return (
          <div className='flex min-h-screen bg-background'>
            <Sidebar />
            <main className='flex-1 overflow-auto'>
              <Outlet />
            </main>
          </div>
        );

      case 'header-sidebar':
        return (
          <div className='min-h-screen bg-background'>
            <Header />
            <div className='flex pt-16 h-[calc(100vh-4rem)]'>
              <Sidebar />
              <main className='flex-1 overflow-auto'>
                {children || <Outlet />}
              </main>
            </div>
          </div>
        );

      case 'none':
      default:
        return (
          <div className='min-h-screen bg-background'>
            {children || <Outlet />}
          </div>
        );
    }
  };

  return renderLayout();
};

export default Layout;
