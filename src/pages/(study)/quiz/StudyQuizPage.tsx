import { Outlet, useMatch } from 'react-router-dom';
import { ROUTES, ROUTE_PARAMS } from '@/constants';
import { QuizCard } from './components';
import { quizzes } from './mock/quizzes';

const StudyQuizPage = () => {
  // 현재 경로가 스터디 내부의 퀴즈 루트(`/study/:study_id/quiz`)인지 확인
  const isQuizRoot = useMatch(
    `/${ROUTES.STUDY.ROOT}/:${ROUTE_PARAMS.studyId}/${ROUTES.STUDY.QUIZ.ROOT}`,
  );

  if (!isQuizRoot) {
    return <Outlet />;
  }

  return (
    <div className='h-full flex flex-col bg-background'>
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background'>
        <h1 className='text-2xl font-bold text-primary'>퀴즈</h1>
      </div>{' '}
      <div className='flex flex-col items-center w-full p-4 overflow-y-auto'>
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz.quizId}
            quizId={quiz.quizId}
            title={quiz.title}
            description={quiz.description}
            timeLimit={quiz.timeLimit}
            status={quiz.status}
            score={quiz.score}
            quizCount={quiz.quizCount}
          />
        ))}
      </div>
    </div>
  );
};

export default StudyQuizPage;
