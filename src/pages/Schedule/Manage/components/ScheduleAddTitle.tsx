const ScheduleAddTitle = () => {
  return (
    <>
      <input
        type='text'
        placeholder='일정 제목'
        className='border border-gray-300 rounded-lg p-2'
      />
      <textarea
        placeholder='일정 내용'
        className='border border-gray-300 rounded-lg p-2 h-24 resize-none'
      />
    </>
  );
};
export default ScheduleAddTitle;
