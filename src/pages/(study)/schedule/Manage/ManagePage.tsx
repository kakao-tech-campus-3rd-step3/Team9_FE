import dayjs from 'dayjs';
import {
  MemberInfoSection,
  ScheduleManageSection,
  StudyCalendarSection,
} from './components';
import { studyColor } from '@/utils';
import { Suspense, useState } from 'react';
import { useScheduleStudyQuery } from './hooks/useScheduleStudyQuery';
import { useAuthStore } from '@/stores';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { LoadingSpinner } from '@/components';

const ManagePage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { study_id } = useParams<{ study_id: string }>();
  const currentStudy = useAuthStore((state) => state.user.currentStudy);

  if (!study_id) {
    navigate(ROUTES.HOME);
  }

  const { data: studySchedules } = useScheduleStudyQuery({
    study_id: Number(study_id),
  });

  const dateEvent =
    studySchedules
      ?.filter((schedule) => dayjs(schedule.start_time).isSame(date, 'day'))
      .map((schedule) => ({
        id: schedule.schedule_id,
        title: schedule.title,
        start_time: dayjs(schedule.start_time),
        end_time: dayjs(schedule.end_time),
        color: studyColor(Number(study_id)),
      })) || [];

  if (!study_id) {
    return null;
  }

  return (
    <div className='flex flex-col p-4 items-center justify-center'>
      <div className='flex p-4 gap-8 w-full justify-center'>
        <StudyCalendarSection
          studyId={Number(study_id)}
          schedules={studySchedules || []}
          date={date}
          setDate={setDate}
        />
        <ScheduleManageSection
          events={dateEvent}
          date={date}
          role={currentStudy?.role || 'MEMBER'}
        />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <MemberInfoSection study_id={Number(study_id)} />
      </Suspense>
    </div>
  );
};

export default ManagePage;
