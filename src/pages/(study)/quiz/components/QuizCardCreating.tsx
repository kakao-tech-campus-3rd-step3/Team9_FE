import { quizKeys } from '@/constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCcw } from 'lucide-react';
import { useParams } from 'react-router-dom';

type QuizCardCreatingProps = {
  title: string;
};

const QuizCardCreating = ({ title }: QuizCardCreatingProps) => {
  const { study_id } = useParams<{ study_id: string }>();
  const queryClient = useQueryClient();

  return (
    <div className='w-full p-4'>
      <div className='flex justify-between px-6 py-4 border border-primary rounded-lg  gap-3 bg-white'>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl text-primary font-bold'>{title}</h3>
            <p className='text-lg'>퀴즈 생성 중...</p>
          </div>
        </div>
        <div className='flex items-center'>
          <button
            className='flex gap-2 px-4 py-5 border border-yellow-400 rounded-lg cursor-pointer hover:text-yellow-400'
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: quizKeys.list(Number(study_id)),
                exact: false,
              });
            }}
          >
            <RefreshCcw size={24} />
            <p className='text-inherit font-medium'>다시 불러오기</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCardCreating;
