import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StudyMe } from '../types/study';
import { studyColor } from '@/utils';

type StudyListProps = {
  studies: StudyMe[];
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
      {studies.map((study) => (
        <div
          key={study.study_id}
          className='flex text-center text-lg gap-4 px-4 py-2 items-center bg-blue-200 rounded-xl'
        >
          <div
            className='min-w-5 min-h-5 rounded-full inline-block'
            style={{ backgroundColor: studyColor(study.study_id) }}
          />
          <div className='font-medium line-clamp-1'>{study.title}</div>
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
