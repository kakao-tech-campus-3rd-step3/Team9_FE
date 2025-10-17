import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import '@/styles/calendar.css';
import dayjs from 'dayjs';
import { useState } from 'react';
import { CalendarPopover } from '@/components';
import { studyColor } from '@/utils';

type Schedule = {
  schedule_id: number;
  title: string;
  start_time: string;
  end_time: string;
};

type StudyCalendarSectionProps = {
  studyId: number;
  schedules: Schedule[];
  date: string;
  setDate: (date: string) => void;
};

const StudyCalendarSection = ({
  studyId,
  schedules,
  date,
  setDate,
}: StudyCalendarSectionProps) => {
  const [popover, setPopover] = useState<{
    top: number;
    left: number;
    date: string | null;
  } | null>(null);

  const handleDateClick = (info: { jsEvent: MouseEvent; dateStr: string }) => {
    setDate(info.dateStr);
  };

  const handleEventClick = (info: {
    jsEvent: MouseEvent;
    event: { start: Date | null; end: Date | null };
  }) => {
    setDate(dayjs(info.event.start).format('YYYY-MM-DD'));
    const hasSchedules = schedules.some(
      (schedule) =>
        dayjs(schedule.start_time).format('YYYY-MM-DD') ===
        dayjs(info.event.start).format('YYYY-MM-DD'),
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
        date: dayjs(info.event.start).format('YYYY-MM-DD'),
      });
    }
  };

  return (
    <section className='relative flex-5 border-2 border-primary rounded-xl p-4 bg-white h-full w-full'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        height='550px'
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
        events={schedules.map((schedule) => ({
          title: schedule.title,
          date: schedule.start_time,
          backgroundColor: studyColor(studyId),
          borderColor: studyColor(studyId),
        }))}
        dateClick={handleDateClick}
        eventClick={(info) => handleEventClick(info)}
        dayMaxEventRows={2}
        moreLinkContent={(arg) => `+${arg.num}개 일정`}
        eventDisplay='block'
        eventClassNames='rounded-lg shadow-sm cursor-pointer'
        buttonText={{
          prev: '◀',
          next: '▶',
        }}
        dayCellClassNames={(arg) => {
          return dayjs(arg.date).format('YYYY-MM-DD') === date
            ? ['selected-date']
            : [];
        }}
        moreLinkClick={(arg) => {
          handleEventClick({
            jsEvent: arg.jsEvent as MouseEvent,
            event: {
              start: dayjs(arg.date).startOf('day').toDate(),
              end: dayjs(arg.date).endOf('day').toDate(),
            },
          });
          return arg.view.type;
        }}
      />

      <CalendarPopover
        schedules={schedules.map((schedule) => ({
          schedule_id: schedule.schedule_id,
          title: schedule.title,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          study_id: studyId,
        }))}
        popover={popover}
        setPopover={setPopover}
      />
    </section>
  );
};

export default StudyCalendarSection;
