import { mockStudy } from '@/pages/(study)/mock/sidebarData';
import { UserProfileSection } from '@/components/user';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';

/**
 * 스터디 페이지 사이드바 컴포넌트
 * 헤더, 네비게이션, 프로필을 포함한 전체 사이드바 레이아웃을 구성합니다.
 */
function Sidebar() {
  return (
    <aside className='w-full bg-background border-r-2 border-border-primary relative z-20 flex flex-col h-full shadow-xl/40 overflow-x-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <SidebarHeader
          studyName={mockStudy.studyName}
          studyImageUrl={mockStudy.studyImageUrl}
        />
        <SidebarNav />
      </div>
      <div className='mt-auto'>
        <UserProfileSection variant='study-sidebar' />
      </div>
    </aside>
  );
}

export default Sidebar;
