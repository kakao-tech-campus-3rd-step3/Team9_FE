import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useScheduleDelete } from '../hooks/useScheduleDelete';
import { X } from 'lucide-react';
import { useAuthStore } from '@/stores';

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
  const { study_id } = useParams<{ study_id: string }>();
  const user = useAuthStore((s) => s.user);
  const [attend, setAttend] = useState(false);
  const { mutate: deleteSchedule } = useScheduleDelete({
    study_id: Number(study_id),
  });

  return (
    <div className='flex flex-col bg-blue-100 rounded-xl p-4'>
      <div className='flex justify-between items-center mb-2'>
        <h4 className='flex items-center gap-2'>
          <div
            className='w-5 h-5 rounded-full'
            style={{ backgroundColor: event.color }}
          />
          <div className='flex-1'>{event.title}</div>
        </h4>
        {user.currentStudy?.role === 'LEADER' && (
          <div>
            <X onClick={() => deleteSchedule({ schedule_id: event.id })} />
          </div>
        )}
      </div>
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
