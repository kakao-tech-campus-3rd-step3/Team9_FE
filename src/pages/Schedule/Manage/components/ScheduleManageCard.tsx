import type { Dayjs } from 'dayjs';
import { useState } from 'react';

type ScheduleManageCardProps = {
  event: {
    id: number;
    title: string;
    start_time: Dayjs;
    end_time: Dayjs;
    color: string;
  };
};

const ScheduleManageCard = ({ event }: ScheduleManageCardProps) => {
  const [attend, setAttend] = useState(false);

  return (
    <div className='flex flex-col bg-blue-100 rounded-xl p-4'>
      <h4 className='flex items-center gap-2'>
        <div
          className='w-5 h-5 rounded-full'
          style={{ backgroundColor: event.color }}
        />
        <div className='flex-1'>{event.title}</div>
      </h4>
      <div className='flex '>
        {`${event.start_time.format('M월 D일 HH:mm')} - ${event.end_time.format('M월 D일 HH:mm')}`}
      </div>
      <div className='flex justify-end mt-2'>
        <button
          type='button'
          className={`text-white px-4 py-2 rounded-lg cursor-pointer transition ${attend ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={() => setAttend(!attend)}
        >
          {attend ? '참여' : '불참'}
        </button>
      </div>
    </div>
  );
};

export default ScheduleManageCard;
