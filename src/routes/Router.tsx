import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { ROUTES, ROUTE_PARAMS } from '@/constants';
import { Layout } from '@/components';
import { StudyLayout } from '@/pages/(study)';
import routes from './routeConfig';

/**
 * 애플리케이션 라우터 설정
 * - 각 페이지별로 다른 레이아웃 타입 적용
 * - 404 페이지는 레이아웃 없이 표시
 */
const router = createBrowserRouter([
  // 홈 페이지 (헤더만) - 인증 필요
  {
    path: ROUTES.HOME,
    element: <Layout layoutType='header-only' />,
    children: [
      {
        index: true,
        element: <routes.Home />,
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
        element: <routes.Example />,
      },
    ],
  },

  // 로그인 페이지 (레이아웃 없음) - 게스트만 접근 가능
  {
    path: ROUTES.LOGIN,
    element: <Layout layoutType='none' />,
    children: [
      {
        index: true,
        element: <routes.Login />,
      },
    ],
  },

  // 회원가입 페이지 (레이아웃 없음) - 게스트만 접근 가능
  {
    path: ROUTES.SIGNUP,
    element: <Layout layoutType='none' />,
    children: [
      {
        index: true,
        element: <routes.Signup />,
      },
    ],
  },

  // 스터디 - 전역 그룹 (study/:study_id/...) - 인증 필요
  {
    path: `${ROUTES.STUDY.ROOT}/:${ROUTE_PARAMS.studyId}`,
    children: [
      // 스터디 연관 사이드바 사용하는 영역
      {
        element: <StudyLayout />,
        children: [
          {
            path: ROUTES.STUDY.DASHBOARD,
            element: <routes.StudyDashboard />,
          },
          {
            path: ROUTES.STUDY.DOCUMENT,
            element: <routes.StudyDocument />,
          },
          {
            path: ROUTES.STUDY.DOCUMENT_ADD,
            element: <routes.StudyDocumentAdd />,
          },
          {
            path: ROUTES.STUDY.DOCUMENT_DETAIL,
            element: <routes.StudyDocumentDetail />,
          },
          {
            path: ROUTES.STUDY.DOCUMENT_EDIT,
            element: <routes.StudyDocumentEdit />,
          },
          { path: ROUTES.STUDY.PROGRESS, element: <routes.StudyProgress /> },
          {
            path: ROUTES.STUDY.SCHEDULE,
            element: <routes.Schedule />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.SCHEDULE.MANAGE} replace />,
              },
              {
                path: ROUTES.SCHEDULE.MANAGE,
                element: <routes.ScheduleManage />,
              },
              {
                path: ROUTES.SCHEDULE.TUNE,
                element: <routes.ScheduleTune />,
              },
            ],
          },
          { path: ROUTES.STUDY.QUIZ, element: <routes.Example /> },
          { path: ROUTES.STUDY.RETRO, element: <routes.Example /> },
          {
            path: ROUTES.STUDY.ADMIN.ROOT,
            element: <routes.StudyAdmin />,
            children: [
              {
                index: true,
                element: <Navigate to='members' replace />,
              },
              {
                path: 'members',
                element: <routes.StudyAdminMembers />,
              },
              {
                path: 'applicants',
                element: <routes.StudyAdminApplicants />,
              },
              {
                path: 'study-info',
                element: <routes.StudyAdminStudyInfo />,
              },
            ],
          },
        ],
      },

      // 헤더만 사용하는 영역 - 스터디 생성 (인증 필요)
      {
        element: <Layout layoutType='header-only' />,
        children: [
          {
            path: ROUTES.STUDY.CREATE,
            element: <routes.StudyCreate />,
          },
        ],
      },

      // 헤더만 사용하는 영역 - 스터디 탐색
      {
        element: <Layout layoutType='header-only' />,
        children: [
          {
            path: ROUTES.STUDY.EXPLORE,
            element: <routes.StudyExplore />,
          },
        ],
      },
    ],
  },

  // 전역 일정 라우트 제거 (스터디 내부로 이동)

  // 404 페이지 (레이아웃 없음)
  {
    path: '*',
    element: <routes.NotFound />,
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
