import React from 'react';

interface UserInfoSectionProps {
  // 사용자 닉네임
  nickname: string;
  // 현재 스터디 제목
  currentStudyTitle?: string;
}

// 사용자 정보 섹션 컴포넌트
const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  nickname,
  currentStudyTitle,
}) => {
  return (
    <div className='px-4 py-3 border-b border-border/50 bg-muted/30'>
      <p className='text-sm font-semibold text-foreground'>{nickname}</p>
      {currentStudyTitle && (
        <p className='text-xs text-muted-foreground mt-0.5'>
          {currentStudyTitle}
        </p>
      )}
    </div>
  );
};

export default UserInfoSection;
