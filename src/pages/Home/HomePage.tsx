import React from 'react';
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
  const studyTitles = mainDashboard.flatMap((dashboard) =>
    dashboard.studies.map((study) => ({
      title: study.title,
      color: studyColor(study.study_id),
    })),
  );
  const schedules = mainDashboard.flatMap((dashboard) =>
    dashboard.studies.flatMap((study) =>
      study.schedule.map((s) => ({
        ...s,
        color: studyColor(study.study_id),
      })),
    ),
  );

  return (
    <div className='h-full bg-accent p-8 text-center flex flex-col justify-center items-center'>
      <div className='flex w-full flex-col px-8 pb-4 items-center'>
        <StudyListSection studies={studyTitles} />
      </div>
      <div className='flex flex-1 gap-4 w-full px-8 justify-center'>
        <CalendarSection schedules={schedules} />
        <ScheduleSection schedules={schedules} />
      </div>
    </div>
  );
};

export default HomePage;
