import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuthStatus, useLogoutMutation } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { ROUTES } from '@/constants';
import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import ProfileButton from './ProfileButton';
import UserAvatar from './UserAvatar';

interface UserProfileSectionProps {
  /** 컴포넌트 사용 위치에 따른 스타일 변형 */
  variant?: 'header' | 'study-sidebar';
  /** 모바일 메뉴 닫기 콜백 (헤더 모바일 메뉴에서 사용) */
  onMobileMenuClose?: () => void;
}

/**
 * 범용 사용자 프로필 섹션 컴포넌트
 * - 로그인 상태에 따라 로그인 버튼 또는 사용자 프로필 표시
 * - 프로필 드롭다운 메뉴 지원 (로그아웃 포함)
 * - variant를 통해 헤더/스터디 사이드바에서 재사용 가능
 */
const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  variant = 'header',
  onMobileMenuClose,
}) => {
  const { isAuthenticated, isAuthLoading } = useAuthStatus();
  const { user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logoutMutation = useLogoutMutation();

  // 로그아웃 핸들러
  const handleLogout = () => {
    logoutMutation.mutate();
    setIsDropdownOpen(false);
    onMobileMenuClose?.();
  };

  // 프로필 관리 핸들러
  const handleProfileManage = () => {
    // TODO: 프로필 페이지로 이동 구현
    setIsDropdownOpen(false);
    onMobileMenuClose?.();
  };

  // 로딩 중일 때
  if (isAuthLoading) {
    if (variant === 'study-sidebar') {
      return (
        <div className='flex items-center gap-3 p-3'>
          <div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
          <div className='flex-1'>
            <div className='h-4 bg-muted rounded animate-pulse mb-1' />
            <div className='h-3 bg-muted rounded animate-pulse w-2/3' />
          </div>
        </div>
      );
    }
    return (
      <div className='flex items-center gap-2 px-3 py-2'>
        <div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
        <div className='h-4 bg-muted rounded animate-pulse w-20' />
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!isAuthenticated) {
    if (variant === 'study-sidebar') {
      return (
        <div className='p-3'>
          <Link
            to={ROUTES.LOGIN}
            className='flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
            onClick={onMobileMenuClose}
          >
            로그인
          </Link>
        </div>
      );
    }
    return (
      <Link
        to={ROUTES.LOGIN}
        className='flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
      >
        로그인
      </Link>
    );
  }

  // 드롭다운 메뉴 아이템들
  const dropdownItems = [
    {
      icon: <User className='w-4 h-4' />,
      label: '프로필 관리',
      onClick: handleProfileManage,
    },
    {
      icon: <LogOut className='w-4 h-4' />,
      label: '로그아웃',
      onClick: handleLogout,
      destructive: true,
    },
  ];

  // 스터디 사이드바 variant
  if (variant === 'study-sidebar') {
    return (
      <Dropdown
        position='top'
        align='left'
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        onClose={onMobileMenuClose}
        trigger={
          <button className='flex items-center gap-3 p-4 w-full hover:bg-accent/50 transition-all duration-200 group border-t border-border/50'>
            <div className='relative'>
              <UserAvatar
                imageKey={user.imageKey}
                name={user.nickname}
                className='w-10 h-10 shadow-md border border-background/50'
              />
              {isDropdownOpen && (
                <div className='absolute inset-0 rounded-full bg-primary/20 border-2 border-primary/30' />
              )}
            </div>
            <div className='flex-1 text-left min-w-0'>
              <p className='text-sm font-semibold text-foreground truncate group-hover:text-accent-foreground transition-colors'>
                {user.nickname}
              </p>
              {user.currentStudy && (
                <p className='text-xs text-muted-foreground truncate mt-0.5'>
                  {user.currentStudy.title}
                </p>
              )}
            </div>
          </button>
        }
      >
        <DropdownMenu
          showUserInfo
          nickname={user.nickname}
          currentStudyTitle={user.currentStudy?.title}
          items={dropdownItems}
        />
      </Dropdown>
    );
  }

  // 헤더 variant
  return (
    <Dropdown
      position='bottom'
      align='right'
      isOpen={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      trigger={
        <ProfileButton
          user={user}
          size='md'
          isDropdownOpen={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
      }
    >
      <DropdownMenu
        showUserInfo={true}
        nickname={user.nickname}
        currentStudyTitle={user.currentStudy?.title}
        items={dropdownItems}
      />
    </Dropdown>
  );
};

export default UserProfileSection;
