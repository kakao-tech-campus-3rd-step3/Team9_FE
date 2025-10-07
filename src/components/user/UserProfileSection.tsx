import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuthStatus, useLogoutMutation } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { ROUTES } from '@/constants';
import { getStudyRoleLabel, getRoleColorClass } from '@/utils';
import Dropdown from '../common/Dropdown';
import { SimpleSkeleton } from '@/components/common';
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
  const location = useLocation();

  // 스터디 페이지인지 확인 (스터디 페이지에서만 역할 표시)
  const isStudyPage =
    location.pathname.startsWith(`/${ROUTES.STUDY.ROOT}/`) &&
    !location.pathname.includes(`/${ROUTES.STUDY.EXPLORE}`);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logoutMutation.mutate();
    setIsDropdownOpen(false);
    onMobileMenuClose?.();
  };

  // 프로필 관리 핸들러
  const handleProfileManage = () => {
    // TODO: 마이페이지로 이동 라우팅 연결
    setIsDropdownOpen(false);
    onMobileMenuClose?.();
  };

  // 설정 이동 핸들러
  const handleOpenSettings = () => {
    // TODO: 설정 페이지로 이동 라우팅 연결
    setIsDropdownOpen(false);
    onMobileMenuClose?.();
  };

  // 로딩 상태 (Suspense가 처리하므로 기본적인 로딩만 처리)
  if (isAuthLoading) {
    return (
      <div className={`${variant === 'study-sidebar' ? 'px-4 py-3' : ''}`}>
        <div className='flex items-center gap-3'>
          <div className='relative flex-shrink-0'>
            <SimpleSkeleton
              height='h-10'
              width='w-10'
              className='rounded-full'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <SimpleSkeleton height='h-4' width='w-1/3' />
          </div>
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

    return variant === 'study-sidebar' ? loginButton : loginButton;
  }

  // 드롭다운 메뉴 아이템 (마이페이지 / 설정 / 로그아웃)
  const menuItems = [
    {
      icon: <User className='w-4 h-4' />,
      label: '마이페이지',
      onClick: handleProfileManage,
    },
    {
      icon: <Settings className='w-4 h-4' />,
      label: '설정',
      onClick: handleOpenSettings,
    },
    {
      icon: <LogOut className='w-4 h-4' />,
      label: '로그아웃',
      onClick: handleLogout,
      destructive: true,
    },
  ];

  // 통합된 프로필 버튼 컴포넌트
  const ProfileTrigger = () => {
    const isHeader = variant === 'header';
    const avatarSize = isHeader ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-sm';
    const baseTrigger =
      'flex items-center gap-3 text-sm rounded-lg transition-all duration-200 group w-full';
    const triggerPadding = 'px-4 py-3';
    const triggerBg = isHeader
      ? 'hover:bg-secondary/90 min-w-0'
      : 'rounded-none';
    const triggerOpenBg = isHeader
      ? isDropdownOpen
        ? 'bg-accent/30 border-border/50'
        : ''
      : isDropdownOpen
        ? 'bg-secondary/90'
        : '';

    return (
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`${baseTrigger} ${triggerPadding} ${triggerBg} ${triggerOpenBg}`}
      >
        <div className='relative flex-shrink-0'>
          <UserAvatar
            imageKey={user.imageKey}
            name={user.nickname}
            className={`${avatarSize} ${isDropdownOpen ? 'ring-2 ring-primary/30' : ''}`}
          />
        </div>

        <div className='flex items-center justify-between min-w-0 flex-1 text-left'>
          <span className='font-medium text-foreground group-hover:text-accent-foreground transition-colors leading-tight text-sm'>
            {user.nickname}
          </span>
          {isStudyPage && user.currentStudy && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getRoleColorClass(user.currentStudy.role)} flex-shrink-0`}
            >
              {getStudyRoleLabel(user.currentStudy.role)}
            </span>
          )}
        </div>
      </button>
    );
  };

  // 메뉴 아이템 렌더링 (개선된 디자인)
  const MenuItems = () => (
    <div className=''>
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent/50 ${
            item.destructive
              ? 'text-destructive hover:text-destructive hover:bg-destructive/5'
              : 'text-foreground hover:text-accent-foreground'
          }`}
        >
          <span
            className={`flex-shrink-0 w-4 h-4 transition-colors ${
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

  // 드롭다운 설정
  const isHeader = variant === 'header';
  const dropdownPosition = isHeader ? 'bottom' : ('top' as const);
  const dropdownAlign = isHeader ? 'right' : ('left' as const);
  const dropdownOffset = isHeader ? 'mt-4' : 'mb-1';

  return (
    <Dropdown
      position={dropdownPosition}
      align={dropdownAlign}
      offsetClass={dropdownOffset}
      isOpen={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      onClose={onMobileMenuClose}
      trigger={<ProfileTrigger />}
    >
      <MenuItems />
    </Dropdown>
  );
};

export default UserProfileSection;
