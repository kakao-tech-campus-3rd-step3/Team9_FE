import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface StudyCreateCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyTitle: string;
}

const StudyCreateCompleteModal: React.FC<StudyCreateCompleteModalProps> = ({
  isOpen,
  onClose,
  studyTitle,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      setIsCompleted(false);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* 모달 헤더 */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <h2 className='text-lg font-semibold text-foreground'>스터디 생성</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-6'>
          {!isCompleted ? (
            <div>
              <div className='mb-4'>
                <p className='text-sm text-foreground mb-4'>
                  <span className='font-medium'>{studyTitle}</span> 스터디
                  생성을 완료하시겠습니까?
                </p>
                <p className='text-xs text-muted-foreground'>
                  생성된 스터디는 스터디 탐색 페이지에서 확인할 수 있습니다.
                </p>
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors'
                >
                  취소
                </button>
                <button
                  type='button'
                  onClick={handleComplete}
                  className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors'
                >
                  생성 완료
                </button>
              </div>
            </div>
          ) : (
            <div className='text-center py-4'>
              <CheckCircle className='h-12 w-12 text-success mx-auto mb-4' />
              <p className='text-lg font-medium text-foreground mb-2'>
                스터디 생성이 완료되었습니다!
              </p>
              <p className='text-sm text-muted-foreground'>
                스터디 탐색 페이지로 이동합니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyCreateCompleteModal;
