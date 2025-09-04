import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import '@/styles/calendar.css';
import { CalendarPopover } from '@/components';

type CalendarSectionProps = {
  schedules: {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    color: string;
  }[];
};

const CalendarSection = ({ schedules }: CalendarSectionProps) => {
  const [popover, setPopover] = useState<{
    top: number;
    left: number;
    date: string | null;
  } | null>(null);

  const handleDateClick = (info: { jsEvent: MouseEvent; dateStr: string }) => {
    const hasSchedules = schedules.some(
      (schedule) =>
        dayjs(schedule.start_time).format('YYYY-MM-DD') === info.dateStr,
    );
    if (!hasSchedules) return;

    const cell = (info.jsEvent.target as HTMLElement).closest(
      '.fc-daygrid-day',
    ) as HTMLElement;

    if (cell) {
      const rect = cell.getBoundingClientRect();
      const container = cell.offsetParent as HTMLElement;
      const containerRect = container.getBoundingClientRect();

      setPopover({
        top: rect.bottom - containerRect.top,
        left: rect.left - containerRect.left,
        date: info.dateStr,
      });
    }
  };

  return (
    <section className='relative flex-3 h-full w-full min-h-[640px] max-w-3xl border-2 border-primary rounded-xl p-4 bg-white'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        height='auto'
        titleFormat={(date) => {
          const year = date.date.year;
          const month = date.date.month + 1;
          return `${year}년 ${month}월`;
        }}
        initialView='dayGridMonth'
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next',
        }}
        dayMaxEventRows={2}
        dateClick={handleDateClick}
        dayCellClassNames={(arg) => {
          const hasSchedules = schedules.some(
            (schedule) =>
              dayjs(schedule.start_time).format('YYYY-MM-DD') ===
              dayjs(arg.date).format('YYYY-MM-DD'),
          );
          return hasSchedules ? 'cursor-pointer' : '';
        }}
        eventClick={(arg) => {
          handleDateClick({
            jsEvent: arg.jsEvent as MouseEvent,
            dateStr: dayjs(arg.event.start!).format('YYYY-MM-DD'),
          });
        }}
        moreLinkClick={(arg) => {
          handleDateClick({
            jsEvent: arg.jsEvent as MouseEvent,
            dateStr: dayjs(arg.date).format('YYYY-MM-DD'),
          });
          return arg.view.type;
        }}
        moreLinkContent={(arg) => `+${arg.num}개 일정`}
        eventDisplay='block'
        eventClassNames='rounded-lg shadow-sm cursor-pointer'
        buttonText={{
          prev: '◀',
          next: '▶',
        }}
        events={schedules.map((schedule) => ({
          title: schedule.title,
          date: dayjs(schedule.start_time).format('YYYY-MM-DD'),
          backgroundColor: schedule.color,
          borderColor: schedule.color,
        }))}
      />

      <CalendarPopover
        schedules={schedules}
        popover={popover}
        setPopover={setPopover}
      />
    </section>
  );
};

export default CalendarSection;
