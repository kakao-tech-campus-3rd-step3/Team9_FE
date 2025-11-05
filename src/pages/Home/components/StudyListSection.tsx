import { ErrorBoundary, LoadingSpinner } from '@/components';
import { useStudyMeQuery } from '../hooks/useStudyMeQuery';
import StudyList from './StudyList';
import StudyNothing from './StudyNothing';
import { Suspense, useState } from 'react';

// 로딩 상태를 표시하는 컴포넌트
const LoadingSection = () => {
  return (
    <div className='w-fit flex gap-6 bg-blue-100 border-2 border-primary rounded-lg px-6 py-4 items-center'>
      <div className='w-11 h-11 flex justify-center items-center'>
        <LoadingSpinner />
      </div>
    </div>
  );
};

// 데이터 로딩 및 렌더링을 담당하는 새 컴포넌트
const MyStudies = () => {
  const { data: studies } = useStudyMeQuery();
  const [page, setPage] = useState(0);
  const pageSize = 3;

  const totalPages = Math.ceil(studies.length / pageSize);
  const pagedStudies = studies.slice(page * pageSize, (page + 1) * pageSize);

  return studies.length > 0 ? (
    <StudyList
      studies={pagedStudies}
      canLeft={page > 0}
      onLeft={() => setPage(page - 1)}
      canRight={page < totalPages - 1}
      onRight={() => setPage(page + 1)}
    />
  ) : (
    <StudyNothing />
  );
};

const StudyListSection = () => {
  return (
    <ErrorBoundary>
      <section className='flex flex-col w-full max-w-7xl gap-2'>
        <h3 className='text-left font-bold mb-1'>나의 스터디</h3>
        <Suspense fallback={<LoadingSection />}>
          <MyStudies />
        </Suspense>
      </section>
    </ErrorBoundary>
  );
};

export default StudyListSection;
