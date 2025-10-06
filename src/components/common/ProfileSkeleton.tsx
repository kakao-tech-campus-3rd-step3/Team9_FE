/**
 * 프로필 스켈레톤 컴포넌트 (Tailwind 펄스 효과 강화)
 * UserProfileSection의 로딩 상태 표시
 */

interface ProfileSkeletonProps {
  variant?: 'header' | 'study-sidebar';
  showRole?: boolean; // 역할 배지 표시 여부
}

const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
  variant = 'header',
  showRole = false,
}) => {
  const isHeader = variant === 'header';
  const avatarSize = isHeader ? 'w-8 h-8' : 'w-10 h-10';

  if (variant === 'study-sidebar') {
    return (
      <div className='flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group w-full border-t border-border rounded-none bg-secondary/80'>
        <div
          className={`${avatarSize} bg-muted rounded-full animate-pulse flex-shrink-0`}
        />
        <div
          className={`flex items-center ${showRole ? 'justify-between' : 'justify-start'} min-w-0 flex-1 text-left`}
        >
          <div className='h-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-md animate-pulse w-3/4'>
            <div className='h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse' />
          </div>
          {showRole && (
            <div className='h-5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400 rounded-full animate-pulse w-12 flex-shrink-0'>
              <div className='h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse' />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 px-3 py-2'>
      <div
        className={`${avatarSize} bg-gradient-to-r from-muted via-muted/70 to-muted rounded-full animate-pulse flex-shrink-0`}
      >
        <div className='w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse' />
      </div>
      <div className='h-4 bg-gradient-to-r from-muted via-muted/70 to-muted rounded-md animate-pulse w-20'>
        <div className='h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse' />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
