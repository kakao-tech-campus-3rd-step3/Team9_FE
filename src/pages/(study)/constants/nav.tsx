import { ROUTES } from '@/constants';
import {
  Calendar,
  ClipboardList,
  FileText,
  HelpCircle,
  Settings,
  TrendingUp,
  LayoutDashboard,
} from 'lucide-react';

export const STUDY_NAV_ITEMS = [
  {
    to: ROUTES.STUDY.DASHBOARD,
    label: '대시보드',
    icon: <LayoutDashboard className='w-5 h-5' />,
  },
  {
    to: ROUTES.STUDY.DOCUMENT,
    label: '문서',
    icon: <FileText className='w-5 h-5' />,
  },
  {
    to: ROUTES.STUDY.PROGRESS,
    label: '진척도',
    icon: <TrendingUp className='w-5 h-5' />,
  },
  {
    to: ROUTES.STUDY.SCHEDULE,
    label: '일정',
    icon: <Calendar className='w-5 h-5' />,
  },
  {
    to: ROUTES.STUDY.QUIZ,
    label: '퀴즈',
    icon: <HelpCircle className='w-5 h-5' />,
  },
  {
    to: ROUTES.STUDY.RETRO,
    label: '회고',
    icon: <ClipboardList className='w-5 h-5' />,
  },
  {
    to: ROUTES.STUDY.ADMIN,
    label: '관리자 기능',
    icon: <Settings className='w-5 h-5' />,
  },
] as const;
