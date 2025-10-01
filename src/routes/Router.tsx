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
import { useAuthStatus } from '@/hooks';

/**
 * 애플리케이션 라우터 설정
 * - 각 페이지별로 다른 레이아웃 타입 적용
 * - 404 페이지는 레이아웃 없이 표시
 */

// 인증 여부에 따른 루트 경로
const RootIndexRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStatus();
  return isAuthenticated ? (
    <routes.Home />
  ) : (
    <Navigate to={`/${ROUTES.STUDY.ROOT}/${ROUTES.STUDY.EXPLORE}`} replace />
  );
};

const router = createBrowserRouter([
  // 홈 페이지 (헤더만) - 인증 필요
  {
    path: ROUTES.HOME,
    element: <Layout layoutType='header-only' />,
    children: [{ index: true, element: <RootIndexRoute /> }],
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

  // 스터디 탐색 - 헤더만 사용하는 영역 (전역)
  {
    path: ROUTES.STUDY.ROOT,
    element: <Layout layoutType='header-only' />,
    children: [
      {
        path: ROUTES.STUDY.EXPLORE,
        element: <routes.StudyExplore />,
      },
      {
        path: ROUTES.STUDY.CREATE,
        element: <routes.StudyCreate />,
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
            path: ROUTES.STUDY.DOCUMENT.ROOT,
            children: [
              { index: true, element: <routes.StudyDocument /> },
              {
                path: ROUTES.STUDY.DOCUMENT.ADD,
                element: <routes.StudyDocumentAdd />,
              },
              {
                path: ROUTES.STUDY.DOCUMENT.DETAIL,
                element: <routes.StudyDocumentDetail />,
              },
              {
                path: ROUTES.STUDY.DOCUMENT.EDIT,
                element: <routes.StudyDocumentEdit />,
              },
            ],
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
          {
            path: ROUTES.STUDY.REFLECTION,
            element: <routes.StudyReflection />,
          },
          {
            path: `${ROUTES.STUDY.REFLECTION}/write`,
            element: <routes.StudyReflectionDetail />,
          },
          {
            path: `${ROUTES.STUDY.REFLECTION}/:id`,
            element: <routes.StudyReflectionView />,
          },
          {
            path: `${ROUTES.STUDY.REFLECTION}/:id/edit`,
            element: <routes.StudyReflectionDetail />,
          },
          {
            path: ROUTES.STUDY.ADMIN.ROOT,
            element: <routes.StudyAdmin />,
            children: [
              {
                index: true,
                element: <Navigate to={ROUTES.STUDY.ADMIN.MEMBERS} replace />,
              },
              {
                path: ROUTES.STUDY.ADMIN.MEMBERS,
                element: <routes.StudyAdminMembers />,
              },
              {
                path: ROUTES.STUDY.ADMIN.APPLICANTS,
                element: <routes.StudyAdminApplicants />,
              },
              {
                path: ROUTES.STUDY.ADMIN.STUDY_INFO,
                element: <routes.StudyAdminStudyInfo />,
              },
            ],
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
