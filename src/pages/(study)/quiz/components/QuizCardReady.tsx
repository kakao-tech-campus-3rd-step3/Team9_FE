import { ROUTES } from '@/constants';
import { CircleX, PenTool } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizDelete } from '../hooks/useQuizDelete';

type QuizCardReadyProps = {
  quizId: string;
};

const QuizCardReady = ({ quizId }: QuizCardReadyProps) => {
  const study_id = useParams<{ study_id: string }>().study_id;
  const { mutate: deleteQuiz } = useQuizDelete({ study_id: Number(study_id) });
  const navigate = useNavigate();
  const gotoSolve = () => {
    navigate(ROUTES.STUDY.QUIZ.SOLVE.replace(':id', quizId));
  };

  return (
    <div className='flex gap-4 items-center'>
      <button
        className='flex gap-2 px-4 py-5 border border-primary rounded-lg cursor-pointer hover:text-primary'
        onClick={() => gotoSolve()}
      >
        <PenTool size={24} />
        <p className='text-inherit font-medium'>퀴즈 풀기</p>
      </button>
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

export default QuizCardReady;
