import { Bell, AlertCircle, Calendar, User } from 'lucide-react';
import { SectionCard } from './common';
import type { Notice } from '../types';

interface NoticeSectionProps {
  notices: Notice[];
  onClick: () => void;
}

const NoticeSection = ({ notices, onClick }: NoticeSectionProps) => {
  const latestNotice = notices[0]; // 가장 최신 공지사항만

  if (!latestNotice) {
    return (
      <SectionCard
        icon={Bell}
        title='공지사항'
        onClick={onClick}
        borderColor='border-primary'
      >
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>등록된 공지사항이 없습니다.</p>
        </div>
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
      <div className='p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center gap-2'>
            {latestNotice.isImportant && (
              <div className='flex items-center gap-1'>
                <AlertCircle className='w-4 h-4 text-destructive' />
                <span className='text-sm font-medium text-destructive'>
                  [중요]
                </span>
              </div>
            )}
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Calendar className='w-3 h-3' />
            <span>{latestNotice.createdAt}</span>
          </div>
        </div>

        <h4 className='font-semibold text-foreground text-lg mb-2 line-clamp-2'>
          {latestNotice.title}
        </h4>

        <p className='text-sm text-muted-foreground line-clamp-3 mb-3'>
          {latestNotice.content}
        </p>

        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <User className='w-3 h-3' />
          <span>{latestNotice.author}</span>
        </div>
      </div>
    </SectionCard>
  );
};

export default NoticeSection;
