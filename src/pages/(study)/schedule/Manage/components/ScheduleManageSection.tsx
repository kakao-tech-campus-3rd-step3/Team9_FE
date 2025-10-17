import type { Dayjs } from 'dayjs';
import ScheduleManageCard from './ScheduleManageCard';
import dayjs from 'dayjs';
import ScheduleAddModal from './ScheduleAddModal';
import { useState } from 'react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className='flex-3 flex flex-col w-full h-[586px] border-2 border-primary rounded-xl p-6 gap-3 bg-white text-left overflow-y-auto'>
      <div className='flex items-center justify-between'>
        <h3>{dayjs(date).format('M월 D일')}</h3>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium'
        >
          일정 추가
        </button>
      </div>
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

      {isModalOpen && (
        <ScheduleAddModal onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  );
};

export default ScheduleManageSection;
