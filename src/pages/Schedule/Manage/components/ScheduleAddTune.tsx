const ScheduleAddTune = () => {
  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='font-bold'>일정 조율 기간</div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>시작</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
          />
        </div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>종료</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
          />
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='font-bold'>가능한 시간대</div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>시작</label>
          <input
            type='time'
            step='3600'
            className='border border-gray-300 rounded-lg p-2'
          />
        </div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>종료</label>
          <input
            type='time'
            step='3600'
            className='border border-gray-300 rounded-lg p-2'
          />
        </div>
      </div>
    </>
  );
};

export default ScheduleAddTune;
