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
        return <CheckCircle className='h-5 w-5 text-white' />;
      case 'error':
        return <XCircle className='h-5 w-5 text-white' />;
      case 'info':
        return <Info className='h-5 w-5 text-white' />;
      default:
        return <CheckCircle className='h-5 w-5 text-white' />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white border-emerald-500';
      case 'error':
        return 'bg-red-500 text-white border-red-500';
      case 'info':
        return 'bg-blue-500 text-white border-blue-500';
      default:
        return 'bg-emerald-500 text-white border-emerald-500';
    }
  };

  return (
    <div className='fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-300'>
      <div
        className={`flex items-center p-4 rounded-xl border shadow-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-105 ${getBackgroundColor()}`}
      >
        <div className='flex-shrink-0 mr-3'>{getIcon()}</div>
        <div className='flex-1'>
          <p className='text-sm font-medium text-white'>{message}</p>
        </div>
        <button
          onClick={onClose}
          className='flex-shrink-0 ml-3 text-white hover:text-gray-200 transition-colors'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};

export default Toast;
