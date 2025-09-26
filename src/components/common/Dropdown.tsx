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

  const defaultOffsetClass = position === 'top' ? 'mb-1' : 'mt-2';
  const positionClass =
    position === 'top'
      ? `bottom-full ${offsetClass ?? defaultOffsetClass}`
      : `top-full ${offsetClass ?? defaultOffsetClass}`;
  const alignClass = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className='relative w-full' ref={dropdownRef}>
      <div onClick={() => onOpenChange(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute ${positionClass} ${alignClass} min-w-[12rem] max-w-full w-full bg-background border-2 border-border rounded-md backdrop-blur-sm z-[9999]`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
