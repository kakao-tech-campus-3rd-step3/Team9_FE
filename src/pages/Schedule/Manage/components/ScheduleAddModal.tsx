import { X } from 'lucide-react';
import ScheduleAddTitle from './ScheduleAddTitle';
import { useState } from 'react';
import ScheduleAddManage from './ScheduleAddManage';
import ScheduleAddTune from './ScheduleAddTune';

type ScheduleAddModalProps = {
  onClose: () => void;
};

const ScheduleAddModal = ({ onClose }: ScheduleAddModalProps) => {
  const [isOn, setIsOn] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 max-h-[80vh] flex flex-col p-6'>
        <h2 className='text-lg font-bold text-center mb-4'>신규 일정</h2>
        <button
          onClick={onClose}
          type='button'
          className='absolute top-4 right-4'
        >
          <X />
        </button>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <ScheduleAddTitle />
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-between'>
              <div className='font-bold'>일정 조율하기</div>
              <button
                type='button'
                onClick={() => setIsOn(!isOn)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
                  isOn ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                    isOn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p>스터디 일정을 스터디원들과 함께 조율합니다. </p>
          </div>
          {isOn ? <ScheduleAddTune /> : <ScheduleAddManage />}
          <div className='flex justify-end gap-2'>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-primary text-white text-sm font-medium'
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleAddModal;
