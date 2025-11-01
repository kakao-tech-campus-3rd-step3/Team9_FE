// 채팅 기록 무한 스크롤(커서 기반: hasNext, nextCursor) 구현
import { MessageRenderer } from '../messages';
import type { ChatMessage, ChatConnectionState } from '../types';
import { useScrollToBottom } from '../hooks/useScrollToBottom';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  connectionState: ChatConnectionState;
  onRetry?: () => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

// 채팅 메시지 리스트 컴포넌트 (헤더/리스트/입력 영역 중 리스트 부분)
export function ChatMessageList({
  messages,
  isLoading,
  connectionState,
  onRetry,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ChatMessageListProps) {
  // 무한 스크롤: 위로 스크롤 시 이전 메시지 자동 로드 및 스크롤 위치 유지
  const { scrollContainerRef, handleScroll } = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  });

  // 최신 메시지 수신 시 하단으로 자동 스크롤
  const { messagesEndRef } = useScrollToBottom({
    isLoading,
    messagesLength: messages.length,
    shouldAutoScroll: !isFetchingNextPage,
    scrollContainerRef,
  });

  return (
    <div
      ref={scrollContainerRef}
      className='flex-1 overflow-y-auto p-5 space-y-3 bg-muted/5'
      style={{ scrollBehavior: 'auto' }}
      onScroll={handleScroll}
    >
      {/* 무한 스크롤: 이전 메시지 로딩 중 표시 */}
      {isFetchingNextPage && (
        <div className='flex items-center justify-center py-4 animate-pulse'>
          <div className='flex flex-col items-center gap-2'>
            <div className='w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            <div className='text-xs text-muted-foreground'>
              이전 메시지 불러오는 중...
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className='flex items-center justify-center h-full'>
          <div className='flex flex-col items-center gap-3'>
            <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
            <div className='text-sm text-muted-foreground'>
              메시지를 불러오는 중...
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 실제 채팅 기록 및 실시간 메시지 */}
          {messages.map((message) => (
            <MessageRenderer key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}

      {/* 연결 상태 인디케이터: 연결 실패 시 에러 메시지 표시 */}
      {!isLoading && !connectionState.isConnected && connectionState.error && (
        <div className='flex items-center justify-center h-full'>
          <div className='flex flex-col items-center gap-4 text-center p-6 bg-destructive/5 border border-destructive/20 rounded-lg'>
            <div className='w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>⚠️</span>
            </div>
            <div>
              <div className='text-sm font-medium text-destructive mb-1'>
                연결 실패
              </div>
              <span className='text-sm text-muted-foreground'>
                {connectionState.error || '실시간 채팅 연결에 실패했습니다'}
              </span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className='px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors border border-primary/20'
              >
                다시 시도
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
