import { ChevronLeft, ChevronRight } from 'lucide-react';

type StudyListProps = {
  studies: { title: string; color: string }[];
  canLeft: boolean;
  onLeft: () => void;
  canRight: boolean;
  onRight: () => void;
};

const StudyList = ({
  studies,
  canLeft,
  onLeft,
  canRight,
  onRight,
}: StudyListProps) => {
  return (
    <div className='w-fit flex gap-6 bg-blue-100 border-2 border-primary rounded-lg px-6 py-4 items-center'>
      {canLeft && (
        <button onClick={onLeft} className='text-lg font-medium'>
          <ChevronLeft />
        </button>
      )}
      {studies.map((study, index) => (
        <div
          key={index}
          className='flex text-center text-lg gap-6 pl-4 pr-8 py-2 items-center bg-blue-200 rounded-xl'
        >
          <div
            className='w-5 h-5 rounded-full inline-block'
            style={{ backgroundColor: study.color }}
          />
          <div className='font-medium'>{study.title}</div>
        </div>
      ))}
      {canRight && (
        <button onClick={onRight} className='text-lg font-medium'>
          <ChevronRight />
        </button>
      )}
    </div>
  );
};

export default StudyList;
