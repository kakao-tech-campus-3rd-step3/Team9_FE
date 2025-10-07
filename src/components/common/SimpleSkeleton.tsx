import { cn } from '@/pages/(study)/dashboard/utils';

interface SimpleSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

/**
 * 단순한 스켈레톤 컴포넌트
 * 배경과 대비되도록 단순한 디자인
 */
export const SimpleSkeleton = ({
  className,
  height = 'h-4',
  width = 'w-full',
}: SimpleSkeletonProps) => {
  return (
    <div
      role='status'
      aria-busy='true'
      className={cn(
        // 대비가 분명한 연한 회색 톤 (테마에 따라 가벼운 톤 유지)
        'bg-gray-200 dark:bg-muted/60 animate-pulse rounded',
        height,
        width,
        className,
      )}
    />
  );
};

/**
 * 테이블 행 스켈레톤
 */
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => {
  return (
    <tr className='border-b border-border'>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className='px-4 py-3'>
          <SimpleSkeleton height='h-4' width='w-3/4' />
        </td>
      ))}
    </tr>
  );
};

/**
 * 테이블 스켈레톤
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <div className='w-full'>
      {/* 테이블 헤더 */}
      <div className='border-b border-border bg-muted/30'>
        <div className='flex'>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className='flex-1 px-4 py-3'>
              <SimpleSkeleton height='h-4' width='w-1/2' />
            </div>
          ))}
        </div>
      </div>

      {/* 테이블 바디 */}
      <div className='divide-y divide-border'>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className='flex'>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className='flex-1 px-4 py-3'>
                <SimpleSkeleton height='h-4' width='w-3/4' />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 카드 스켈레톤
 */
export const CardSkeleton = () => {
  return (
    <div className='border border-border rounded-lg p-4 space-y-3'>
      <SimpleSkeleton height='h-5' width='w-3/4' />
      <SimpleSkeleton height='h-4' width='w-full' />
      <SimpleSkeleton height='h-4' width='w-2/3' />
    </div>
  );
};

/**
 * 리스트 아이템 스켈레톤
 */
export const ListItemSkeleton = () => {
  return (
    <div className='flex items-center space-x-3 p-3 border-b border-border'>
      <SimpleSkeleton height='h-8' width='w-8' className='rounded-full' />
      <div className='flex-1 space-y-2'>
        <SimpleSkeleton height='h-4' width='w-1/3' />
        <SimpleSkeleton height='h-3' width='w-2/3' />
      </div>
    </div>
  );
};

export default SimpleSkeleton;
