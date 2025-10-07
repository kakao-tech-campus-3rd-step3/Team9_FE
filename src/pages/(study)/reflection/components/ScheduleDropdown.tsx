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

  const handleSelect = (scheduleId: number | null) => {
    onScheduleChange(scheduleId);
    setIsOpen(false);
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
            selectedSchedule ? 'text-foreground' : 'text-muted-foreground'
          }
        >
          {selectedSchedule ? selectedSchedule.schedule_title : placeholder}
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
            className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
              selectedScheduleId === null
                ? 'bg-primary text-primary-foreground'
                : ''
            }`}
          >
            선택 안함
          </button>

          {schedules.map((schedule) => (
            <button
              key={schedule.schedule_id}
              type='button'
              onClick={() => handleSelect(schedule.schedule_id)}
              className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                selectedScheduleId === schedule.schedule_id
                  ? 'bg-primary text-primary-foreground'
                  : ''
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
