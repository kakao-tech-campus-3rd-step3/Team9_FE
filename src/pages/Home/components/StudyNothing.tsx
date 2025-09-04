import { ArrowRight } from 'lucide-react';

const StudyNothing = () => {
  return (
    <div className='flex gap-2 bg-blue-100 border-2 border-primary rounded-lg border-dashed p-4 items-center justify-between max-w-4xl'>
      <div className='text-gray-500 font-bold text-xl'>스터디가 없습니다.</div>
      <div className='flex items-center bg-primary rounded-xl px-4 py-2'>
        <p className='text-base font-medium text-white'>스터디 찾으러 가기</p>
        <ArrowRight size={24} color='white' />
      </div>
    </div>
  );
};

export default StudyNothing;
