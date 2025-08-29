import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { HomePage } from '../pages/Home';
import { NotFoundPage } from '../pages/NotFound';
import { ExamplePage } from '../pages/Example';

/**
 * 애플리케이션 라우터 설정
 * - 각 페이지별로 다른 레이아웃 타입 적용
 * - 404 페이지는 레이아웃 없이 표시
 */
const router = createBrowserRouter([
  // 홈 페이지 (헤더만)
  {
    path: '/',
    element: <Layout layoutType='header-only' />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },

  // 예시 페이지 (사이드바만)
  {
    path: '/example',
    element: <Layout layoutType='sidebar-only' />,
    children: [
      {
        index: true,
        element: <ExamplePage />,
      },
    ],
  },

  // 404 페이지 (레이아웃 없음)
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
