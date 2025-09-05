/**
 * 대시보드 관련 상수 정의
 */

// 파일 타입별 아이콘 및 색상
export const FILE_TYPE_CONFIG = {
  pdf: {
    icon: 'FileText',
    color: 'text-destructive',
  },
  doc: {
    icon: 'FileText',
    color: 'text-primary',
  },
  ppt: {
    icon: 'FileSpreadsheet',
    color: 'text-success',
  },
  image: {
    icon: 'FileImage',
    color: 'text-accent-foreground',
  },
} as const;

// 일정 타입별 설정
export const SCHEDULE_TYPE_CONFIG = {
  study: {
    icon: 'BookOpen',
    color: 'text-primary',
    bgColor: 'bg-primary/10 text-primary border-primary/20',
    text: '스터디',
  },
  meeting: {
    icon: 'Users',
    color: 'text-success',
    bgColor: 'bg-success/10 text-success border-success/20',
    text: '회의',
  },
  deadline: {
    icon: 'Clock',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10 text-destructive border-destructive/20',
    text: '마감',
  },
} as const;

// 타입 정의 (keyof 사용으로 자동 동기화)
export type FileTypeKey = keyof typeof FILE_TYPE_CONFIG;
export type ScheduleTypeKey = keyof typeof SCHEDULE_TYPE_CONFIG;
