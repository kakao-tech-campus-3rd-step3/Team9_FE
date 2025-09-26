import { PenTool } from 'lucide-react';

const QuizCardReady = () => {
  return (
    <div className='flex gap-2 px-4 py-5 border border-primary rounded-lg cursor-pointer hover:text-primary'>
      <PenTool size={24} />
      <p className='text-inherit font-medium'>퀴즈 풀기</p>
    </div>
  );
};

export default QuizCardReady;
