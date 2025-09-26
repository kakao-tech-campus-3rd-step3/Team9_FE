import { Logo } from '@/components/common';
import { Users } from 'lucide-react';

interface SidebarHeaderProps {
  studyName: string;
  studyImageUrl?: string;
}

/**
 * 사이드바 상단 헤더 컴포넌트
 * 로고와 현재 스터디 정보를 표시합니다.
 */
function SidebarHeader({ studyName, studyImageUrl }: SidebarHeaderProps) {
  return (
    <div className='border-b border-border flex flex-col items-start bg-background'>
      <div className='w-full p-4 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
        <div className='flex items-center'>
          <Logo size='md' />
        </div>
      </div>
      <div className='w-full p-4 flex items-center gap-3 min-w-0 border-t border-border bg-secondary/80'>
        {studyImageUrl ? (
          <img
            src={studyImageUrl}
            alt='study'
            className='w-8 h-8 rounded-full object-cover border-2 border-primary/20 flex-shrink-0'
          />
        ) : (
          <div className='w-8 h-8 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center text-primary flex-shrink-0'>
            <Users className='w-4 h-4' />
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <div className='text-xs font-medium text-muted-foreground'>
            현재 스터디
          </div>
          <div className='text-md font-bold text-primary truncate'>
            {studyName}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarHeader;
