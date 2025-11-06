import { Suspense } from 'react';
import { useCurrentStudy } from '@/hooks/study/useCurrentStudy';
import { useParams } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';
import ProfileSkeleton from '@/components/common/ProfileSkeleton';
import UserProfileSection from '@/components/user/UserProfileSection';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import { AxiosError } from 'axios';

/**
 * 스터디 정보 영역 컴포넌트
 */
const StudyInfoSection = ({ studyId }: { studyId: number }) => {
  const { data: currentStudy, loading, error } = useCurrentStudy(studyId);

  const containerClass =
    'w-full p-4 flex items-center gap-3 min-w-0 border-y border-border bg-secondary/80';
  const iconClass =
    'w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0';

  // 로딩 중
  if (loading) {
    return (
      <div className={containerClass}>
        <div className={iconClass}>
          <Users className='w-4 h-4' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-xs font-medium text-muted-foreground'>
            현재 스터디
          </div>
          <div className='h-5 bg-muted-foreground/30 rounded w-3/4 animate-pulse' />
        </div>
      </div>
    );
  }

  // 403 에러 처리
  if (error && error instanceof AxiosError && error.response?.status === 403) {
    return (
      <div className='w-full p-4 flex items-center gap-3 min-w-0 border-y border-border bg-destructive/10'>
        <div className='w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive flex-shrink-0'>
          <AlertCircle className='w-4 h-4' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='text-xs font-medium text-destructive'>
            접근 권한 없음
          </div>
          <div className='text-sm text-destructive/80 truncate leading-tight'>
            스터디에 접근할 수 없습니다
          </div>
        </div>
      </div>
    );
  }

  // 기타 에러는 표시하지 않음
  if (error || !currentStudy) {
    return null;
  }

  // 정상 데이터 표시
  return (
    <div className={containerClass}>
      <div className={iconClass}>
        <Users className='w-4 h-4' />
      </div>
      <div className='min-w-0 flex-1'>
        <div className='text-xs font-medium text-muted-foreground'>
          현재 스터디
        </div>
        <div className='text-md font-bold text-primary truncate leading-tight'>
          {currentStudy.title}
        </div>
      </div>
    </div>
  );
};

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
        {isValidStudyId && <StudyInfoSection studyId={studyId} />}
        <SidebarNav />
      </div>
      {/* 프로필 섹션: 사이드바에서만 프레임(배경/경계) 노출, 고정 높이로 점프 방지 */}
      <div className='mt-auto border-t border-border bg-secondary/80 hover:bg-secondary/40 h-17'>
        <div className='h-full flex items-center'>
          <div className='w-full'>
            <Suspense fallback={<ProfileSkeleton variant='study-sidebar' />}>
              <UserProfileSection variant='study-sidebar' />
            </Suspense>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
