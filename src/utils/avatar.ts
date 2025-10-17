/**
 * 사용자 아바타 생성 유틸리티
 */

/**
 * 이름 유효성 검증 유틸리티
 */
const isValidName = (name: string): boolean => {
  return !!(name && name.trim() !== '');
};

/**
 * 사용자 이름에서 이니셜 추출
 * - 한글: 첫 글자만 사용
 * - 영문: 첫 번째와 마지막 단어의 첫 글자 사용
 * - 기타: 첫 글자만 사용
 */
export const getNameInitials = (name: string): string => {
  if (!isValidName(name)) return '?';

  const trimmedName = name.trim();

  // 한글인 경우 첫 글자만 반환
  if (/[가-힣]/.test(trimmedName)) {
    return trimmedName.charAt(0);
  }

  // 영문인 경우 첫 번째와 마지막 단어의 첫 글자
  const words = trimmedName.split(/\s+/).filter((word) => word.length > 0);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else if (words.length >= 2) {
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  // 기타 경우 첫 글자
  return trimmedName.charAt(0).toUpperCase();
};

/**
 * 이름 기반 배경색 생성
 * 이름의 해시값을 이용해 일관된 색상 생성
 */
export const getNameBasedColor = (name: string): string => {
  if (!isValidName(name)) return 'bg-gray-500';

  // 간단한 해시 함수로 일관된 색상 생성
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) & 0xffffffff;
  }

  // 미리 정의된 색상 팔레트
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-cyan-500',
  ];

  return colors[Math.abs(hash) % colors.length];
};
