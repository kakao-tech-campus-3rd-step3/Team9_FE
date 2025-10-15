import React, { useState, useEffect } from 'react';
import { Users, MapPin, Clock } from 'lucide-react';
import BaseModal from '@/components/common/BaseModal';
import { downloadImageService } from '@/services/images/downloadImage';

interface Study {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  interests?: string[]; // 여러 카테고리/관심사
  currentMembers: number;
  maxMembers: number;
  region: string;
  imageUrl?: string;
  imageKey?: string; // 이미지 키 (API에서 사용)
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // 이미지 로드 로직
  useEffect(() => {
    const loadImage = async () => {
      if (!study) return;

      // 1. imageUrl이 있으면 바로 사용 (개발용)
      if (study.imageUrl) {
        setImageUrl(study.imageUrl);
        return;
      }

      // 2. imageKey가 있으면 API에서 presigned URL 가져오기 (실제 서비스용)
      if (study.imageKey) {
        setImageLoading(true);
        try {
          const presignedUrl = await downloadImageService.getImagePresignedUrl(
            study.imageKey,
          );
          if (presignedUrl) {
            setImageUrl(presignedUrl);
          }
        } catch (error) {
          console.error('이미지 로드 실패:', error);
        } finally {
          setImageLoading(false);
        }
      }
    };

    loadImage();
  }, [study?.imageKey, study?.imageUrl]);

  if (!study) return null;

  const handleApplyClick = () => {
    onApply(study);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='스터디 상세 정보'
      maxWidth='max-w-4xl'
    >
      <div className='p-6'>
        {/* 스터디 이미지 및 기본 정보 */}
        <div className='mb-6'>
          <div className='w-full h-48 bg-primary-light rounded-lg mb-4 flex items-center justify-center overflow-hidden'>
            {imageLoading ? (
              <div className='w-16 h-16 bg-primary rounded-lg flex items-center justify-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground'></div>
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={study.title}
                className='w-full h-full object-cover rounded-lg'
                onError={() => {
                  // 이미지 로드 실패 시 URL 초기화하여 아이콘 표시
                  setImageUrl(null);
                }}
              />
            ) : (
              <div className='w-16 h-16 bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-primary-foreground text-2xl font-bold'>
                  {study.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='text-2xl font-bold text-foreground mb-2'>
                {study.title}
              </h3>
              <p className='text-muted-foreground mb-3'>{study.description}</p>
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
            <div className='flex items-center space-x-2'>
              {study.interests && study.interests.length > 0 ? (
                study.interests.map((interest, index) => (
                  <span
                    key={index}
                    className='bg-accent px-2 py-1 rounded text-xs'
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className='bg-accent px-2 py-1 rounded text-xs'>
                  {study.category}
                </span>
              )}
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
              {study.shortDescription ||
                study.detailedDescription ||
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
            {study.requirements && study.requirements.length > 0 ? (
              study.requirements.map((requirement, index) => (
                <div key={index} className='flex items-start text-sm'>
                  <span className='text-primary mr-2'>•</span>
                  <span className='text-foreground'>{requirement}</span>
                </div>
              ))
            ) : (
              <div className='flex items-start text-sm'>
                <span className='text-muted-foreground italic'>
                  모집 게시자가 참여 조건을 작성하지 않았습니다.
                </span>
              </div>
            )}
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
    </BaseModal>
  );
};

export default StudyDetailModal;
