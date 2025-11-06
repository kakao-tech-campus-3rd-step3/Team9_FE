import { ROUTES } from '@/constants';
import { NotebookPen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type QuizCardCompletedProps = {
  quizId: number;
  score: number;
  quizCount: number;
  submissionId: number | null;
};

const QuizCardCompleted = ({
  score,
  quizCount,
  submissionId,
}: QuizCardCompletedProps) => {
  const navigate = useNavigate();
  const gotoExplain = () => {
    if (submissionId == null) return;
    navigate(
      ROUTES.STUDY.QUIZ.EXPLAIN.replace(
        ':submission_id',
        submissionId.toString(),
      ),
    );
  };

  return (
    <div className='flex gap-4'>
      <div className='flex gap-2 px-4 py-5 border border-primary rounded-lg'>
        <p className='text-inherit font-medium'>
          {score} / {quizCount}
        </p>
      </div>
      <div
        className='flex gap-2 px-4 py-5 border border-primary rounded-lg cursor-pointer hover:text-primary'
        onClick={gotoExplain}
      >
        <NotebookPen size={24} />
        <p className='text-inherit font-medium'>해설 보기</p>
      </div>
    </div>
  );
};

export default QuizCardCompleted;
