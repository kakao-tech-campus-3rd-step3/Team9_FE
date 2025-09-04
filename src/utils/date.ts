export const formatDayOfTheWeek = (day: number): string => {
  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  if (day < 0 || day > 6) {
    throw new Error('요일은 0~6 사이 값이어야 합니다.');
  }
  return days[day];
};
