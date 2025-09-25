import React, { type ReactNode } from 'react';

interface DropdownMenuItem {
  /** 메뉴 아이템 아이콘 */
  icon?: ReactNode;
  /** 메뉴 아이템 텍스트 */
  label: string;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 위험한 액션 여부 (로그아웃 등) */
  destructive?: boolean;
}

interface DropdownMenuProps {
  /** 사용자 정보 표시 여부 */
  showUserInfo?: boolean;
  /** 사용자 닉네임 */
  nickname?: string;
  /** 현재 스터디 제목 */
  currentStudyTitle?: string;
  /** 메뉴 아이템들 */
  items: DropdownMenuItem[];
}

/**
 * 드롭다운 메뉴 컴포넌트
 * - 일관된 스타일의 드롭다운 메뉴
 * - 사용자 정보 표시 옵션
 * - 아이콘과 텍스트가 있는 메뉴 아이템
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  showUserInfo = false,
  nickname,
  currentStudyTitle,
  items,
}) => {
  return (
    <div className='py-2'>
      {/* 사용자 정보 섹션 */}
      {showUserInfo && nickname && (
        <div className='px-4 py-3 border-b border-border/50 bg-muted/30'>
          <p className='text-sm font-semibold text-foreground'>{nickname}</p>
          {currentStudyTitle && (
            <p className='text-xs text-muted-foreground mt-0.5'>
              {currentStudyTitle}
            </p>
          )}
        </div>
      )}

      {/* 메뉴 아이템들 */}
      <div className='py-1'>
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              item.destructive
                ? 'text-destructive hover:bg-destructive/10 hover:text-destructive'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <span
              className={`flex-shrink-0 ${item.destructive ? 'text-destructive' : 'text-muted-foreground'}`}
            >
              {item.icon}
            </span>
            <span className='text-left'>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
