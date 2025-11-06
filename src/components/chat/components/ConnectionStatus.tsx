// 연결 상태 인디케이터(연결됨/재연결 중) 표시 컴포넌트
import { Wifi, WifiOff } from 'lucide-react';
import { getConnectionStatusText } from '../utils/errorUtils';
import type { ChatConnectionState } from '../types';

interface ConnectionStatusProps {
  connectionState: ChatConnectionState;
}

export function ConnectionStatus({ connectionState }: ConnectionStatusProps) {
  const getConnectionIcon = () => {
    if (connectionState.isConnecting || connectionState.isReconnecting) {
      return <Wifi className='w-3 h-3 text-warning animate-pulse' />;
    }
    if (connectionState.isConnected) {
      return <Wifi className='w-3 h-3 text-success' />;
    }
    return <WifiOff className='w-3 h-3 text-destructive' />;
  };

  return (
    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
      {getConnectionIcon()}
      <span>{getConnectionStatusText(connectionState)}</span>
    </div>
  );
}
