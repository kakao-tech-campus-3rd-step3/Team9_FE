import React, { useState } from 'react';
import { X } from 'lucide-react';

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

    // 3초 후 모달 닫기
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* 헤더 */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-lg font-semibold text-gray-900'>
            스터디 참여를 신청하시겠습니까?
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* 본문 */}
        <div className='p-6'>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  스터디장에게 할 말이 있다면 적어주세요.
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='스터디장에게 할 말이 있다면 적어주세요.'
                />
              </div>

              <div className='flex justify-end'>
                <button
                  type='submit'
                  className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  참여하기
                </button>
              </div>
            </form>
          ) : (
            <div className='text-center py-4'>
              <div className='text-green-600 mb-2'>
                <svg
                  className='w-12 h-12 mx-auto'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <p className='text-lg font-medium text-gray-900'>
                스터디 참여 신청이 완료되었습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyApplyModal;
