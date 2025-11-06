/**
 * 채팅 서비스 설정 상수
 */
export const CHAT_SERVICE_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  HEARTBEAT_INTERVAL: 4000,
  CONNECTION_TIMEOUT: 8000,
  MAX_RECONNECT_ATTEMPTS: 3,
  WEBSOCKET_PATH: '/ws',
} as const;

/**
 * WebSocket 경로 상수 (CHAT_WEBSOCKET_ENDPOINTS와 호환)
 */
export const WS_PATHS = {
  TOPIC_PREFIX: '/topic/studies',
  APP_PREFIX: '/app/studies',
} as const;

/**
 * 재연결 관련 상수
 */
export const RECONNECT_CONFIG = {
  INITIAL_DELAY: 1000,
  BACKOFF_MULTIPLIER: 2,
} as const;

/**
 * 디버그 로그 키워드
 */
export const DEBUG_KEYWORDS = ['Connected', 'Error', 'Disconnected'] as const;
