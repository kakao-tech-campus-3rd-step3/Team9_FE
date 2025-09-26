import React, { useState, useRef, useEffect, type ReactNode } from 'react';

interface DropdownMenuItem {
  // 메뉴 아이템 아이콘
  icon?: ReactNode;
  // 메뉴 아이템 텍스트
  label: string;
  // 클릭 핸들러
  onClick: () => void;
  // 위험한 액션 여부 (로그아웃 등)
  destructive?: boolean;
}

interface DropdownProps {
  // 드롭다운 트리거 버튼
  trigger: ReactNode;
  // 드롭다운 위치
  position?: 'top' | 'bottom';
  // 드롭다운 정렬
  align?: 'left' | 'right';
  // 외부 클릭 시 닫기 콜백
  onClose?: () => void;
  // 드롭다운 열림 상태
  isOpen?: boolean;
  // 드롭다운 열림 상태 변경 콜백
  onOpenChange?: (open: boolean) => void;
  // 메뉴 아이템들
  items?: DropdownMenuItem[];
  // 사용자 정의 메뉴 내용 (items보다 우선)
  children?: ReactNode;
}

/**
 * 드롭다운 컴포넌트
 */
const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  position = 'bottom',
  align = 'right',
  onClose,
  isOpen: controlledIsOpen,
  onOpenChange,
  items = [],
  children,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setIsOpen, onClose]);

  const positionClass =
    position === 'top' ? 'bottom-full mb-1' : 'top-full mt-2';
  const alignClass = align === 'left' ? 'left-0' : 'right-0';

  const renderMenuContent = () => {
    if (children) {
      return children;
    }

    return (
      <div className='py-2'>
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

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute ${positionClass} ${alignClass} min-w-[12rem] max-w-full w-full bg-background border border-border rounded-lg shadow-xl backdrop-blur-sm z-[9999]`}
          style={{
            boxShadow:
              '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          }}
        >
          {renderMenuContent()}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
export type { DropdownMenuItem };
