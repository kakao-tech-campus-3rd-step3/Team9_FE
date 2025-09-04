import { mockStudy, mockUser } from '@/pages/(study)/mock/sidebarData';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarProfile from './SidebarProfile';

/**
 * 스터디 페이지 사이드바 컴포넌트
 * 헤더, 네비게이션, 프로필을 포함한 전체 사이드바 레이아웃을 구성합니다.
 */
function Sidebar() {
  return (
    <aside className='w-64 bg-card border-r-2 border-border-primary relative z-20 flex flex-col min-h-full shadow-xl/40'>
      <SidebarHeader
        studyName={mockStudy.studyName}
        studyImageUrl={mockStudy.studyImageUrl}
      />
      <SidebarNav />
      <SidebarProfile
        userName={mockUser.userName}
        userImageUrl={mockUser.userImageUrl}
      />
    </aside>
  );
}

export default Sidebar;
