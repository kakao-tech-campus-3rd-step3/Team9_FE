import { formatDateHeader } from '../utils/timeUtils';

interface DateDividerProps {
  date: Date;
}

/**
 * 날짜 구분선 컴포넌트
 * 채팅 메시지 리스트에서 날짜가 바뀌는 지점에 표시
 */
export function DateDivider({ date }: DateDividerProps) {
  return (
    <div className='flex items-center justify-center my-4'>
      <div className='flex items-center gap-3 w-full max-w-md'>
        <div className='flex-1 h-px bg-border' />
        <div className='px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/50 rounded-full'>
          {formatDateHeader(date)}
        </div>
        <div className='flex-1 h-px bg-border' />
      </div>
    </div>
  );
}
