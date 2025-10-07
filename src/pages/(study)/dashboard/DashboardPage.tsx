import { useNavigate } from 'react-router-dom';
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
import { ROUTES } from '../../../constants';

/**
 * 스터디 대시보드 컴포넌트
 * - 특정 스터디의 대시보드 페이지 컨텐츠를 표시
 */
const DashboardPage = () => {
  const navigate = useNavigate();

  // 스터디 경로로 이동하는 헬퍼 함수
  const navigateToStudy = (path: string) => {
    navigate(`/${ROUTES.STUDY.ROOT}/${path}`);
  };

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
            documents={mockDocuments}
            onClick={() => navigateToStudy(ROUTES.STUDY.DOCUMENT)}
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
            onClick={() => navigateToStudy(ROUTES.STUDY.REFLECTION)}
          />
          <QuizSection onClick={() => navigateToStudy(ROUTES.STUDY.QUIZ)} />
        </DashboardRow>
      </DashboardGrid>
    </div>
  );
};

export default DashboardPage;
