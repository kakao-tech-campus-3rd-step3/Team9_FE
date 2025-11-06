import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { Schedule } from '../types';

interface ScheduleDropdownProps {
  schedules: Schedule[];
  selectedScheduleId: number | null;
  onScheduleChange: (scheduleId: number | null) => void;
  placeholder?: string;
}

const ScheduleDropdown = ({
  schedules,
  selectedScheduleId,
  onScheduleChange,
  placeholder = '연관된 스터디 일정을 선택해주세요..',
}: ScheduleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedSchedule = schedules.find(
    (s) => s.schedule_id === selectedScheduleId,
  );

  // 선택된 값이 null인지 확인 (명시적으로 "선택 안함"을 선택한 경우)
  const isExplicitlyNull = selectedScheduleId === null && schedules.length > 0;

  const handleSelect = (scheduleId: number | null) => {
    onScheduleChange(scheduleId);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedSchedule) {
      return selectedSchedule.schedule_title;
    }
    if (isExplicitlyNull) {
      return '선택 안함';
    }
    return placeholder;
  };

  return (
    <div className='relative w-full'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-4 py-3 text-left bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-between'
      >
        <span
          className={
            selectedSchedule || isExplicitlyNull
              ? 'text-foreground'
              : 'text-muted-foreground'
          }
        >
          {getDisplayText()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto'>
          <button
            type='button'
            onClick={() => handleSelect(null)}
            className={`w-full px-4 py-3 text-left transition-colors ${
              selectedScheduleId === null
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-accent'
            }`}
          >
            선택 안함
          </button>

          {schedules.map((schedule) => (
            <button
              key={schedule.schedule_id}
              type='button'
              onClick={() => handleSelect(schedule.schedule_id)}
              className={`w-full px-4 py-3 text-left transition-colors ${
                selectedScheduleId === schedule.schedule_id
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'hover:bg-accent'
              }`}
            >
              {schedule.schedule_title}
            </button>
          ))}
        </div>
      )}

      {/* 오버레이 */}
      {isOpen && (
        <div
          className='fixed inset-0 z-[9998]'
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ScheduleDropdown;
