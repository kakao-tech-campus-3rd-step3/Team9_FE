import React from 'react';
import { getNameInitials, getNameBasedColor } from '@/utils';
import { useImageUrl } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { SkeletonAvatar } from '@/components/common';

interface UserAvatarProps {
  /** 사용자 이미지 키 */
  imageKey?: string;
  /** 사용자 이름 (이미지가 없을 때 이니셜 생성용) */
  name?: string;
  /** 추가 클래스명 (크기, 스타일 등 모든 스타일링) */
  className?: string;
}

/**
 * 사용자 아바타 컴포넌트
 * - 이미지가 있으면 이미지 표시
 * - 이미지가 없으면 이름 기반 이니셜 아바타 표시
 * - 이미지 로드 실패 시 이니셜 아바타로 자동 대체
 * - TanStack Query 캐시를 활용한 이미지 URL 관리
 * - 기본 스타일: 원형, 중앙 정렬, 반응형 크기
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  imageKey,
  name = '',
  className = '',
}) => {
  const [hasImageError, setHasImageError] = React.useState(false);
  const { user } = useAuthStore();

  // 현재 사용자의 이미지인지 확인하여 캐시된 URL 사용 여부 결정
  const isCurrentUser = user.imageKey && user.imageKey === imageKey;
  const cachedImageUrl = isCurrentUser ? user.imageUrl : undefined;

  // 캐시된 URL이 없으면 useImageUrl을 통해 이미지 URL 가져오기
  const { imageUrl: fetchedImageUrl, isLoading: imageLoading } = useImageUrl(
    !cachedImageUrl ? imageKey : undefined,
  );

  const finalImageUrl = cachedImageUrl || fetchedImageUrl;

  // 데이터가 없으면 스켈레톤 표시 (Suspense가 상위에서 처리하므로 여기서는 데이터만 체크)
  if (!name && !imageKey) {
    return <SkeletonAvatar className={className} />;
  }

  const shouldShowImage = finalImageUrl && !hasImageError && !imageLoading;

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center font-semibold ${className}`}
      style={{ backgroundColor: shouldShowImage ? 'transparent' : undefined }}
    >
      {imageLoading ? (
        <SkeletonAvatar className='w-full h-full' />
      ) : shouldShowImage ? (
        <img
          src={finalImageUrl}
          alt={`${name} 프로필`}
          className='w-full h-full object-cover'
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div
          className={`w-full h-full ${getNameBasedColor(name)} text-white flex items-center justify-center`}
        >
          {getNameInitials(name)}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
