import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface StudyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyTitle: string;
}

const StudyApplyModal: React.FC<StudyApplyModalProps> = ({
  isOpen,
  onClose,
  studyTitle,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('스터디 신청:', { studyTitle, message });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
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
                <label className='block text-sm font-medium text-foreground mb-2'>
                  스터디장에게 할 말이 있다면 적어주세요
                </label>
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
                  className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors'
                >
                  참여하기
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
      </div>
    </div>
  );
};

export default StudyApplyModal;
