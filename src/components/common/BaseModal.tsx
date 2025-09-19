/**
 * 기본 모달 컴포넌트
 * - 모든 모달의 공통 구조 및 동작 제공
 * - 오버레이, 닫기 버튼, ESC 키 처리 등
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  showCloseButton = true,
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 배경 클릭으로 모달 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full mx-4 max-h-[80vh] flex flex-col`}
      >
        {/* 모달 헤더 */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-6 border-b border-border'>
            {title && (
              <h2 className='text-lg font-semibold text-foreground'>{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            )}
          </div>
        )}

        {/* 모달 콘텐츠 */}
        <div className='flex-1 overflow-auto'>{children}</div>
      </div>
    </div>
  );
};

export default BaseModal;
