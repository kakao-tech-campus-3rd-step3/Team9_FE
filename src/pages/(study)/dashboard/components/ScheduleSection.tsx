import { Calendar, BookOpen, Users, Clock, User } from 'lucide-react';
import dayjs from 'dayjs';
import { SectionCard, DashboardEmpty, SkeletonBlock } from './common';
import { SCHEDULE_TYPE_CONFIG } from '../constants';
import type { Schedule } from '../types';
import { calculateDday, getDdayColor } from '../utils';

interface ScheduleSectionProps {
  schedules: Schedule[];
  onClick: () => void;
  isLoading?: boolean;
  isError?: boolean;
}

const ScheduleSection = ({
  schedules,
  onClick,
  isLoading,
  isError,
}: ScheduleSectionProps) => {
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

  if (isLoading) {
    return (
      <SectionCard
        icon={Calendar}
        title='일정'
        onClick={onClick}
        borderColor='border-primary'
      >
        <SkeletonBlock minHeightClass='min-h-[140px]' />
      </SectionCard>
    );
  }

  if (isError) {
    return (
      <SectionCard
        icon={Calendar}
        title='일정'
        onClick={onClick}
        borderColor='border-destructive'
      >
        <div className='text-center py-8'>
          <p className='text-destructive font-medium'>
            일정을 불러오지 못했어요.
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      </SectionCard>
    );
  }

  if (!schedules.length) {
    return (
      <SectionCard
        icon={Calendar}
        title='일정'
        onClick={onClick}
        borderColor='border-primary'
      >
        <DashboardEmpty
          icon={Calendar}
          title='일정 없음'
          description='등록된 일정이 없습니다'
          minHeightClass='min-h-[140px]'
          iconClassName='text-primary'
          iconWrapperClassName='bg-primary/20'
        />
      </SectionCard>
    );
  }

  // 가장 가까운 일정 찾기 (dayjs)
  const today = dayjs();
  const closestSchedule = schedules.reduce((closest, current) => {
    const currentDiff = Math.abs(dayjs(current.date).diff(today, 'day'));
    const closestDiff = Math.abs(dayjs(closest.date).diff(today, 'day'));
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
            <div className='mt-2 text-xs text-muted-foreground font-medium'>
              {closestSchedule.date} · {closestSchedule.time}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default ScheduleSection;
