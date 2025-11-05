import { Bell, AlertCircle, Calendar, User } from 'lucide-react';
import dayjs from 'dayjs';
import { SectionCard, DashboardEmpty, SkeletonBlock } from './common';
import type { Notice } from '../types';

interface NoticeSectionProps {
  notices: Notice[];
  onClick: () => void;
  isLoading?: boolean;
  isError?: boolean;
  onItemClick?: (noticeId: number) => void;
}

const NoticeSection = ({
  notices,
  onClick,
  isLoading,
  isError,
  onItemClick,
}: NoticeSectionProps) => {
  if (isLoading) {
    return (
      <SectionCard
        icon={Bell}
        title='공지사항'
        onClick={onClick}
        borderColor='border-primary'
      >
        <SkeletonBlock minHeightClass='min-h-[136px]' />
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <SectionCard
        icon={Bell}
        title='공지사항'
        onClick={onClick}
        borderColor='border-destructive'
      >
        <div className='text-center py-8'>
          <p className='text-destructive font-medium'>
            공지사항을 불러오지 못했어요.
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </SectionCard>
    );
  }
  const latestNotice = notices[0]; // 가장 최신 공지사항만
  const isRecent = (() => {
    if (!latestNotice) return false;
    const created = dayjs(latestNotice.createdAt);
    return dayjs().diff(created, 'day') <= 3;
  })();

  if (!latestNotice) {
    return (
      <SectionCard
        icon={Bell}
        title='공지사항'
        onClick={onClick}
        borderColor='border-primary'
      >
        <DashboardEmpty
          icon={Bell}
          title='공지 없음'
          description='등록된 공지사항이 없습니다'
          minHeightClass='min-h-[136px]'
          iconClassName='text-primary'
          iconWrapperClassName='bg-primary/20'
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      icon={Bell}
      title='공지사항'
      onClick={onClick}
      borderColor='border-primary'
    >
      <div
        className='p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/15 transition-colors'
        onClick={(e) => {
          e.stopPropagation();
          if (onItemClick) onItemClick(latestNotice.id);
        }}
      >
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-2'>
            {latestNotice.isImportant && (
              <div className='flex items-center gap-1'>
                <AlertCircle className='w-4 h-4 text-destructive' />
                <span className='text-sm font-medium text-destructive'>
                  중요
                </span>
              </div>
            )}
            {isRecent && (
              <span className='px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30'>
                새 공지
              </span>
            )}
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Calendar className='w-3 h-3' />
            <span>
              {dayjs(latestNotice.createdAt).format('YYYY.MM.DD HH:mm')}
            </span>
          </div>
        </div>

        <div className='mb-2 flex items-center gap-2'>
          <h4 className='font-semibold text-foreground text-lg line-clamp-2'>
            {latestNotice.title}
          </h4>
        </div>

        {latestNotice.content && (
          <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
            {latestNotice.content}
          </p>
        )}

        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <User className='w-3 h-3' />
          <span className='font-medium'>{latestNotice.author}</span>
        </div>
      </div>
    </SectionCard>
  );
};

export default NoticeSection;
