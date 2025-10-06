import { Suspense } from 'react';
import { useCurrentStudy } from '@/hooks/study/useCurrentStudy';
import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { UserProfileSection } from '@/components/user';
import { ProfileSkeleton } from '@/components/common';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';

/**
 * 스터디 정보 영역 컴포넌트 (Suspense와 함께 사용)
 */
const StudyInfoSection = ({ studyId }: { studyId: number }) => {
  const { data: currentStudy } = useCurrentStudy(studyId);

  return (
    <div className='w-full p-4 flex items-center gap-3 min-w-0 border-t border-border bg-secondary/80'>
      <div className='w-8 h-8 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary flex-shrink-0'>
        <Users className='w-4 h-4' />
      </div>
      <div className='min-w-0 flex-1'>
        <div className='text-xs font-medium text-muted-foreground'>
          현재 스터디
        </div>
        <div className='text-md font-bold text-primary truncate'>
          {currentStudy?.title}
        </div>
      </div>
    </div>
  );
};

/**
 * 스터디 정보 스켈레톤 (크기 고정, 타이틀만 펄스)
 */
const StudyInfoSkeletonEnhanced = () => (
  <div className='w-full p-4 flex items-center gap-3 min-w-0 border-t border-border bg-secondary/80'>
    <div className='w-8 h-8 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary flex-shrink-0'>
      <Users className='w-4 h-4' />
    </div>
    <div className='min-w-0 flex-1'>
      <div className='text-xs font-medium text-muted-foreground'>
        현재 스터디
      </div>
      <div className='h-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-md animate-pulse w-3/4'>
        <div className='h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse' />
      </div>
    </div>
  </div>
);

/**
 * 스터디 페이지 사이드바 컴포넌트
 * 헤더, 네비게이션, 프로필을 포함한 전체 사이드바 레이아웃을 구성합니다.
 */
function Sidebar() {
  const { study_id } = useParams<{ study_id: string }>();
  const studyId = Number(study_id);
  const isValidStudyId = typeof studyId === 'number' && !isNaN(studyId);

  return (
    <aside className='w-full bg-background border-r-2 border-border-primary relative z-20 flex flex-col h-full shadow-xl/40 overflow-x-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <SidebarHeader />
        {isValidStudyId && (
          <Suspense fallback={<StudyInfoSkeletonEnhanced />}>
            <StudyInfoSection studyId={studyId} />
          </Suspense>
        )}
        <SidebarNav />
      </div>
      <div className='mt-auto'>
        <Suspense
          fallback={
            <ProfileSkeleton
              variant='study-sidebar'
              showRole={isValidStudyId}
            />
          }
        >
          <UserProfileSection variant='study-sidebar' />
        </Suspense>
      </div>
    </aside>
  );
}

export default Sidebar;
