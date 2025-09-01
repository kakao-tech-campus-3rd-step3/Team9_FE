import dayjs from 'dayjs';

type ScheduleItemProps = {
  title: string;
  date: string;
  color: string;
};

const ScheduleItem = ({ title, date, color }: ScheduleItemProps) => {
  return (
    <div className='flex text-center text-lg gap-6 px-4 py-2 items-center bg-blue-200 rounded-lg'>
      <div className='w-9 text-left'>{dayjs(date).date()}일</div>
      <div
        className='w-5 h-5 rounded-full inline-block'
        style={{ backgroundColor: color }}
      />
      <div className='font-medium'>{title}</div>
    </div>
  );
};

export default ScheduleItem;
