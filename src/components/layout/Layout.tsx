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
}

/**
 * 레이아웃 컴포넌트
 * - 다양한 레이아웃 타입을 지원 (헤더, 사이드바 조합)
 * - 반응형 레이아웃 구조 제공
 */
const Layout: React.FC<LayoutProps> = ({ layoutType = 'none' }) => {
  const renderLayout = () => {
    switch (layoutType) {
      case 'header-only':
        return (
          <div className='min-h-screen bg-background'>
            <Header />
            <main>
              <div className='max-w-7xl mx-auto'>
                <Outlet />
              </div>
            </main>
          </div>
        );

      case 'sidebar-only':
        return (
          <div className='min-h-screen bg-background'>
            <div className='max-w-7xl mx-auto flex'>
              <Sidebar />
              <main className='flex-1'>
                <Outlet />
              </main>
            </div>
          </div>
        );

      case 'header-sidebar':
        return (
          <div className='min-h-screen bg-background'>
            <Header />
            <div className='max-w-7xl mx-auto'>
              <div className='flex pt-16'>
                <Sidebar />
                <main className='flex-1'>
                  <Outlet />
                </main>
              </div>
            </div>
          </div>
        );

      case 'none':
      default:
        return (
          <div className='min-h-screen bg-background'>
            <div className='max-w-7xl mx-auto'>
              <Outlet />
            </div>
          </div>
        );
    }
  };

  return renderLayout();
};

export default Layout;
