import React, { useRef, useEffect, type ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  position?: 'top' | 'bottom';
  align?: 'left' | 'right';
  /** position에 따른 기본 간격을 덮어쓸 수 있는 클래스 (예: mt-4, mb-2) */
  offsetClass?: string;
  onClose?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

/**
 * 드롭다운 컴포넌트
 */
const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  position = 'bottom',
  align = 'right',
  offsetClass,
  onClose,
  isOpen,
  onOpenChange,
  children,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onOpenChange, onClose]);

  const defaultOffsetClass = position === 'top' ? 'mb-0' : 'mt-2';
  const positionClass =
    position === 'top'
      ? `bottom-full ${offsetClass ?? defaultOffsetClass}`
      : `top-full ${offsetClass ?? defaultOffsetClass}`;
  const alignClass = align === 'left' ? 'left-0' : 'right-0';

  // trigger가 클릭 가능한 요소인지 확인하고 onClick 핸들러 추가
  const handleTriggerClick = () => {
    onOpenChange(!isOpen);
  };

  // trigger가 이미 클릭 가능한 요소인 경우, div로 감싸고 클릭 이벤트 처리
  const triggerElement = React.isValidElement(trigger) ? (
    React.cloneElement(
      trigger as React.ReactElement<{
        onClick?: (e: React.MouseEvent) => void;
      }>,
      {
        onClick: (e: React.MouseEvent) => {
          // 기존 onClick 핸들러가 있다면 호출
          const originalOnClick = (
            trigger as React.ReactElement<{
              onClick?: (e: React.MouseEvent) => void;
            }>
          ).props?.onClick;
          if (originalOnClick) {
            originalOnClick(e);
          }
          handleTriggerClick();
        },
      },
    )
  ) : (
    <div onClick={handleTriggerClick} className='w-full cursor-pointer'>
      {trigger}
    </div>
  );

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <div
        onClick={() => onOpenChange(!isOpen)}
        className='w-full'
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenChange(!isOpen);
          }
        }}
        aria-haspopup='menu'
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${positionClass} ${alignClass} min-w-[12rem] w-full bg-background border-2 border-border rounded-md backdrop-blur-sm shadow-lg z-[9999]`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
