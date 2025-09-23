import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface StudyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyTitle: string;
  studyId: number;
  onApply: (studyId: number, message: string) => void;
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

  // 모달이 열릴 때마다 상태 리셋
  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(studyId, message);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* 모달 헤더 */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <h2 className='text-lg font-semibold text-foreground'>스터디 신청</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-6'>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <p className='text-sm text-foreground mb-4'>
                  <span className='font-medium'>{studyTitle}</span> 스터디
                  참여를 신청하시겠습니까?
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='스터디장에게 할 말이 있다면 적어주세요.'
                  rows={4}
                  className='w-full px-3 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground resize-none'
                  disabled={isApplying}
                />
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={onClose}
                  disabled={isApplying}
                  className='px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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
              <button
                onClick={onClose}
                className='mt-4 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors'
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyApplyModal;
