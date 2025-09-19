const ScheduleAddManage = () => {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='font-bold'>스터디 기간</div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>시작</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
          />
          <input
            type='time'
            step='600'
            className='border border-gray-300 rounded-lg p-2'
          />
        </div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>종료</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
          />
          <input
            type='time'
            step='600'
            className='border border-gray-300 rounded-lg p-2'
          />
        </div>
      </div>
    </>
  );
};

export default ScheduleAddManage;
