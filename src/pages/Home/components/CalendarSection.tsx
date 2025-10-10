import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';
import '@/styles/calendar.css';
import { CalendarPopover } from '@/components';
import { useScheduleMeQuery } from '../hooks/useScheduleMeQuery';
import { studyColor } from '@/utils';

type CalendarSectionProps = {
  year: number;
  setYear: (year: number) => void;
  month: number;
  setMonth: (month: number) => void;
};

const CalendarSection = ({
  year,
  setYear,
  month,
  setMonth,
}: CalendarSectionProps) => {
  const { data: scheduleData } = useScheduleMeQuery({ year, month });

  const [popover, setPopover] = useState<{
    top: number;
    left: number;
    date: string | null;
  } | null>(null);

  const handleDateClick = (info: { jsEvent: MouseEvent; dateStr: string }) => {
    const hasSchedules = scheduleData?.some(
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
    <section className='relative flex-3 h-full w-full min-h-[660px] max-w-3xl border-2 border-primary rounded-xl p-4 bg-white'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        height='auto'
        titleFormat={(date) => {
          const year = date.date.year;
          const month = date.date.month + 1;
          return `${year}년 ${month}월`;
        }}
        datesSet={(arg) => {
          const viewStart = arg.start;
          const viewEnd = arg.end;

          const midTime = (viewStart.getTime() + viewEnd.getTime()) / 2;
          const midDate = new Date(midTime);

          const newYear = midDate.getFullYear();
          const newMonth = midDate.getMonth() + 1;

          if (newYear !== year) setYear(newYear);
          if (newMonth !== month) setMonth(newMonth);
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
          const hasSchedules = scheduleData?.some(
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
        events={scheduleData?.map((schedule) => ({
          title: schedule.title,
          date: dayjs(schedule.start_time).format('YYYY-MM-DD'),
          backgroundColor: studyColor(schedule.study_id),
          borderColor: studyColor(schedule.study_id),
        }))}
      />

      <CalendarPopover
        schedules={scheduleData || []}
        popover={popover}
        setPopover={setPopover}
      />
    </section>
  );
};

export default CalendarSection;
