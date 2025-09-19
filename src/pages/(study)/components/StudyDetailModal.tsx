import React from 'react';
import { X, Users, MapPin, Clock } from 'lucide-react';

interface Study {
  id: number;
  title: string;
  description: string;
  category: string;
  currentMembers: number;
  maxMembers: number;
  region: string;
  imageUrl?: string;
  detailedDescription?: string;
  schedule?: string;
  duration?: string;
  requirements?: string[];
}

interface StudyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  study: Study | null;
  onApply: (study: Study) => void;
}

const StudyDetailModal: React.FC<StudyDetailModalProps> = ({
  isOpen,
  onClose,
  study,
  onApply,
}) => {
  if (!isOpen || !study) return null;

  const handleApplyClick = () => {
    onApply(study);
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* 모달 헤더 */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <h2 className='text-xl font-semibold text-foreground'>
            스터디 상세 정보
          </h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='p-6'>
          {/* 스터디 이미지 및 기본 정보 */}
          <div className='mb-6'>
            <div className='w-full h-48 bg-primary-light rounded-lg mb-4 flex items-center justify-center'>
              <div className='w-16 h-16 bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-primary-foreground text-2xl font-bold'>
                  {study.title.charAt(0)}
                </span>
              </div>
            </div>

            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='text-2xl font-bold text-foreground mb-2'>
                  {study.title}
                </h3>
                <p className='text-muted-foreground mb-3'>
                  {study.description}
                </p>
              </div>
              <div className='flex items-center text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full'>
                <Users className='h-4 w-4 mr-1' />
                <span>
                  {study.currentMembers}/{study.maxMembers}
                </span>
              </div>
            </div>

            <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
              <div className='flex items-center'>
                <MapPin className='h-4 w-4 mr-1' />
                <span>{study.region}</span>
              </div>
              <div className='flex items-center'>
                <span className='bg-accent px-2 py-1 rounded text-xs'>
                  {study.category}
                </span>
              </div>
              <div className='flex items-center'>
                <Clock className='h-4 w-4 mr-1' />
                <span>{study.schedule || '매주 토요일 오후 2시'}</span>
              </div>
            </div>
          </div>

          {/* 스터디 설명 */}
          <div className='mb-6'>
            <h4 className='text-lg font-semibold text-foreground mb-3'>
              스터디 설명
            </h4>
            <div className='bg-accent/30 p-4 rounded-lg'>
              <p className='text-foreground leading-relaxed'>
                {study.detailedDescription ||
                  `미시경제학의 기본 개념부터 응용 문제까지 깊이 파고드는 스터디입니다. 
                  각자 예습한 내용을 공유하고, 토론하며 어려운 이론도 함께 해결해 나갑니다. 
                  복습과 퀴즈로 이해도를 높여 학기 성적과 실무 감각을 동시에 잡는 것을 목표로 합니다.`}
              </p>
            </div>
          </div>

          {/* 참여 조건 */}
          <div className='mb-6'>
            <h4 className='text-lg font-semibold text-foreground mb-3'>
              참여 조건
            </h4>
            <div className='space-y-2'>
              {(
                study.requirements || [
                  '해당 분야에 대한 기본적인 관심',
                  '정기적인 참여 가능',
                  '적극적인 소통과 협력',
                ]
              ).map((requirement, index) => (
                <div key={index} className='flex items-start text-sm'>
                  <span className='text-primary mr-2'>•</span>
                  <span className='text-foreground'>{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className='flex justify-end space-x-3 pt-4 border-t border-border'>
            <button
              onClick={onClose}
              className='px-6 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors'
            >
              닫기
            </button>
            <button
              onClick={handleApplyClick}
              className='px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors'
            >
              참여하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyDetailModal;
