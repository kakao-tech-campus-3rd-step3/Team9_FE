import type { ChatMessage } from '../types';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { SystemMessage } from './SystemMessage';

interface MessageRendererProps {
  message: ChatMessage;
}

export function MessageRenderer({ message }: MessageRendererProps) {
  switch (message.messageType) {
    case 'NOTICE':
      return <SystemMessage message={message} type='notice' />;
    case 'SCHEDULE':
      return <SystemMessage message={message} type='schedule' />;
    case 'CHAT':
    default:
      return <ChatMessageComponent message={message} />;
  }
}
