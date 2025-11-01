import { getNameInitials, getNameBasedColor } from '../../../utils/avatar';
import { formatKoreanTime } from '../utils/timeUtils';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

// 메시지 풍선 컴포넌트
function MessageBubble({
  content,
  isOwn,
}: {
  content: string;
  isOwn: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-2xl ${
        isOwn
          ? 'bg-primary text-primary-foreground rounded-tr-md'
          : 'bg-muted text-foreground rounded-tl-md'
      }`}
    >
      <div className='text-sm leading-relaxed'>{content}</div>
    </div>
  );
}

// 반응 수 컴포넌트
function ReactionCount({
  likeCount,
  dislikeCount,
}: {
  likeCount?: number;
  dislikeCount?: number;
}) {
  const hasReactions = (likeCount ?? 0) >= 1 || (dislikeCount ?? 0) >= 1;

  if (!hasReactions) return null;

  return (
    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
      {(likeCount ?? 0) >= 1 && (
        <span className='flex items-center gap-1'>👍 {likeCount}</span>
      )}
      {(dislikeCount ?? 0) >= 1 && (
        <span className='flex items-center gap-1'>👎 {dislikeCount}</span>
      )}
    </div>
  );
}

// 시간 표시 컴포넌트
function MessageTime({ timestamp }: { timestamp: Date }) {
  return (
    <div className='text-xs text-muted-foreground'>
      <span>{formatKoreanTime(timestamp)}</span>
    </div>
  );
}

// 프로필 이미지 컴포넌트
function ProfileImage({ senderName }: { senderName: string }) {
  return (
    <div className='flex-shrink-0 mr-2'>
      <div
        className={`w-8 h-8 rounded-full ${getNameBasedColor(senderName)} flex items-center justify-center text-xs font-medium text-white`}
      >
        {getNameInitials(senderName)}
      </div>
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} my-3`}
    >
      {message.isOwn ? (
        // 본인 메시지 - 단순한 구조
        <div className='max-w-[80%]'>
          <div className='flex flex-col'>
            <MessageBubble content={message.content} isOwn={message.isOwn} />

            {/* 시간과 반응 수 - 메시지 하단에 표시 (opacity 제거) */}
            <div className='flex items-center justify-between mt-1'>
              <ReactionCount
                likeCount={message.likeCount}
                dislikeCount={message.dislikeCount}
              />
              <MessageTime timestamp={message.timestamp} />
            </div>
          </div>
        </div>
      ) : (
        // 타인 메시지 - 프로필 이미지와 함께
        <div className='flex flex-row max-w-[80%]'>
          <ProfileImage senderName={message.senderName} />

          {/* 메시지 컨테이너 - 세로 배치 */}
          <div className='flex flex-col flex-1'>
            {/* 발신자 이름 */}
            <div className='mb-1'>
              <span className='text-sm font-medium text-foreground'>
                {message.senderName}
              </span>
            </div>

            <MessageBubble content={message.content} isOwn={message.isOwn} />

            {/* 시간과 반응 수 - 메시지 하단에 표시 (opacity 제거) */}
            <div className='flex items-center justify-between mt-1'>
              <MessageTime timestamp={message.timestamp} />
              <ReactionCount
                likeCount={message.likeCount}
                dislikeCount={message.dislikeCount}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
