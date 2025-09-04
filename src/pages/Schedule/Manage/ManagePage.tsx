import dayjs from 'dayjs';
import {
  MemberInfoSection,
  ScheduleManageSection,
  StudyCalendarSection,
} from './components';
import { studyColor } from '@/utils';
import { schedules } from './mock/schedule';
import { useState } from 'react';

const ManagePage = () => {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const dateEvent = schedules.schedule
    .filter((schedule) => dayjs(schedule.start_time).isSame(date, 'day'))
    .map((schedule) => ({
      id: schedule.schedule_id,
      title: schedule.title,
      date: dayjs(schedule.start_time).format('YYYY-MM-DD'),
      color: studyColor(schedules.study_id),
    }));

  return (
    <div className='p-4'>
      <div className='flex p-4 gap-2'>
        <StudyCalendarSection
          schedules={schedules}
          date={date}
          setDate={setDate}
        />
        <ScheduleManageSection event={dateEvent} />
      </div>

      <MemberInfoSection />
    </div>
  );
};

export default ManagePage;
