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
      start_time: dayjs(schedule.start_time),
      end_time: dayjs(schedule.end_time),
      color: studyColor(schedules.study_id),
    }));

  return (
    <div className='flex flex-col p-4 items-center justify-center'>
      <div className='flex p-4 gap-8 w-full justify-center'>
        <StudyCalendarSection
          schedules={schedules}
          date={date}
          setDate={setDate}
        />
        <ScheduleManageSection events={dateEvent} date={date} />
      </div>
      <MemberInfoSection />
    </div>
  );
};

export default ManagePage;
