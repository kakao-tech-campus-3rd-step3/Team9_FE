import dayjs from 'dayjs';
import {
  MemberInfoSection,
  ScheduleManageSection,
  StudyCalendarSection,
} from './components';
import { studyColor } from '@/utils';
import { useState } from 'react';
import { useScheduleStudyQuery } from './hooks/useScheduleStudyQuery';
import { useAuthStore } from '@/stores';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

const ManagePage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const currentStudy = useAuthStore((state) => state.user.currentStudy);
  const studyId = currentStudy?.study_id;

  if (!studyId) {
    navigate(ROUTES.HOME);
  }

  const { data: studySchedules } = useScheduleStudyQuery({
    study_id: studyId || 0,
  });
  const dateEvent =
    studySchedules
      ?.filter((schedule) => dayjs(schedule.start_time).isSame(date, 'day'))
      .map((schedule) => ({
        id: schedule.schedule_id,
        title: schedule.title,
        start_time: dayjs(schedule.start_time),
        end_time: dayjs(schedule.end_time),
        color: studyColor(studyId || 0),
      })) || [];

  return (
    <div className='flex flex-col p-4 items-center justify-center'>
      <div className='flex p-4 gap-8 w-full justify-center'>
        <StudyCalendarSection
          studyId={studyId || 0}
          schedules={studySchedules || []}
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
