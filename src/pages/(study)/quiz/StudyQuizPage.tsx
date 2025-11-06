import { Outlet, useMatch, useParams } from 'react-router-dom';
import { ROUTES, ROUTE_PARAMS } from '@/constants';
import { QuizCard } from './components';
import { useQuizList } from './hooks/useQuizList';

const StudyQuizPage = () => {
  const { study_id } = useParams<{ study_id: string }>();
  const { data: quizzes } = useQuizList({
    study_id: Number(study_id),
  });
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
        {quizzes.content.length > 0 ? (
          quizzes.content.map((quiz) => (
            <QuizCard
              key={quiz.quiz_id}
              quizId={quiz.quiz_id}
              title={quiz.title}
              timeLimit={quiz.time_limit_seconds}
              quiz_status={quiz.quiz_status}
              submissionStatus={quiz.submission_status}
              score={quiz.score}
              quizCount={quiz.question_count}
              submissionId={quiz.submission_id}
            />
          ))
        ) : (
          <p className='mt-8'>등록된 퀴즈가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default StudyQuizPage;
