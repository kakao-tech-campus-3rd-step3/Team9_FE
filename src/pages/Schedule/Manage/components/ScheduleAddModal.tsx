type ScheduleAddModalProps = {
  onClose: () => void;
};

const ScheduleAddModal = ({ onClose }: ScheduleAddModalProps) => {
  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col p-6'>
        <h2 className='text-lg font-bold mb-4'>일정 추가</h2>
        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded bg-gray-200 text-sm font-medium'
          >
            닫기
          </button>
          <button className='px-4 py-2 rounded bg-primary text-white text-sm font-medium'>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAddModal;
