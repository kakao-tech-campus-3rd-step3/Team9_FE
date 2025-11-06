import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
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

  // 모달이 닫힐 때 메시지 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setMessage('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studyId || !onApply) {
      console.error('스터디 ID 또는 신청 함수가 없습니다.');
      return;
    }

    // onApply는 Mutation.mutate를 호출
    // 성공/실패는 Mutation의 onSuccess/onError에서 처리됨
    // 성공 시 useStudyExplore에서 모달을 닫고 토스트를 표시함
    onApply(studyId, message);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title='스터디 신청'>
      <div className='p-6'>
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
              className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center space-x-2'
            >
              {isApplying ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>신청 중...</span>
                </>
              ) : (
                <span>참여하기</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default StudyApplyModal;
