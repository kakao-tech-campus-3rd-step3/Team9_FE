import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ChatToggleButton, ChatContainer } from './components';
import { useChatMessages, useChatConnection, useSendMessage } from './hooks';
import { chatService } from './chatService';
import { getCurrentKoreanTime } from './utils/timeUtils';
import type { ChatMessage } from './types';
import { useAuthStore } from '@/stores/auth';

interface ChatWidgetProps {
  studyId: string;
}

// 스터디 페이지 진입 시 채널 자동 구독·이탈 시 해제를 담당하는 채팅 위젯 메인 컴포넌트
// 웹소켓 연결은 StudyLayout에서 관리하고, 여기서는 구독만 관리
// 위젯 열림/닫힘에 따라 UI 표시 여부만 제어
export function ChatWidget({ studyId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

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
  const { connectionState } = useChatConnection();
  const sendMessageMutation = useSendMessage();
  const { accessToken } = useAuthStore();

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

  // 스터디 페이지 진입 시 웹소켓 연결 확인 후 채팅 구독 시작
  // (연결은 StudyLayout에서 관리, 구독은 ChatWidget에서 관리)
  // 스터디 ID별로 독립적인 구독 관리
  useEffect(() => {
    if (!studyId) return;

    let unsubscribeStateChange: (() => void) | null = null;

    const initializeSubscription = () => {
      // 연결이 되어있으면 바로 구독
      if (chatService.isConnected) {
        chatService.subscribeToChat(studyId, handleNewMessage);
        if (accessToken) {
          loadChatHistory();
        }
      } else {
        // 연결 상태 변화 감지하여 연결 완료 시 구독 시작
        const targetStudyId = studyId; // 클로저에서 studyId 고정
        unsubscribeStateChange = chatService.onConnectionStateChange(
          (state) => {
            // 연결 완료 시 해당 스터디에 구독
            if (state.isConnected) {
              chatService.subscribeToChat(targetStudyId, handleNewMessage);
              if (accessToken) {
                loadChatHistory();
              }
            }
          },
        );
      }
    };

    initializeSubscription();

    // 스터디 변경 또는 컴포넌트 언마운트 시 구독 해제
    return () => {
      // 연결 상태 변화 구독 해제
      if (unsubscribeStateChange) {
        unsubscribeStateChange();
        unsubscribeStateChange = null;
      }

      // 현재 스터디의 채팅 구독 해제
      chatService.unsubscribeFromChat(studyId);
    };
  }, [studyId, handleNewMessage, loadChatHistory, accessToken]);

  // 위젯 열림 시 채팅 기록만 로드 (구독은 이미 되어있음)
  const initializeChat = useCallback(async () => {
    await loadChatHistory();
  }, [loadChatHistory]);

  useEffect(() => {
    if (isOpen && studyId && accessToken) {
      initializeChat();
    }
  }, [isOpen, studyId, initializeChat, accessToken]);

  // 텍스트 메시지 전송(엔터/버튼) 및 전송 중/실패 처리
  // 낙관적 업데이트로 즉시 UI에 표시하고 서버로 전송
  const handleSendMessage = async (messageContent: string) => {
    // 연결되지 않은 경우 토스트 메시지 표시 후 종료
    if (!connectionState.isConnected) {
      toast.error(
        '채팅 서버에 연결되지 않았습니다. 연결이 복구되면 다시 시도해주세요.',
      );
      return;
    }

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
    try {
      await sendMessageMutation.mutateAsync({
        studyId,
        content: messageContent,
      });
    } catch (error) {
      console.error('❌ [ChatWidget] 메시지 전송 실패:', error);
      toast.error('메시지 전송에 실패했습니다. 다시 시도해주세요.');
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
