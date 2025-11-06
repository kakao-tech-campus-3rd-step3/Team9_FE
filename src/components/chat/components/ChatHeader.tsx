// 채팅 UI 레이아웃 구성 중 헤더 영역 컴포넌트
import { Users, X } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import type { ChatConnectionState } from '../types';

interface ChatHeaderProps {
  connectionState: ChatConnectionState;
  onClose: () => void;
  title?: string;
  messageCount?: number;
}

export function ChatHeader({
  connectionState,
  onClose,
  title = '스터디 채팅',
  messageCount = 0,
}: ChatHeaderProps) {
  return (
    <div className='flex items-center justify-between p-5 border-b-2 border-border bg-muted/30'>
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-primary/10 rounded-lg'>
          <Users className='w-5 h-5 text-primary' />
        </div>
        <div>
          <span className='font-semibold text-foreground text-base'>
            {title}
          </span>
          <div className='text-xs text-muted-foreground'>
            {messageCount}개의 메시지
          </div>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <ConnectionStatus connectionState={connectionState} />
        <button
          onClick={onClose}
          className='p-2 hover:bg-muted rounded-lg transition-colors border border-border hover:border-border-hover'
          aria-label='채팅 닫기'
        >
          <X className='w-4 h-4 text-muted-foreground' />
        </button>
      </div>
    </div>
  );
}
