import { Outlet } from 'react-router-dom';
import { ScheduleTab } from './components';

const SchedulePage = () => {
  return (
    <div className='flex-1 flex flex-col overflow-y-auto'>
      <h1 className='p-4 mt-3 font-bold'>일정 관리</h1>
      <ScheduleTab />
      <Outlet />
    </div>
  );
};

export default SchedulePage;
