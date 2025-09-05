import type { Dayjs } from 'dayjs';
import ScheduleManageCard from './ScheduleManageCard';
import dayjs from 'dayjs';

type ScheduleManageSectionProps = {
  events: {
    id: number;
    title: string;
    start_time: Dayjs;
    end_time: Dayjs;
    color: string;
  }[];
  date: string;
};

const ScheduleManageSection = ({
  events,
  date,
}: ScheduleManageSectionProps) => {
  return (
    <section className='flex-3 flex flex-col w-full h-[586px] border-2 border-primary rounded-xl p-6 gap-3 bg-white text-left overflow-y-auto'>
      <h3 className='mb-2'>{dayjs(date).format('M월 D일')}</h3>
      {events.length === 0 ? (
        <div className='flex flex-1 items-center justify-center h-full text-muted-foreground font-bold'>
          스터디 일정이 없습니다.
        </div>
      ) : (
        <div className='flex flex-col px-2 gap-4 w-full'>
          {events.map((event) => (
            <ScheduleManageCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ScheduleManageSection;
