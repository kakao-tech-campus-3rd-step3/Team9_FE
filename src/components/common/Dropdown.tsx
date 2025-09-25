import React, { useState, useRef, useEffect, type ReactNode } from 'react';

interface DropdownProps {
  /** 드롭다운 트리거 버튼 */
  trigger: ReactNode;
  /** 드롭다운 메뉴 내용 */
  children: ReactNode;
  /** 드롭다운 위치 */
  position?: 'top' | 'bottom';
  /** 드롭다운 정렬 */
  align?: 'left' | 'right';
  /** 외부 클릭 시 닫기 콜백 */
  onClose?: () => void;
  /** 드롭다운 열림 상태 */
  isOpen?: boolean;
  /** 드롭다운 열림 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 범용 드롭다운 컴포넌트
 * - 재사용 가능한 드롭다운 UI
 * - 위치와 정렬 옵션 지원
 * - 외부 클릭 시 자동 닫기
 */
const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  position = 'bottom',
  align = 'right',
  onClose,
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // controlled 또는 uncontrolled 모드
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  // 외부 클릭 시 닫기
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

  // 위치별 클래스
  const positionClass =
    position === 'top' ? 'bottom-full mb-1' : 'top-full mt-2';
  const alignClass = align === 'left' ? 'left-0' : 'right-0';

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
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
