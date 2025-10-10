import React from 'react';
import { getNameInitials, getNameBasedColor, getTextColor } from '@/utils';
import { useImageUrl } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { SkeletonAvatar } from '@/components/common';

interface UserAvatarProps {
  /** 사용자 이미지 키 */
  imageKey?: string;
  /** 사용자 이름 (이미지가 없을 때 이니셜 생성용) */
  name: string;
  /** 추가 클래스명 (크기, 스타일 등 모든 스타일링) */
  className?: string;
  /** 전역 캐시 사용 여부 (기본: true) */
  useGlobalCache?: boolean;
}

/**
 * 사용자 아바타 컴포넌트
 * - 이미지가 있으면 이미지 표시
 * - 이미지가 없으면 이름 기반 이니셜 아바타 표시
 * - 이미지 로드 실패 시 이니셜 아바타로 자동 대체
 * - 전역 캐시된 이미지 URL 우선 사용으로 깜빡임 최소화
 * - 기본 스타일: 원형, 중앙 정렬, 반응형 크기
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  imageKey,
  name,
  className = '',
  useGlobalCache = true,
}) => {
  const [hasImageError, setHasImageError] = React.useState(false);
  const { user } = useAuthStore();

  // 전역 캐시 사용 여부와 현재 사용자의 이미지인지 확인
  const isCurrentUserImage = useGlobalCache && user.imageKey === imageKey;
  const cachedImageUrl = isCurrentUserImage ? user.imageUrl : undefined;

  // 캐시된 URL이 있으면 사용, 없으면 API 호출
  const { imageUrl, isLoading } = useImageUrl(
    cachedImageUrl ? undefined : imageKey,
  );
  const finalImageUrl = cachedImageUrl || imageUrl;

  const shouldShowImage = finalImageUrl && !hasImageError && !isLoading;

  // 이미지 로드 에러 처리
  const handleImageError = () => {
    setHasImageError(true);
  };

  // 로딩 중이거나 이미지가 없는 경우 이니셜 아바타를 기본으로 표시
  const safeName = name || '';
  const initials = getNameInitials(safeName);
  const bgColor = getNameBasedColor(safeName);
  const hasName = safeName.trim().length > 0;
  const textColor = getTextColor();

  // 기본 스타일과 외부 className을 조합
  const containerClasses = `rounded-full overflow-hidden flex items-center justify-center font-semibold ${className}`;

  // 로딩 중일 때 스켈레톤 표시
  if (isLoading) {
    return <SkeletonAvatar className={className} />;
  }

  return (
    <div
      className={containerClasses}
      style={{ backgroundColor: shouldShowImage ? 'transparent' : undefined }}
    >
      {shouldShowImage ? (
        // 이미지가 있는 경우 - 이미지로 전체 영역 채우기
        <img
          src={finalImageUrl}
          alt={`${name} 프로필`}
          className='w-full h-full object-cover'
          onError={handleImageError}
        />
      ) : (
        // 이미지가 없는 경우 - 이니셜 아바타
        <div
          className={`w-full h-full ${bgColor} ${textColor} flex items-center justify-center`}
        >
          {hasName ? initials : ''}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
