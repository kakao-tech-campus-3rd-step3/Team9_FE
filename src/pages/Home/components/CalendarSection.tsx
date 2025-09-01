import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import dayjs from 'dayjs';

type CalendarSectionProps = {
  schedules: {
    title: string;
    start_time: string;
    end_time: string;
    color: string;
  }[];
};

const CalendarSection = ({ schedules }: CalendarSectionProps) => {
  return (
    <section className='flex-3 h-full w-full max-w-3xl border-2 border-primary rounded-2xl p-4 bg-white'>
      <FullCalendar
        plugins={[dayGridPlugin]}
        height='auto'
        titleFormat={(date) => {
          const year = date.date.year;
          const month = date.date.month + 1;
          return `${year}년 ${month}월`;
        }}
        initialView='dayGridMonth'
        dayMaxEventRows={2}
        events={schedules.map((schedule) => ({
          title: schedule.title,
          date: dayjs(schedule.start_time).format('YYYY-MM-DD'),
          backgroundColor: schedule.color,
          borderColor: schedule.color,
        }))}
      />
    </section>
  );
};

export default CalendarSection;
