interface SidebarProfileProps {
  userName: string;
  userEmail: string;
  userImageUrl?: string;
}

import { User } from 'lucide-react';

/**
 * 사이드바 하단 사용자 프로필 컴포넌트
 * 사용자 이미지와 이름을 표시합니다.
 */
function SidebarProfile({
  userName,
  userImageUrl,
}: Omit<SidebarProfileProps, 'userEmail'>) {
  return (
    <div className='mt-auto p-4 border-t border-border bg-secondary'>
      <div className='flex items-center gap-3'>
        {userImageUrl ? (
          <img
            src={userImageUrl}
            alt='profile'
            className='w-8 h-8 rounded-full object-cover border-2 border-primary/20'
          />
        ) : (
          <div className='w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/30'>
            <User className='w-4 h-4' />
          </div>
        )}
        <div className='min-w-0'>
          <div className='text-sm font-semibold text-foreground truncate'>
            {userName}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarProfile;
