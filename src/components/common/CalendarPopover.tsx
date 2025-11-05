import { studyColor } from '@/utils';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

type Popover = {
  top: number;
  left: number;
  date: string | null;
};

type CalendarPopoverProps = {
  schedules: {
    schedule_id: number;
    study_id: number;
    title: string;
    start_time: string;
    end_time: string;
  }[];
  popover: Popover | null;
  setPopover: (popover: Popover | null) => void;
};

const CalendarPopover = ({
  schedules,
  popover,
  setPopover,
}: CalendarPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setPopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setPopover]);

  if (!popover) return null;

  return (
    <div
      ref={popoverRef}
      className='absolute bg-white shadow-lg rounded-lg p-4 z-50'
      style={{
        top: popover.top + 20,
        left: popover.left + 16,
        minWidth: 220,
      }}
    >
      <div className='flex mb-2 justify-between items-center'>
        <h2 className='text-base font-semibold'>
          {dayjs(popover.date).format('MM월 DD일')} 일정
        </h2>
        <button onClick={() => setPopover(null)} className='cursor-pointer'>
          <X />
        </button>
      </div>
      <ul className='space-y-1 px-2 py-1 text-sm text-left'>
        {schedules
          .filter((schedule) =>
            dayjs(schedule.start_time).isSame(dayjs(popover.date), 'day'),
          )
          .map((schedule) => (
            <li
              key={schedule.schedule_id}
              className='p-1 rounded-lg text-white'
              style={{
                backgroundColor: studyColor(schedule.study_id),
              }}
            >
              {schedule.title}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CalendarPopover;
