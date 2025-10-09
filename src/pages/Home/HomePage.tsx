import React, { useMemo, useState } from 'react';
import { mainDashboard } from './mock/studyData';
import {
  CalendarSection,
  ScheduleSection,
  StudyListSection,
} from './components';
import { studyColor } from '@/utils';
import dayjs from 'dayjs';

/**
 * 홈페이지 컴포넌트
 * - 메인 페이지 컨텐츠를 표시
 */
const HomePage: React.FC = () => {
  const [year, setYear] = useState(dayjs().year());
  const [month, setMonth] = useState(dayjs().month() + 1);

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
        <StudyListSection />
      </div>
      <div className='flex gap-4 w-full h-full px-8 justify-center'>
        <CalendarSection
          year={year}
          setYear={setYear}
          month={month}
          setMonth={setMonth}
        />
        <ScheduleSection schedules={schedules} />
      </div>
    </div>
  );
};

export default HomePage;
