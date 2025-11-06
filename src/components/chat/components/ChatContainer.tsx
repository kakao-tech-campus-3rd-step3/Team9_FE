// 채팅 UI 레이아웃 구성(헤더/리스트/입력 영역) 통합 컴포넌트
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatMessageInput } from './ChatMessageInput';
import type { ChatMessage, ChatConnectionState } from '../types';

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  connectionState: ChatConnectionState;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onRetry?: () => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  title?: string;
  className?: string;
}

export function ChatContainer({
  messages,
  isLoading,
  connectionState,
  onSendMessage,
  onClose,
  onRetry,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  title = '스터디 채팅',
  className = 'fixed bottom-6 right-6 w-96 h-[500px] bg-background border-2 border-border rounded-xl shadow-2xl flex flex-col z-50',
}: ChatContainerProps) {
  return (
    <div className={className}>
      <ChatHeader
        connectionState={connectionState}
        onClose={onClose}
        title={title}
        messageCount={messages.length}
      />

      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        connectionState={connectionState}
        onRetry={onRetry}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      <ChatMessageInput
        onSendMessage={onSendMessage}
        connectionState={connectionState}
      />
    </div>
  );
}
