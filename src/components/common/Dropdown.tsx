import React, { useRef, useEffect, type ReactNode } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  position?: 'top' | 'bottom';
  align?: 'left' | 'right';
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

  const positionClass =
    position === 'top' ? 'bottom-full mb-1' : 'top-full mt-2';
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
