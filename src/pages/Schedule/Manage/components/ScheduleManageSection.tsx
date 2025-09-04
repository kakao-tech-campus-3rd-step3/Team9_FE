type ScheduleManageSectionProps = {
  event: {
    id: number;
    title: string;
    date: string;
    color: string;
  }[];
};

const ScheduleManageSection = ({ event }: ScheduleManageSectionProps) => {
  return (
    <div className='flex flex-1 text-sm text-gray-500'>
      {event.map((e) => (
        <div key={e.id} className='flex items-center'>
          <div className='flex-1'>{e.title}</div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleManageSection;
