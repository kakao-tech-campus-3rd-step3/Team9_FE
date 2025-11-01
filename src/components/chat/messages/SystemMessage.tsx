import type { ChatMessage } from '../types';

interface SystemMessageProps {
  message: ChatMessage;
  type: 'notice' | 'schedule';
}

// 시스템 메시지 타입별 설정
const messageConfig = {
  notice: {
    label: '공지',
    icon: '📢',
    linkText: '공지사항 보기',
    colors: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      badge: 'bg-yellow-200 text-yellow-800',
      secondary: 'text-yellow-600',
      hover: 'hover:bg-yellow-100',
    },
  },
  schedule: {
    label: '일정',
    icon: '📅',
    linkText: '자세히 보기',
    colors: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      badge: 'bg-blue-200 text-blue-800',
      secondary: 'text-blue-600',
      hover: 'hover:bg-blue-100',
    },
  },
} as const;

export function SystemMessage({ message, type }: SystemMessageProps) {
  const config = messageConfig[type];

  const handleClick = () => {
    if (message.link) {
      const typeText = type === 'notice' ? '공지사항' : '일정';
      alert(
        `${typeText} 상세보기: ${message.link}\n\n실제 구현에서는 해당 ${typeText} 페이지로 이동합니다.`,
      );
    }
  };

  return (
    <div className='flex justify-center my-3'>
      <div className='w-[90%]'>
        <div
          className={`p-4 ${config.colors.bg} ${config.colors.text} ${config.colors.border} border rounded-lg shadow-sm ${
            message.link
              ? `cursor-pointer ${config.colors.hover} transition-colors`
              : ''
          }`}
          onClick={handleClick}
        >
          <div className='flex items-center gap-2 mb-1'>
            <span
              className={`text-xs font-medium ${config.colors.badge} px-2 py-1 rounded-full`}
            >
              {config.label}
            </span>
            <span className={`text-xs ${config.colors.secondary}`}>
              {message.senderName}
            </span>
          </div>
          <div className='text-sm leading-relaxed mb-2'>{message.content}</div>
          {message.link && (
            <div className={`text-xs ${config.colors.secondary} mb-2`}>
              {config.icon} {config.linkText}
            </div>
          )}
        </div>

        {/* 시간 표시 */}
        <div className='flex justify-between items-center mt-1'>
          <div className={`text-xs ${config.colors.secondary}`}>
            {message.timestamp.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
