// 최신 메시지 수신 시 하단으로 자동 스크롤 관리 훅 (간소화)
import { useCallback, useRef, useEffect } from 'react';

interface UseScrollToBottomOptions {
  isOpen?: boolean;
  isLoading?: boolean;
  messagesLength?: number;
  shouldAutoScroll?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export function useScrollToBottom(options: UseScrollToBottomOptions = {}) {
  const {
    isOpen = true,
    isLoading = false,
    messagesLength = 0,
    shouldAutoScroll = true,
    scrollContainerRef: externalScrollContainerRef,
  } = options;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef<boolean>(false);
  const previousMessagesLength = useRef<number>(0);

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = useCallback((force = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: force ? 'auto' : 'smooth',
      });
    }
  }, []);

  // 첫 로딩 완료 시 맨 아래로 스크롤
  useEffect(() => {
    if (!isLoading && messagesLength > 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      requestAnimationFrame(() => {
        scrollToBottom(true);
      });
    }
  }, [isLoading, messagesLength, scrollToBottom]);

  // 새 메시지 추가 시 자동 스크롤 (하단 근처에 있을 때만)
  useEffect(() => {
    if (!shouldAutoScroll || !isOpen || isLoading || !hasInitialized.current) {
      return;
    }

    const messagesIncreased = messagesLength > previousMessagesLength.current;
    previousMessagesLength.current = messagesLength;

    if (!messagesIncreased || messagesLength === 0) {
      return;
    }

    // 무한 스크롤 모드 감지: 하단에서 150px 이상 떨어져 있으면 차단
    const container = externalScrollContainerRef?.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distanceFromBottom > 150) {
        return;
      }
    }

    requestAnimationFrame(() => {
      scrollToBottom(true);
    });
  }, [
    shouldAutoScroll,
    isOpen,
    isLoading,
    messagesLength,
    scrollToBottom,
    externalScrollContainerRef,
  ]);

  return {
    messagesEndRef,
    scrollToBottom,
  };
}
