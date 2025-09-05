export const studyColor = (id: number) => {
  const colors = [
    'oklch(70.4% 0.191 22.216)', // 빨강
    'oklch(70.7% 0.165 254.624)', // 파랑
    'oklch(70.5% 0.18 45)', // 주황
    'oklch(70.5% 0.18 320)', // 보라
    'oklch(70.5% 0.18 90)', // 노랑
    'oklch(70.5% 0.18 260)', // 남색
    'oklch(70.5% 0.18 140)', // 초록
  ];
  return colors[id % colors.length];
};
