import React from 'react';
import { Link } from 'react-router-dom';
import { padoLogo } from '@/assets';
import { ROUTES } from '@/constants';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

/**
 * 파도 로고 컴포넌트
 * @param size - 로고 크기 (sm: 28px, md: 36px, lg: 44px)
 * @param showText - "파도" 텍스트 표시 여부
 * @param className - 추가 CSS 클래스
 */
const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  // 로고 이미지 크기 클래스
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  // 텍스트 크기 클래스
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link
      to={ROUTES.HOME}
      className={`flex items-center space-x-2 hover:opacity-80 transition-opacity`}
    >
      <img
        src={padoLogo}
        alt='파도 로고'
        className={`${sizeClasses[size]} rounded-lg shadow-sm ${className}`}
      />
      {showText && (
        <div className='relative h-full flex items-center'>
          <span
            className={`${textSizeClasses[size]} font-brand text-primary leading-7 relative top-0.5`}
          >
            파도
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
