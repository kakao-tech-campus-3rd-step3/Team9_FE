import { CircleX, RefreshCcw } from 'lucide-react';

type QuizCardFailedProps = {
  title: string;
};

const QuizCardFailed = ({ title }: QuizCardFailedProps) => {
  return (
    <div className='w-full p-4'>
      <div className='flex justify-between px-6 py-4 border border-destructive rounded-lg  gap-3 bg-white  min-h-[134px]'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl text-destructive font-bold'>{title}</h3>
            <p className='text-lg text-destructive'>
              퀴즈 생성에 실패했습니다.
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex gap-2 px-4 py-5 border border-yellow-400 rounded-lg hover:text-yellow-400 cursor-pointer'>
            <RefreshCcw size={24} />
            <p className='text-inherit font-medium'>재시도</p>
          </div>
          <div className='flex gap-2 px-4 py-5 border border-destructive rounded-lg cursor-pointer hover:text-destructive'>
            <CircleX size={24} />
            <p className='text-inherit font-medium'>삭제</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizCardFailed;
