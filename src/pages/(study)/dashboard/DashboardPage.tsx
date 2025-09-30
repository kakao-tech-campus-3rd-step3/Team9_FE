import { useNavigate, useParams } from 'react-router-dom';
import {
  NoticeSection,
  DocumentSection,
  ProgressSection,
  ScheduleSection,
  RetrospectSection,
  QuizSection,
  TitleRankingSection,
} from './components';
import { DashboardGrid, DashboardRow } from './components/layout';
import {
  mockNotices,
  mockDocuments,
  mockSchedules,
  mockStudyInfo,
  mockMyRanking,
} from './mock';
import { ROUTES, ROUTE_BUILDERS } from '../../../constants';
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

  const recentQuery = useRecentMaterialsQuery(Number(study_id));
  const goToDocumentDetail = (materialId: number) =>
    navigate(
      `${ROUTE_BUILDERS.study.document.detail(String(study_id), materialId)}`,
    );

  return (
    <div className='flex-1 overflow-y-auto bg-background'>
      <DashboardGrid>
        {/* 타이틀 및 랭킹 섹션 */}
        <TitleRankingSection
          studyInfo={mockStudyInfo}
          myRanking={mockMyRanking}
        />

        {/* 공지사항 - 가로 쭉 */}
        <DashboardRow cols={1}>
          <NoticeSection
            notices={mockNotices}
            onClick={() => navigateToStudy(ROUTES.STUDY.ADMIN.ROOT)}
          />
        </DashboardRow>

        {/* 문서, 진척도 - 한줄에 */}
        <DashboardRow cols={2}>
          <DocumentSection
            recent={
              Array.isArray(recentQuery.data) ? recentQuery.data : undefined
            }
            documents={
              Array.isArray(recentQuery.data) && recentQuery.data.length > 0
                ? []
                : mockDocuments
            }
            onClick={() => navigateToStudy(ROUTES.STUDY.DOCUMENT)}
            onItemClick={goToDocumentDetail}
          />
          <ProgressSection
            onClick={() => navigateToStudy(ROUTES.STUDY.PROGRESS)}
          />
        </DashboardRow>

        {/* 일정 - 한줄에 */}
        <DashboardRow cols={1}>
          <ScheduleSection
            schedules={mockSchedules}
            onClick={() => navigateToStudy(ROUTES.STUDY.SCHEDULE)}
          />
        </DashboardRow>

        {/* 회고, 퀴즈 - 한줄에 */}
        <DashboardRow cols={2}>
          <RetrospectSection
            onClick={() => navigateToStudy(ROUTES.STUDY.RETRO)}
          />
          <QuizSection onClick={() => navigateToStudy(ROUTES.STUDY.QUIZ)} />
        </DashboardRow>
      </DashboardGrid>
    </div>
  );
};

export default DashboardPage;
