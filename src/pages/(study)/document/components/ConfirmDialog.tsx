import { AlertTriangle } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 확인 다이얼로그 컴포넌트
 */
function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    const iconClass =
      type === 'danger'
        ? 'text-destructive'
        : type === 'warning'
          ? 'text-yellow-500'
          : 'text-primary';
    return <AlertTriangle className={`w-8 h-8 ${iconClass}`} />;
  };

  const getConfirmButtonStyle = () => {
    const styles = {
      danger:
        'bg-destructive text-destructive-foreground hover:bg-destructive-hover',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
      info: 'bg-primary text-primary-foreground hover:bg-primary-hover',
    };
    return styles[type] || styles.info;
  };

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className='bg-background rounded-xl shadow-2xl w-full max-w-lg border border-border'
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className='flex items-center gap-4 p-6 border-b border-border'>
          <div className='flex-shrink-0'>{getIcon()}</div>
          <h2 className='text-xl font-bold text-foreground'>{title}</h2>
        </div>

        {/* 내용 */}
        <div className='p-6'>
          <p className='text-base text-muted-foreground leading-relaxed'>
            {message}
          </p>
        </div>

        {/* 버튼 */}
        <div className='flex justify-end gap-3 p-6 border-t border-border bg-muted/20'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className={cn(
              'px-6 py-3 text-base text-muted-foreground hover:text-foreground',
              'transition-colors rounded-lg hover:bg-accent font-semibold',
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className={cn(
              'px-6 py-3 text-base rounded-lg transition-colors font-semibold',
              getConfirmButtonStyle(),
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
