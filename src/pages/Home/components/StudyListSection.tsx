import { ErrorBoundary, LoadingSpinner } from '@/components';
import { useStudyMeQuery } from '../hooks/useStudyMeQuery';
import StudyList from './StudyList';
import StudyNothing from './StudyNothing';
import { Suspense, useState } from 'react';

const StudyListSection = () => {
  const { data: studies = [] } = useStudyMeQuery();
  const [page, setPage] = useState(0);
  const pageSize = 3;

  const totalPages = Math.ceil(studies.length / pageSize);
  const pagedStudies = studies.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <ErrorBoundary>
      <section className='flex flex-col w-full max-w-7xl gap-2'>
        <h3 className='text-left font-bold mb-1'>나의 스터디</h3>
        <Suspense fallback={<LoadingSpinner message='스터디 불러오는 중...' />}>
          {studies.length > 0 ? (
            <StudyList
              studies={pagedStudies}
              canLeft={page > 0}
              onLeft={() => setPage(page - 1)}
              canRight={page < totalPages - 1}
              onRight={() => setPage(page + 1)}
            />
          ) : (
            <StudyNothing />
          )}
        </Suspense>
      </section>
    </ErrorBoundary>
  );
};

export default StudyListSection;
