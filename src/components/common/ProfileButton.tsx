import React from 'react';
import { ChevronDown } from 'lucide-react';
import UserAvatar from './UserAvatar';
import type { AuthUser } from '@/stores/auth';

interface ProfileButtonProps {
  /** 사용자 정보 */
  user: AuthUser;
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 드롭다운 열림 상태 */
  isDropdownOpen: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
}

/**
 * 프로필 버튼 컴포넌트
 * - 사용자 아바타와 닉네임 표시
 * - 드롭다운 상태 표시
 * - 다양한 크기 지원
 */
const ProfileButton: React.FC<ProfileButtonProps> = ({
  user,
  size = 'md',
  isDropdownOpen,
  onClick,
}) => {
  // 크기별 클래스
  const sizeClasses = {
    sm: 'gap-2 px-3 py-1.5 text-sm',
    md: 'gap-3 px-4 py-2 text-sm',
    lg: 'gap-3 px-5 py-3 text-base',
  };

  const avatarSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center ${sizeClasses[size]} rounded-lg hover:bg-accent/50 transition-all duration-200 group border border-transparent hover:border-border/50 min-w-fit`}
    >
      <div className='relative flex-shrink-0'>
        <UserAvatar
          imageKey={user.imageKey}
          name={user.nickname}
          className={`${avatarSizes[size]} shadow-md border-2 border-background/50`}
        />
        {isDropdownOpen && (
          <div className='absolute inset-0 rounded-full bg-primary/20 border-2 border-primary/30' />
        )}
      </div>
      <span className='font-semibold text-foreground group-hover:text-accent-foreground transition-colors whitespace-nowrap min-w-0 flex-1 text-left'>
        {user.nickname}
      </span>
      <ChevronDown
        className={`${iconSizes[size]} text-muted-foreground transition-all duration-200 flex-shrink-0 ${
          isDropdownOpen
            ? 'rotate-180 text-primary'
            : 'group-hover:text-foreground'
        }`}
      />
    </button>
  );
};

export default ProfileButton;
