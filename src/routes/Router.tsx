import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
  ExamplePage,
  HomePage,
  LoginPage,
  NotFoundPage,
  SignupPage,
} from '@/pages';
import { ROUTES } from '@/constants';
import { Layout } from '@/components';
import {
  DashboardPage,
  StudyLayout,
  DocumentPage,
  DocumentAddPage,
  DocumentDetailPage,
  DocumentEditPage,
} from '@/pages/(study)';

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

  // 스터디 - 전역 그룹 (study/...)
  {
    path: ROUTES.STUDY.ROOT,
    children: [
      // 스터디 연관 사이드바 사용하는 영역
      {
        element: <StudyLayout />,
        children: [
          { path: ROUTES.STUDY.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.STUDY.DOCUMENT, element: <DocumentPage /> },
          { path: ROUTES.STUDY.DOCUMENT_ADD, element: <DocumentAddPage /> },
          {
            path: ROUTES.STUDY.DOCUMENT_DETAIL,
            element: <DocumentDetailPage />,
          },
          { path: ROUTES.STUDY.DOCUMENT_EDIT, element: <DocumentEditPage /> },
          { path: ROUTES.STUDY.PROGRESS, element: <ExamplePage /> },
          { path: ROUTES.STUDY.SCHEDULE, element: <ExamplePage /> },
          { path: ROUTES.STUDY.QUIZ, element: <ExamplePage /> },
          { path: ROUTES.STUDY.RETRO, element: <ExamplePage /> },
          { path: ROUTES.STUDY.ADMIN, element: <ExamplePage /> },
        ],
      },

      // 헤더만 사용하는 영역
      {
        element: <Layout layoutType='header-only' />,
        children: [
          { path: ROUTES.STUDY.EXPLORE, element: <ExamplePage /> },
          { path: ROUTES.STUDY.CREATE, element: <ExamplePage /> },
        ],
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
