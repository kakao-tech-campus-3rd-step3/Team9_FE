import { formatDayOfTheWeek, studyColor } from '@/utils';
import dayjs from 'dayjs';
import ScheduleItem from './ScheduleItem';
import { useScheduleMeQuery } from '../hooks/useScheduleMeQuery';

const ScheduleSection = () => {
  const now = dayjs();
  const { data: scheduleData } = useScheduleMeQuery({
    year: now.year(),
    month: now.month() + 1,
  });
  const todaySchedules = scheduleData?.filter((schedule) =>
    dayjs(schedule.start_time).isSame(now, 'day'),
  );
  const afterSchedules =
    scheduleData
      ?.filter((schedule) => dayjs(schedule.start_time).isAfter(now, 'day'))
      .sort(
        (a, b) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf(),
      ) || [];

  return (
    <section className='flex-2 flex flex-col h-full w-full min-h-[660px] max-w-lg border-2 border-primary rounded-xl p-6 gap-2 bg-blue-50 text-left'>
      <div className='text-lg font-medium'>{formatDayOfTheWeek(now.day())}</div>
      <div className='text-4xl font-bold'>{now.format('DD')}</div>
      <div className='flex h-full flex-col p-3 gap-4'>
        {todaySchedules?.length === 0 && (
          <div className='text-gray-500 text-xl font-bold'>
            예정된 일정이 없습니다.
          </div>
        )}
        {todaySchedules?.map((schedule) => (
          <ScheduleItem
            key={`${schedule.title}-${schedule.start_time}`}
            title={schedule.title}
            date={schedule.start_time}
            color={studyColor(schedule.study_id)}
          />
        ))}
        {afterSchedules?.length > 0 && (
          <div className='text-lg font-medium'>이후 일정</div>
        )}
        {afterSchedules?.map((schedule) => (
          <ScheduleItem
            key={`${schedule.title}-${schedule.start_time}`}
            title={schedule.title}
            date={schedule.start_time}
            color={studyColor(schedule.study_id)}
          />
        ))}
      </div>
    </section>
  );
};

export default ScheduleSection;
