import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuthStatus, useLogoutMutation } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { ROUTES } from '@/constants';
import Dropdown from '../common/Dropdown';
import ProfileButton from './ProfileButton';
import UserAvatar from './UserAvatar';

interface UserProfileSectionProps {
  // 컴포넌트 사용 위치에 따른 스타일 변형
  variant?: 'header' | 'study-sidebar';
  // 모바일 메뉴 닫기 콜백 (헤더 모바일 메뉴에서 사용)
  onMobileMenuClose?: () => void;
}

/**
 * 사용자 프로필 섹션 컴포넌트
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

  // 로딩 상태
  if (isAuthLoading) {
    return (
      <div
        className={`flex items-center ${variant === 'study-sidebar' ? 'gap-3 p-4' : 'gap-2 px-3 py-2'}`}
      >
        <div
          className={`${variant === 'study-sidebar' ? 'w-10 h-10' : 'w-8 h-8'} bg-muted rounded-full animate-pulse`}
        />
        <div className={variant === 'study-sidebar' ? 'flex-1' : ''}>
          <div
            className={`${variant === 'study-sidebar' ? 'h-4 mb-1' : 'h-4'} bg-muted rounded-md animate-pulse`}
          />
          {variant === 'study-sidebar' && (
            <div className='h-3 bg-muted rounded-md animate-pulse w-2/3' />
          )}
        </div>
      </div>
    );
  }

  // 비로그인 상태
  if (!isAuthenticated) {
    const loginButton = (
      <Link
        to={ROUTES.LOGIN}
        className={`flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors font-medium ${
          variant === 'study-sidebar' ? 'w-full px-4 py-2.5' : 'px-3 py-2'
        }`}
        onClick={onMobileMenuClose}
      >
        로그인
      </Link>
    );

    return variant === 'study-sidebar' ? (
      <div className='p-4'>{loginButton}</div>
    ) : (
      loginButton
    );
  }

  // 드롭다운 메뉴 아이템
  const menuItems = [
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

  // 사용자 정보 섹션 (인라인으로 단순화)
  const UserInfo = () => (
    <div className='px-4 py-3 border-b border-border bg-muted/50'>
      <p className='text-sm font-semibold text-foreground'>{user.nickname}</p>
      {user.currentStudy && (
        <p className='text-xs text-muted-foreground mt-1'>
          {user.currentStudy.title}
        </p>
      )}
    </div>
  );

  // 메뉴 아이템 렌더링
  const MenuItems = () => (
    <div className='p-1'>
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            item.destructive
              ? 'text-destructive hover:bg-destructive/10'
              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <span
            className={`flex-shrink-0 w-4 h-4 ${
              item.destructive ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {item.icon}
          </span>
          <span className='text-left flex-1'>{item.label}</span>
        </button>
      ))}
    </div>
  );

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
          <button className='flex items-center gap-3 p-4 w-full hover:bg-accent transition-colors group border-t border-border'>
            <div className='relative'>
              <UserAvatar
                imageKey={user.imageKey}
                name={user.nickname}
                className='w-10 h-10 shadow-sm border-2 border-background'
              />
              {isDropdownOpen && (
                <div className='absolute inset-0 rounded-full bg-primary/20 border-2 border-primary ring-2 ring-primary/20' />
              )}
            </div>
            <div className='flex-1 text-left min-w-0'>
              <p className='text-sm font-semibold text-foreground truncate group-hover:text-accent-foreground transition-colors'>
                {user.nickname}
              </p>
              {user.currentStudy && (
                <p className='text-xs text-muted-foreground truncate mt-1'>
                  {user.currentStudy.title}
                </p>
              )}
            </div>
          </button>
        }
      >
        <UserInfo />
        <MenuItems />
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
          isDropdownOpen={isDropdownOpen}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
      }
    >
      <UserInfo />
      <MenuItems />
    </Dropdown>
  );
};

export default UserProfileSection;
