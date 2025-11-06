// 채팅 도메인 엔드포인트 상수
export const CHAT_ENDPOINTS = {
  // REST API 엔드포인트
  // 채팅 기록 조회
  CHAT_HISTORY: (studyId: string) => `/api/studies/${studyId}/chats`,
  // 안읽은 메시지 수 조회
  UNREAD_COUNT: (studyId: string) => `/api/studies/${studyId}/chats/unread`,
  // 채팅 메시지 삭제
  DELETE_MESSAGE: (studyId: string, chatId: string) =>
    `/api/studies/${studyId}/chats/${chatId}`,
  // 좋아요/싫어요 생성, 수정
  REACTION: (studyId: string, chatId: string) =>
    `/api/studies/${studyId}/chats/${chatId}/reactions`,
  // 좋아요/싫어요 삭제
  DELETE_REACTION: (studyId: string, chatId: string) =>
    `/api/studies/${studyId}/chats/${chatId}/reactions`,
  // 채팅 채널 정보 조회
  CHANNEL_INFO: (studyId: string) => `/api/studies/${studyId}/chat/channel`,
} as const;

// 웹소켓 엔드포인트 상수
export const CHAT_WEBSOCKET_ENDPOINTS = {
  // 구독 (SUBSCRIBE) 엔드포인트
  SUBSCRIBE: {
    // 채팅방 구독
    CHAT_MESSAGES: (studyId: string) => `/topic/studies/${studyId}/chats`,
    // 에러 구독
    ERRORS: '/user/queue/errors',
    // 특정 메시지 읽지 않은 멤버수 수신
    UNREAD_MEMBERS: (studyId: string) => `/topic/studies/${studyId}/unread`,
    // 안읽은 메시지 수 수신
    UNREAD_COUNT: (studyId: string) => `/user/queue/studies/${studyId}/unread`,
    // 채팅방 업데이트
    UPDATES: (studyId: string) => `/topic/studies/${studyId}/updates`,
  },
  // 전송 (SEND) 엔드포인트
  SEND: {
    // 메시지 전송
    MESSAGE: (studyId: string) => `/app/studies/${studyId}/chats`,
    // 읽음 상태 전송
    READ_STATUS: (studyId: string) => `/app/studies/${studyId}/read`,
    // 채팅방 모달 열기
    MODAL_OPEN: (studyId: string) => `/app/studies/${studyId}/modal/open`,
    // 채팅방 모달 닫기
    MODAL_CLOSE: (studyId: string) => `/app/studies/${studyId}/modal/close`,
    // 채팅방 모달 사용 중임을 갱신
    MODAL_HEARTBEAT: (studyId: string) =>
      `/app/studies/${studyId}/modal/heartbeat`,
  },
} as const;
