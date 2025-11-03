import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import BaseModal from '@/components/common/BaseModal';

interface StudyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyTitle: string;
  studyId?: number;
  onApply?: (studyId: number, message: string) => void;
  isApplying?: boolean;
}

const StudyApplyModal: React.FC<StudyApplyModalProps> = ({
  isOpen,
  onClose,
  studyTitle,
  studyId,
  onApply,
  isApplying = false,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 모달이 닫힐 때 메시지 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // studyId와 onApply가 있으면 실제 API 호출
    if (studyId && onApply) {
      onApply(studyId, message);
      setIsSubmitted(true);
      // API 호출 완료 후 모달 닫기 (성공/실패는 onApply 내부에서 처리)
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } else {
      // 개발용: API 연결이 안 된 경우
      console.log('스터디 신청:', { studyTitle, message });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title='스터디 신청'>
      <div className='p-6'>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <p className='text-sm text-foreground mb-4'>
                <span className='font-medium'>{studyTitle}</span> 스터디 참여를
                신청하시겠습니까?
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='스터디장에게 할 말이 있다면 적어주세요.'
                rows={4}
                className='w-full px-3 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground resize-none'
              />
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
                type='submit'
                disabled={isApplying}
                className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isApplying ? '신청 중...' : '참여하기'}
              </button>
            </div>
          </form>
        ) : (
          <div className='text-center py-4'>
            <CheckCircle className='h-12 w-12 text-success mx-auto mb-4' />
            <p className='text-lg font-medium text-foreground mb-2'>
              신청이 완료되었습니다!
            </p>
            <p className='text-sm text-muted-foreground'>
              스터디장의 승인을 기다려주세요.
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default StudyApplyModal;
