import { Logo } from '@/components/common';

/**
 * 사이드바 상단 헤더 컴포넌트
 * 로고만 표시하고, 스터디 정보는 별도 컴포넌트에서 Suspense로 처리합니다.
 */
function SidebarHeader() {
  return (
    <div className='border-b border-border flex flex-col items-start bg-background'>
      {/* 로고는 항상 표시 */}
      <div className='w-full p-4 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
        <div className='flex items-center'>
          <Logo size='md' />
        </div>
      </div>
    </div>
  );
}

export default SidebarHeader;
