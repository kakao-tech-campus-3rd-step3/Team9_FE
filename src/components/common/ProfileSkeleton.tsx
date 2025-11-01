/**
 * 프로필 스켈레톤 컴포넌트
 * UserProfileSection의 로딩 상태 표시
 */

interface ProfileSkeletonProps {
  variant?: 'header' | 'study-sidebar';
}

const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
  variant = 'header',
}) => {
  const isHeader = variant === 'header';
  const avatarSize = isHeader ? 'w-8 h-8' : 'w-10 h-10';

  if (variant === 'study-sidebar') {
    return (
      <div className='flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group w-full animate-pulse'>
        {/* 아바타 스켈레톤 */}
        <div
          className={`${avatarSize} bg-muted-foreground/30 rounded-full flex-shrink-0`}
        />

        {/* 텍스트 영역 스켈레톤 */}
        <div className='flex items-center justify-between min-w-0 flex-1 text-left'>
          {/* 닉네임 스켈레톤 */}
          <div className='h-4 bg-muted-foreground/30 rounded w-20' />
          {/* 역할 배지 스켈레톤 */}
          <div className='h-5 bg-muted-foreground/30 rounded-full w-12 flex-shrink-0' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3 text-sm rounded-lg transition-all duration-200 group w-full hover:bg-secondary/90 min-w-0 px-4 py-3 animate-pulse'>
      {/* 아바타 스켈레톤 */}
      <div className='relative flex-shrink-0'>
        <div className={`${avatarSize} bg-muted-foreground/30 rounded-full`} />
      </div>

      {/* 텍스트 영역 스켈레톤 */}
      <div className='flex items-center justify-start min-w-0 flex-1 text-left'>
        {/* 닉네임 스켈레톤 */}
        <div className='h-4 bg-muted-foreground/30 rounded w-20' />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
