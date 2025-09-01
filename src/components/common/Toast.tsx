import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-green-600' />;
      case 'error':
        return <XCircle className='h-5 w-5 text-red-600' />;
      case 'info':
        return <Info className='h-5 w-5 text-blue-600' />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      <div
        className={`flex items-center p-4 rounded-lg border shadow-lg ${getBackgroundColor()}`}
      >
        <div className='flex-shrink-0 mr-3'>{getIcon()}</div>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-900'>{message}</p>
        </div>
        <button
          onClick={onClose}
          className='flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};

export default Toast;
