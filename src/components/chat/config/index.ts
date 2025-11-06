// React Query 설정
export const QUERY_CONFIG = {
  DEFAULT_SIZE: 20,
  STALE_TIME: 1000 * 60 * 5, // 5분
  GC_TIME: 1000 * 60 * 10, // 10분
  RETRY: 2,
  RETRY_DELAY: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  HISTORY_LOAD_FAILED:
    '채팅 기록을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.',
  SEND_FAILED: '메시지 전송에 실패했습니다.',
} as const;

// 시스템 메시지 설정
export const SYSTEM_MESSAGE = {
  SENDER_ID: 'system',
  SENDER_NAME: '시스템',
  ERROR_MESSAGE_ID: 999,
} as const;

// WebSocket 설정
export const WS_CONFIG = {
  NORMAL_CLOSE_CODE: 1000,
  SCROLL_DELAY: 100,
} as const;
