// 채팅 메시지 관리 훅: 서버 기록 + 실시간 메시지 통합 및 낙관적 업데이트 처리
// 채팅 기록 무한 스크롤(커서 기반: hasNext, nextCursor) 지원
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useInfiniteChatHistory } from './useInfiniteChatHistory';
import { ERROR_MESSAGES, SYSTEM_MESSAGE } from '../config';
import { mapServerMessageToChatMessage } from '../utils/messageMapper';
import type { ChatMessage } from '../types';

export function useChatMessages(studyId?: string) {
  const [additionalMessages, setAdditionalMessages] = useState<ChatMessage[]>(
    [],
  );
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    undefined,
  );

  // 채팅 기록 무한 스크롤 조회 (커서 기반 페이지네이션)
  const {
    data: infiniteHistoryData,
    isLoading,
    error,
    refetch: loadChatHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChatHistory({
    studyId,
    enabled: !!studyId,
  });

  // 무한 스크롤 데이터에서 모든 페이지의 메시지와 메타데이터 추출
  const historyData = useMemo(() => {
    if (!infiniteHistoryData?.pages || infiniteHistoryData.pages.length === 0)
      return null;

    const allMessages: ChatMessage[] = [];
    let userId: number | undefined;
    let hasNext = false;
    let nextCursor: string | undefined;

    // 첫 번째 페이지(최신 페이지)의 userId 사용 (무한 스크롤은 최신 → 과거 순으로 로드)
    // 첫 페이지의 userId가 가장 신뢰할 수 있고, 실시간 메시지 판별에 필수적
    const firstPage = infiniteHistoryData.pages[0];
    if (firstPage) {
      userId = firstPage.userId;
    }

    // 마지막 페이지의 메타데이터 사용 (hasNext, nextCursor)
    const lastPage =
      infiniteHistoryData.pages[infiniteHistoryData.pages.length - 1];
    if (lastPage) {
      hasNext = lastPage.hasNext;
      nextCursor = lastPage.nextCursor;
      // 첫 페이지에 userId가 없으면 마지막 페이지에서 시도
      if (userId === undefined) {
        userId = lastPage.userId;
      }
    }

    // 모든 페이지의 메시지를 시간순으로 병합 (무한 스크롤은 최신 → 과거 순으로 로드)
    // 첫 번째 페이지가 최신, 마지막 페이지가 가장 오래된 메시지
    infiniteHistoryData.pages.forEach((page) => {
      if (page.messages) {
        allMessages.push(...page.messages);
      }
    });

    // 메시지가 시간순으로 정렬되어 있는지 확인하고, 필요시 정렬
    // 서버에서 이미 정렬된 상태이지만, 여러 페이지를 병합할 때 순서 보장
    if (allMessages.length > 1) {
      allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }

    return {
      messages: allMessages,
      userId,
      hasNext,
      nextCursor,
    };
  }, [infiniteHistoryData]);

  // 서버 응답의 userId 저장 (본인 메시지 판별용)
  useEffect(() => {
    if (historyData?.userId !== undefined) {
      setCurrentUserId(historyData.userId);
    }
  }, [historyData?.userId]);

  // 기록 재로드 시 낙관적 메시지 제거 (서버 기록에 이미 반영되었으므로)
  useEffect(() => {
    if (historyData?.messages) {
      setAdditionalMessages((prev) => prev.filter((msg) => !msg.isOptimistic));
    }
  }, [historyData?.messages]);

  // 에러 발생 시 시스템 메시지 생성
  const errorMessage = useMemo((): ChatMessage | null => {
    if (error) {
      return {
        id: `error-history-${Date.now()}`,
        messageId: SYSTEM_MESSAGE.ERROR_MESSAGE_ID,
        messageType: 'NOTICE',
        content: ERROR_MESSAGES.HISTORY_LOAD_FAILED,
        senderId: SYSTEM_MESSAGE.SENDER_ID,
        senderName: SYSTEM_MESSAGE.SENDER_NAME,
        timestamp: new Date(),
        isOwn: false,
      };
    }
    return null;
  }, [error]);

  // 서버 기록 + 실시간 메시지 + 에러 메시지 통합 (최신 메시지 수신 시 자연스러운 리스트 추가)
  const messages = useMemo(() => {
    const serverMessages = historyData?.messages || [];
    const serverMessageIds = new Set(
      serverMessages.map((msg) => msg.messageId),
    );

    // 실시간 메시지 중복 제거 및 낙관적 메시지 isOwn 보장
    // currentUserId가 있을 경우 실시간 메시지의 isOwn도 재확인
    const filteredAdditionalMessages = additionalMessages
      .filter((msg) => !serverMessageIds.has(msg.messageId))
      .map((msg) => {
        // 낙관적 메시지는 항상 isOwn: true
        if (msg.isOptimistic) {
          return { ...msg, isOwn: true };
        }
        // 실시간 메시지의 경우 currentUserId로 isOwn 재확인 (userId 설정 타이밍 문제 방지)
        if (currentUserId !== undefined && typeof msg.senderId === 'string') {
          const senderIdNum = Number(msg.senderId);
          if (!isNaN(senderIdNum)) {
            return { ...msg, isOwn: senderIdNum === currentUserId };
          }
        }
        return msg;
      });

    const allMessages = serverMessages
      .concat(filteredAdditionalMessages)
      .concat(errorMessage || []);

    // 실시간 메시지가 있으면 시간순 정렬
    return filteredAdditionalMessages.length > 0 || errorMessage
      ? allMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        )
      : allMessages;
  }, [historyData?.messages, additionalMessages, errorMessage, currentUserId]);

  // 실시간 메시지 추가 및 중복 제거 (낙관적 메시지와 실제 메시지 매칭)
  const addMessage = useCallback((message: ChatMessage) => {
    setAdditionalMessages((prev) => {
      // 서버에서 온 실제 메시지인 경우: 낙관적 메시지와 매칭하여 제거
      if (message.messageId > 0 && !message.isOptimistic) {
        const filtered = prev.filter((msg) => {
          if (msg.messageId === message.messageId) return false;
          if (
            msg.isOptimistic &&
            msg.content === message.content &&
            msg.isOwn
          ) {
            return false;
          }
          return true;
        });
        return filtered.concat(message);
      }

      // 낙관적 메시지 추가 (항상 isOwn: true)
      const optimisticMessage: ChatMessage = {
        ...message,
        isOwn: true,
      };

      // 중복 체크: 같은 내용의 낙관적 메시지가 1초 이내에 있으면 추가하지 않음
      const hasDuplicate = prev.some(
        (msg) =>
          msg.isOptimistic &&
          msg.content === optimisticMessage.content &&
          Math.abs(
            msg.timestamp.getTime() - optimisticMessage.timestamp.getTime(),
          ) < 1000,
      );

      return hasDuplicate ? prev : prev.concat(optimisticMessage);
    });
  }, []);

  const clearMessages = useCallback(() => {
    setAdditionalMessages([]);
  }, []);

  // WebSocket을 통해 받은 실시간 메시지를 변환 (userId로 본인 메시지 판별)
  const handleRealTimeMessage = useCallback(
    (rawMessage: unknown): ChatMessage | null => {
      if (typeof rawMessage !== 'object' || rawMessage === null) {
        return null;
      }
      return mapServerMessageToChatMessage(
        rawMessage as Record<string, unknown>,
        currentUserId,
      );
    },
    [currentUserId],
  );

  return {
    messages,
    isLoading,
    loadChatHistory,
    addMessage,
    clearMessages,
    currentUserId,
    handleRealTimeMessage,
    // 무한 스크롤 관련 (커서 기반: hasNext, nextCursor)
    hasNext: historyData?.hasNext || false,
    nextCursor: historyData?.nextCursor,
    fetchNextPage, // 다음 페이지 로드 함수
    hasNextPage, // 다음 페이지 존재 여부
    isFetchingNextPage, // 다음 페이지 로딩 중 여부
    error,
  };
}
