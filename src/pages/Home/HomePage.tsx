import React, { useMemo } from 'react';
import { mainDashboard } from './mock/studyData';
import {
  CalendarSection,
  ScheduleSection,
  StudyListSection,
} from './components';
import { studyColor } from '@/utils';

/**
 * 홈페이지 컴포넌트
 * - 메인 페이지 컨텐츠를 표시
 */
const HomePage: React.FC = () => {
  const studyTitles = useMemo(
    () =>
      mainDashboard.flatMap((dashboard) =>
        dashboard.studies.map((study) => ({
          id: study.study_id,
          title: study.title,
          color: studyColor(study.study_id),
        })),
      ),
    [],
  );
  const schedules = useMemo(
    () =>
      mainDashboard.flatMap((dashboard) =>
        dashboard.studies.flatMap((study) =>
          study.schedule.map((s) => ({
            ...s,
            color: studyColor(study.study_id),
          })),
        ),
      ),
    [],
  );

  return (
    <div className='h-full bg-background p-8 text-center flex flex-col justify-center items-center'>
      <div className='flex w-full flex-col px-8 pb-4 items-center'>
        <StudyListSection studies={studyTitles} />
      </div>
      <div className='flex gap-4 w-full h-full px-8 justify-center'>
        <CalendarSection schedules={schedules} />
        <ScheduleSection schedules={schedules} />
      </div>
    </div>
  );
};

export default HomePage;
