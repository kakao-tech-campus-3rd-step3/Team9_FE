import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  NoticeSection,
  DocumentSection,
  ScheduleSection,
  TitleRankingSection,
  ProgressWidget,
  RetrospectWidget,
  QuizWidget,
  RankingListModal,
} from './components';
import { DashboardGrid, DashboardRow } from './components/layout';
import { ROUTES, ROUTE_BUILDERS } from '../../../constants';
import { useDashboardQuery } from './hooks/useDashboard';
import { useRecentMaterialsQuery } from '@/pages/(study)/document/hooks/useMaterials';

/**
 * 스터디 대시보드 컴포넌트
 * - 특정 스터디의 대시보드 페이지 컨텐츠를 표시
 */
const DashboardPage = () => {
  const navigate = useNavigate();

  // 스터디 경로로 이동하는 헬퍼 함수
  const { study_id } = useParams<{ study_id: string }>();
  const navigateToStudy = (path: string) => {
    if (!study_id) return;
    navigate(`${ROUTE_BUILDERS.study.root(study_id)}/${path}`);
  };

  const studyIdNum = Number(study_id);
  const [isRankingOpen, setIsRankingOpen] = React.useState(false);

  const {
    dashboard: dashboardQuery,
    progress: progressQuery,
    retrospect: retrospectQuery,
    myRanking: myRankingQuery,
    rankingList: rankingListQuery,
    quizzesRecent: quizzesRecentQuery,
  } = useDashboardQuery(studyIdNum, { enableRankingList: isRankingOpen });
  const studyTitle = dashboardQuery.data?.studyTitle;
  const recentQuery = useRecentMaterialsQuery(studyIdNum);

  return (
    <div className='flex-1 overflow-y-auto bg-background'>
      <DashboardGrid>
        {/* 타이틀/랭킹 */}
        <TitleRankingSection
          studyTitle={studyTitle}
          myRanking={myRankingQuery.data}
          onOpenRanking={() => setIsRankingOpen(true)}
          isLoading={dashboardQuery.isLoading}
        />

        {/* 공지 - 가로 쭉 */}
        <DashboardRow cols={1}>
          <NoticeSection
            notices={
              dashboardQuery.data?.latestNotice
                ? [dashboardQuery.data.latestNotice]
                : []
            }
            isLoading={dashboardQuery.isLoading}
            isError={dashboardQuery.isError}
            onClick={() => navigateToStudy(ROUTES.STUDY.DOCUMENT.ROOT)}
            onItemClick={(noticeId) =>
              navigate(
                `${ROUTE_BUILDERS.study.document.detail(
                  String(study_id),
                  noticeId,
                )}`,
              )
            }
          />
        </DashboardRow>

        {/* 문서, 진척도 */}
        <DashboardRow cols={2}>
          <DocumentSection
            recent={
              Array.isArray(recentQuery.data) ? recentQuery.data : undefined
            }
            isLoading={recentQuery.isLoading}
            onClick={() => navigateToStudy(ROUTES.STUDY.DOCUMENT.ROOT)}
            onItemClick={(materialId) =>
              navigate(
                `${ROUTE_BUILDERS.study.document.detail(
                  String(study_id),
                  materialId,
                )}`,
              )
            }
          />
          <ProgressWidget
            data={progressQuery.data}
            isLoading={progressQuery.isLoading}
            isError={progressQuery.isError}
            onClick={() => navigateToStudy(ROUTES.STUDY.PROGRESS)}
          />
        </DashboardRow>

        {/* 일정 */}
        <DashboardRow cols={1}>
          <ScheduleSection
            schedules={
              dashboardQuery.data?.upcomingSchedule
                ? [dashboardQuery.data.upcomingSchedule]
                : []
            }
            isLoading={dashboardQuery.isLoading}
            isError={dashboardQuery.isError}
            onClick={() => navigateToStudy(ROUTES.STUDY.SCHEDULE)}
          />
        </DashboardRow>

        {/* 회고, 퀴즈 */}
        <DashboardRow cols={2}>
          <RetrospectWidget
            data={retrospectQuery.data}
            isLoading={retrospectQuery.isLoading}
            isError={retrospectQuery.isError}
            onClick={() => navigateToStudy(ROUTES.STUDY.REFLECTION)}
          />
          <QuizWidget
            data={quizzesRecentQuery.data}
            isLoading={quizzesRecentQuery.isLoading}
            onClick={() => navigateToStudy(ROUTES.STUDY.QUIZ)}
          />
        </DashboardRow>
      </DashboardGrid>
      <RankingListModal
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
        items={rankingListQuery.data ?? []}
      />
    </div>
  );
};

export default DashboardPage;
