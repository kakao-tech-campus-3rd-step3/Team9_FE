import { NotebookPen } from 'lucide-react';

type QuizCardCompletedProps = {
  score: number;
  quizCount: number;
};

const QuizCardCompleted = ({ score, quizCount }: QuizCardCompletedProps) => {
  return (
    <div className='flex gap-4'>
      <div className='flex gap-2 px-4 py-5 border border-primary rounded-lg'>
        <p className='text-inherit font-medium'>
          {score} / {quizCount}
        </p>
      </div>
      <div className='flex gap-2 px-4 py-5 border border-primary rounded-lg cursor-pointer hover:text-primary'>
        <NotebookPen size={24} />
        <p className='text-inherit font-medium'>해설 보기</p>
      </div>
    </div>
  );
};

export default QuizCardCompleted;
