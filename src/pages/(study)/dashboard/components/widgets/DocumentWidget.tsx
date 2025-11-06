import { FileText, User, HardDrive } from 'lucide-react';
import { getIconByExtension } from '../../utils';
import { SectionCard, DashboardEmpty } from '../common';
import { ListItemSkeleton } from '@/components/common';

interface RecentMaterialItem {
  material_id: number;
  material_title: string;
  author_name: string;
  file_count: number;
  total_file_size: number;
}

interface DocumentWidgetProps {
  recent?: RecentMaterialItem[];
  isLoading?: boolean;
  onClick: () => void;
  onItemClick?: (materialId: number) => void;
}

const DocumentWidget = ({
  recent,
  isLoading = false,
  onClick,
  onItemClick,
}: DocumentWidgetProps) => {
  const getFileIcon = (title?: string) =>
    title ? (
      getIconByExtension(title)
    ) : (
      <FileText className='w-4 h-4 text-muted-foreground' />
    );

  const normalized = (() => {
    if (recent && recent.length > 0) {
      return recent.map((r) => {
        const bytes = Number(r.total_file_size) || 0;
        const fileCount = Number(r.file_count) || 0;
        let sizeText = '첨부 없음';
        if (fileCount > 0 && bytes > 0) {
          sizeText =
            bytes < 1024 * 1024
              ? `${Math.round(bytes / 1024)}KB`
              : `${(bytes / 1024 / 1024).toFixed(1)}MB`;
          sizeText = `${sizeText} / ${fileCount}개`;
        } else if (fileCount > 0) {
          sizeText = `${fileCount}개`;
        }
        return {
          id: r.material_id,
          title: r.material_title,
          author: r.author_name,
          meta: sizeText,
          icon: getFileIcon(r.material_title),
        };
      });
    }
    return [];
  })();

  return (
    <SectionCard icon={FileText} title='문서' onClick={onClick}>
      <div className='space-y-2'>
        {isLoading ? (
          <>
            <ListItemSkeleton />
            <ListItemSkeleton />
            <ListItemSkeleton />
          </>
        ) : normalized.length === 0 ? (
          <DashboardEmpty
            icon={FileText}
            title='자료 없음'
            description='최근 학습 자료가 없습니다'
            minHeightClass='min-h-[140px]'
            iconClassName='text-primary'
            iconWrapperClassName='bg-primary/20'
          />
        ) : (
          normalized.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors border border-border/50 hover:border-border bg-card'
              onClick={(e) => {
                e.stopPropagation();
                if (onItemClick) onItemClick(Number(item.id));
              }}
            >
              {item.icon}
              <div className='flex-1 min-w-0'>
                <h4 className='font-semibold text-foreground text-sm line-clamp-1 mb-0.5 tracking-tight'>
                  {item.title}
                </h4>
                <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <HardDrive className='w-3 h-3' />
                    <span>{item.meta}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <User className='w-3 h-3' />
                    <span className='line-clamp-1'>{item.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default DocumentWidget;
