import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  ExamplePage,
  HomePage,
  NotFoundPage,
  StudyExplorePage,
  StudyCreatePage,
  LoginPage,
  NotFoundPage,
  SignupPage,
} from '@/pages';
import { ROUTES } from '@/constants';
import { Layout } from '@/components';

/**
 * 애플리케이션 라우터 설정
 * - 각 페이지별로 다른 레이아웃 타입 적용
 * - 404 페이지는 레이아웃 없이 표시
 */
const router = createBrowserRouter([
  // 홈 페이지 (헤더만)
  {
    path: ROUTES.HOME,
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
    path: ROUTES.EXAMPLE,
    element: <Layout layoutType='sidebar-only' />,
    children: [
      {
        index: true,
        element: <ExamplePage />,
      },
    ],
  },

  // 스터디 탐색 페이지 (헤더만)
  {
    path: ROUTES.STUDY.EXPLORE,
    element: <Layout layoutType='header-only' />,
    children: [
      {
        index: true,
        element: <StudyExplorePage />,
      },
    ],
  },
  // 스터디 생성 페이지 (헤더만)
  {
    path: ROUTES.STUDY.CREATE,
    element: <Layout layoutType='header-only' />,
    children: [
      {
        index: true,
        element: <StudyCreatePage />,
  // 로그인 페이지 (레이아웃 없음)
  {
    path: ROUTES.LOGIN,
    element: <Layout layoutType='none' />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },

  // 회원가입 페이지 (레이아웃 없음)
  {
    path: ROUTES.SIGNUP,
    element: <Layout layoutType='none' />,
    children: [
      {
        index: true,
        element: <SignupPage />,
      },
    ],
  },

  // 404 페이지 (레이아웃 없음)
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
