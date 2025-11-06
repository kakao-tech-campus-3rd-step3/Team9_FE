/**
 * 연결 에러 메시지를 사용자 친화적인 메시지로 변환
 */
export function getConnectionErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (
      error.message.includes('타임아웃') ||
      error.message.includes('handshake')
    ) {
      return '서버 연결 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    }
    if (error.message.includes('인증 토큰')) {
      return '로그인이 필요합니다. 다시 로그인해주세요.';
    }
    if (error.message.includes('Network Error')) {
      return '네트워크 연결을 확인해주세요.';
    }
    if (error.message.includes('STOMP')) {
      return '실시간 채팅 서버에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
    }
  }
  return '실시간 채팅 연결에 실패했습니다. 잠시 후 다시 시도해주세요.';
}

/**
 * 연결 상태에 따른 상태 텍스트 반환
 */
export function getConnectionStatusText(connectionState: {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  error?: string;
}): string {
  if (connectionState.isConnecting) return '연결 중...';
  if (connectionState.isReconnecting) return '재연결 중...';
  if (connectionState.isConnected) return '연결됨';
  if (connectionState.error) {
    if (connectionState.error.includes('로그인')) return '로그인 필요';
    if (
      connectionState.error.includes('서버') &&
      !connectionState.error.includes('타임아웃')
    )
      return '서버 문제';
    if (connectionState.error.includes('네트워크')) return '네트워크 확인';
    if (
      connectionState.error.includes('타임아웃') ||
      connectionState.error.includes('handshake')
    )
      return '연결 시간 초과';
    if (connectionState.error.includes('STOMP')) return '서버 문제';
    return '연결 실패';
  }
  return '오프라인';
}
