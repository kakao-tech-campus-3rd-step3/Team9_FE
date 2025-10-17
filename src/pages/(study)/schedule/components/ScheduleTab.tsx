import { ROUTES } from '@/constants';
import { useLocation } from 'react-router-dom';
import TabItem from './TabItem';

const ScheduleTab = () => {
  const location = useLocation();
  return (
    <nav className='flex px-4 gap-2 border-b border-border'>
      <TabItem
        title='스터디 일정'
        to={ROUTES.SCHEDULE.MANAGE}
        selected={location.pathname.endsWith(ROUTES.SCHEDULE.MANAGE)}
      />
      <TabItem
        title='조율중인 일정'
        to={ROUTES.SCHEDULE.TUNE}
        selected={location.pathname.endsWith(ROUTES.SCHEDULE.TUNE)}
      />
    </nav>
  );
};

export default ScheduleTab;
