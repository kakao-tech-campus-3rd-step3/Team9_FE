import { Outlet, useMatch } from 'react-router-dom';
import { QuizCard } from './components';
import { quizzes } from './mock/quizzes';

const StudyQuizPage = () => {
  if (!useMatch('/study/quiz')) {
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
