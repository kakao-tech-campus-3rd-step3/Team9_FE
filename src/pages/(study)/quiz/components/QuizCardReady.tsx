import { ROUTES } from '@/constants';
import { PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type QuizCardReadyProps = {
  quizId: string;
};

const QuizCardReady = ({ quizId }: QuizCardReadyProps) => {
  const navigate = useNavigate();
  const gotoSolve = () => {
    navigate(ROUTES.STUDY.QUIZ.SOLVE.replace(':id', quizId));
  };

  return (
    <div
      className='flex gap-2 px-4 py-5 border border-primary rounded-lg cursor-pointer hover:text-primary'
      onClick={() => gotoSolve()}
    >
      <PenTool size={24} />
      <p className='text-inherit font-medium'>퀴즈 풀기</p>
    </div>
  );
};

export default QuizCardReady;
