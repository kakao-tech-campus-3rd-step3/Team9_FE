// 무한 스크롤 훅: 위로 스크롤 시 이전 메시지 자동 로드 및 스크롤 위치 유지
import { useRef, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading,
  threshold = 200,
}: UseInfiniteScrollOptions) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const savedScrollHeight = useRef<number>(0);
  const savedScrollTop = useRef<number>(0);

  // 스크롤 이벤트 핸들러: 상단 근처에서 다음 페이지 로드
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;

      // 로딩 중이면 무시
      if (isFetchingNextPage || isLoading) {
        return;
      }

      // 상단 근처에 있고, 다음 페이지가 있을 때
      if (scrollTop < threshold && hasNextPage && fetchNextPage) {
        // 로드 전 스크롤 높이와 위치 저장
        savedScrollHeight.current = container.scrollHeight;
        savedScrollTop.current = scrollTop;
        fetchNextPage();
      }
    },
    [hasNextPage, fetchNextPage, isFetchingNextPage, isLoading, threshold],
  );

  // 스크롤 위치 유지: 새 메시지 로드 완료 후 스크롤 위치 복원
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (
      !container ||
      isFetchingNextPage ||
      isLoading ||
      savedScrollHeight.current === 0
    ) {
      return;
    }

    // DOM 업데이트 후 스크롤 위치 복원 (일반적인 무한 스크롤 패턴)
    // requestAnimationFrame을 두 번 사용하여 레이아웃 완료 보장
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const currentScrollHeight = container.scrollHeight;
        const scrollDifference =
          currentScrollHeight - savedScrollHeight.current;

        if (scrollDifference > 0 && savedScrollHeight.current > 0) {
          // 새 메시지가 상단에 추가되었으므로 스크롤 위치를 추가된 높이만큼 조정
          container.scrollTop = savedScrollTop.current + scrollDifference;
          // 리셋
          savedScrollHeight.current = 0;
          savedScrollTop.current = 0;
        }
      });
    });
  }, [isFetchingNextPage, isLoading]);

  return {
    scrollContainerRef,
    handleScroll,
  };
}
