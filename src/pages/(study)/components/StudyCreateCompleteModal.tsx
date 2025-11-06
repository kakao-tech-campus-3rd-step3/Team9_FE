import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/BaseModal';

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
    // 토스트 메시지 표시
    toast.success('스터디가 성공적으로 생성되었습니다!');

    setIsCompleted(true);
    setTimeout(() => {
      setIsCompleted(false);
      onClose();
    }, 3000);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title='스터디 생성'>
      <div className='p-6'>
        {!isCompleted ? (
          <div>
            <div className='mb-4'>
              <p className='text-sm text-foreground mb-4'>
                <span className='font-medium'>{studyTitle}</span> 스터디 생성을
                완료하시겠습니까?
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
    </BaseModal>
  );
};

export default StudyCreateCompleteModal;
