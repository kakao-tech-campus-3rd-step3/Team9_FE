import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, CheckCircle } from 'lucide-react';
import { studyExploreService } from '../explore/services';

interface StudyApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyTitle: string;
  studyId: number;
}

const StudyApplyModal: React.FC<StudyApplyModalProps> = ({
  isOpen,
  onClose,
  studyTitle,
  studyId,
}) => {
  const [message, setMessage] = useState('');

  // React Query로 스터디 신청
  const applyMutation = useMutation({
    mutationFn: async (applyMessage: string) => {
      return studyExploreService.applyStudy({
        study_id: studyId,
        message: applyMessage,
      });
    },
    onSuccess: () => {
      console.log('스터디 신청 성공');
      // 성공 상태는 UI에서 처리
    },
    onError: (error) => {
      console.error('스터디 신청 실패:', error);
      // 에러는 기존 apiClient에서 토스트로 처리됨
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate(message);
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
          {!applyMutation.isSuccess ? (
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
                  disabled={applyMutation.isPending}
                />
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={onClose}
                  disabled={applyMutation.isPending}
                  className='px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  취소
                </button>
                <button
                  type='submit'
                  disabled={applyMutation.isPending}
                  className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {applyMutation.isPending ? '신청 중...' : '참여하기'}
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
