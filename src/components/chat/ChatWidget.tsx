import { useState, useRef, useCallback, useEffect } from 'react';
import { ChatToggleButton, ChatContainer } from './components';
import { useChatMessages, useChatConnection, useSendMessage } from './hooks';
import { chatService } from './chatService';
import { getCurrentKoreanTime } from './utils/timeUtils';
import type { ChatMessage } from './types';

interface ChatWidgetProps {
  studyId: string;
}

// 스터디 페이지 진입 시 채널 자동 구독·이탈 시 해제를 담당하는 채팅 위젯 메인 컴포넌트
// stompjs + SockJS 클라이언트 설정 및 자동 재연결 기능 포함
export function ChatWidget({ studyId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const subscriptionRef = useRef<unknown>(null);

  // 메시지 관리, 연결 상태, 전송 뮤테이션
  const {
    messages,
    isLoading,
    loadChatHistory,
    addMessage,
    handleRealTimeMessage,
    currentUserId,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(studyId);
  const { connectionState, connectWebSocket } = useChatConnection();
  const sendMessageMutation = useSendMessage();

  // WebSocket을 통한 실시간 메시지 수신 핸들러
  const handleNewMessage = useCallback(
    (rawMessage: unknown) => {
      const message = handleRealTimeMessage(rawMessage);
      if (message) {
        addMessage(message);
      }
    },
    [addMessage, handleRealTimeMessage],
  );

  // 스터디 페이지 진입 시 채널 자동 구독 및 채팅 기록 로드
  const initializeChat = useCallback(async () => {
    try {
      await connectWebSocket();
      subscriptionRef.current = chatService.subscribeToChat(
        studyId,
        handleNewMessage,
      );
      await loadChatHistory();
    } catch {
      await loadChatHistory(); // 연결 실패해도 기록은 로드
    }
  }, [studyId, connectWebSocket, handleNewMessage, loadChatHistory]);

  // 위젯 열림/닫힘에 따라 구독 관리 (이탈 시 해제)
  useEffect(() => {
    if (isOpen && studyId) {
      initializeChat();
    } else if (!isOpen && studyId) {
      chatService.unsubscribeFromChat(studyId);
      subscriptionRef.current = null;
    }
    return () => {
      chatService.unsubscribeFromChat(studyId);
      subscriptionRef.current = null;
    };
  }, [isOpen, studyId, initializeChat]);

  // 텍스트 메시지 전송(엔터/버튼) 및 전송 중/실패 처리
  // 낙관적 업데이트로 즉시 UI에 표시하고 서버로 전송
  const handleSendMessage = async (messageContent: string) => {
    // 낙관적 메시지 생성 (즉시 표시)
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      messageId: -Date.now(),
      messageType: 'CHAT',
      content: messageContent,
      senderId: currentUserId ? String(currentUserId) : 'current-user',
      senderName: '나',
      timestamp: getCurrentKoreanTime(),
      isOwn: true,
      isOptimistic: true,
    };
    addMessage(tempMessage);

    // WebSocket을 통해 서버로 메시지 전송
    if (connectionState.isConnected) {
      try {
        await sendMessageMutation.mutateAsync({
          studyId,
          content: messageContent,
        });
      } catch (error) {
        console.error('❌ [ChatWidget] 메시지 전송 실패:', error);
      }
    }
  };

  return (
    <>
      <ChatToggleButton onClick={() => setIsOpen(true)} isOpen={isOpen} />

      {isOpen && (
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          connectionState={connectionState}
          onSendMessage={handleSendMessage}
          onClose={() => setIsOpen(false)}
          onRetry={initializeChat}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
}
