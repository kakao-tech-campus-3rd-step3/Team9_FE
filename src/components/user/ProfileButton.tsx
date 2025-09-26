import React from 'react';
import UserAvatar from './UserAvatar';
import type { AuthUser } from '@/stores/auth';

interface ProfileButtonProps {
  /** 사용자 정보 */
  user: AuthUser;
  /** 드롭다운 열림 상태 */
  isDropdownOpen: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 프로필 버튼 컴포넌트
 * - 사용자 아바타와 닉네임 표시
 * - 드롭다운 상태 표시
 */
const ProfileButton: React.FC<ProfileButtonProps> = ({
  user,
  isDropdownOpen,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors group border border-transparent hover:border-border min-w-fit w-full ${className}`}
    >
      <div className='relative flex-shrink-0'>
        <UserAvatar
          imageKey={user.imageKey}
          name={user.nickname}
          className='w-9 h-9 shadow-sm border-2 border-background'
        />
        {isDropdownOpen && (
          <div className='absolute inset-0 rounded-full bg-primary/20 border-2 border-primary ring-2 ring-primary/20' />
        )}
      </div>
      <span className='font-semibold text-foreground group-hover:text-accent-foreground transition-colors whitespace-nowrap min-w-0 flex-1 text-left'>
        {user.nickname}
      </span>
    </button>
  );
};

export default ProfileButton;
