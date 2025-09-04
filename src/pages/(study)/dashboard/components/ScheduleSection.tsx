import { Calendar, BookOpen, Users, Clock, User } from 'lucide-react';
import { SectionCard } from './common';
import { SCHEDULE_TYPE_CONFIG } from '../constants';
import type { Schedule } from '../types';

interface ScheduleSectionProps {
  schedules: Schedule[];
  onClick: () => void;
}

const ScheduleSection = ({ schedules, onClick }: ScheduleSectionProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study':
        return <BookOpen className='w-4 h-4 text-primary' />;
      case 'meeting':
        return <Users className='w-4 h-4 text-success' />;
      case 'deadline':
        return <Clock className='w-4 h-4 text-destructive' />;
      default:
        return <Calendar className='w-4 h-4 text-muted-foreground' />;
    }
  };

  const calculateDday = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '내일';
    if (diffDays === -1) return '어제';
    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
    return '오늘';
  };

  const getDdayColor = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'bg-primary text-primary-foreground';
    if (diffDays === 1) return 'bg-warning text-warning-foreground';
    if (diffDays > 0) return 'bg-success text-success-foreground';
    if (diffDays < 0) return 'bg-muted text-muted-foreground';
    return 'bg-primary text-primary-foreground';
  };

  if (!schedules.length) {
    return (
      <SectionCard
        icon={Calendar}
        title='일정'
        onClick={onClick}
        borderColor='border-primary'
      >
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>등록된 일정이 없습니다.</p>
        </div>
      </SectionCard>
    );
  }

  // 가장 가까운 일정 찾기
  const today = new Date();
  const closestSchedule = schedules.reduce((closest, current) => {
    const currentDate = new Date(current.date);
    const closestDate = new Date(closest.date);
    const currentDiff = Math.abs(currentDate.getTime() - today.getTime());
    const closestDiff = Math.abs(closestDate.getTime() - today.getTime());
    return currentDiff < closestDiff ? current : closest;
  });

  const typeConfig =
    SCHEDULE_TYPE_CONFIG[
      closestSchedule.type as keyof typeof SCHEDULE_TYPE_CONFIG
    ];
  const dday = calculateDday(closestSchedule.date);
  const ddayColor = getDdayColor(closestSchedule.date);

  return (
    <SectionCard
      icon={Calendar}
      title='일정'
      onClick={onClick}
      borderColor='border-primary'
    >
      <div className='flex items-center justify-between'>
        {/* 일정 정보 - 왼쪽에 배치 */}
        <div className='flex-1 min-w-0'>
          <div className='mb-4 flex flex-row gap-4 items-center'>
            <h4 className='font-bold text-foreground text-2xl line-clamp-1 mb-2'>
              {closestSchedule.title}
            </h4>
            <div className='flex items-center gap-2'>
              {getTypeIcon(closestSchedule.type)}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${typeConfig.bgColor}`}
              >
                {typeConfig.text}
              </span>
            </div>
          </div>

          <div className='flex items-center gap-6 text-xs text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <Calendar className='w-3 h-3 text-primary' />
              <span>{closestSchedule.date}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='w-3 h-3 text-primary' />
              <span>{closestSchedule.time}</span>
            </div>
            <div className='flex items-center gap-1'>
              <User className='w-3 h-3 text-primary' />
              <span className='line-clamp-1'>
                {closestSchedule.participants.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* 디데이 배지 - 우측에 크게 배치 */}
        <div className='flex-shrink-0 ml-6'>
          <div className='text-center'>
            <div
              className={`px-8 py-4 rounded-2xl text-3xl font-bold ${ddayColor}`}
            >
              {dday}
            </div>
            <div className='mt-2 text-sm text-muted-foreground font-medium'>
              {closestSchedule.date}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ScheduleSection;
