import { ROUTES } from '@/constants';
import { CircleX, NotebookPen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizDelete } from '../hooks/useQuizDelete';

type QuizCardCompletedProps = {
  quizId: number;
  score: number;
  quizCount: number;
  submissionId: number | null;
};

const QuizCardCompleted = ({
  quizId,
  score,
  quizCount,
  submissionId,
}: QuizCardCompletedProps) => {
  const study_id = useParams<{ study_id: string }>().study_id;
  const { mutate: deleteQuiz } = useQuizDelete({ study_id: Number(study_id) });
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
      <button
        className='flex gap-2 px-4 py-5 border border-destructive rounded-lg cursor-pointer hover:text-destructive'
        onClick={() => deleteQuiz({ quiz_id: Number(quizId) })}
      >
        <CircleX size={24} />
        <p className='text-inherit font-medium'>삭제</p>
      </button>
    </div>
  );
};

export default QuizCardCompleted;
