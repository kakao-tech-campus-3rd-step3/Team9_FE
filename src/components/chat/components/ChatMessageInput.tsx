// 텍스트 메시지 전송(엔터/버튼) 입력 영역 컴포넌트
import { useState } from 'react';
import { Send } from 'lucide-react';
import type { ChatConnectionState } from '../types';

interface ChatMessageInputProps {
  onSendMessage: (message: string) => void;
  connectionState: ChatConnectionState;
  disabled?: boolean;
}

export function ChatMessageInput({
  onSendMessage,
  connectionState,
  disabled = false,
}: ChatMessageInputProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  // 엔터 키로 메시지 전송 (Shift+Enter는 줄바꿈)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isDisabled = disabled || !connectionState.isConnected;

  const getPlaceholder = () => {
    if (connectionState.isConnected) {
      return '메시지를 입력하세요...';
    } else if (connectionState.isConnecting) {
      return '실시간 채팅 연결 중...';
    } else if (connectionState.error) {
      return '연결 실패 - 다시 시도해주세요';
    } else {
      return '채팅을 준비 중입니다...';
    }
  };

  return (
    <div className='p-5 border-t-2 border-border bg-muted/30'>
      <div className='flex items-center gap-3'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={getPlaceholder()}
          disabled={isDisabled}
          className='flex-1 px-4 py-3 text-sm border-2 border-input rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isDisabled}
          className='p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-primary/20 hover:border-primary/40'
        >
          <Send className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
