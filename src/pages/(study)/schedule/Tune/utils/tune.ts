import { formatDayOfTheWeek } from '@/utils';
import dayjs from 'dayjs';
import type { Participant } from '../types';

const checkMidnight = (time: string) => {
  const adjustedEndTime =
    dayjs(time).hour() === 0 && dayjs(time).minute() === 0
      ? dayjs(time).subtract(1, 'minute')
      : dayjs(time);

  return adjustedEndTime;
};

const getTuneDayCount = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  const startDay = dayjs(startTime).startOf('day');
  const endDay = checkMidnight(endTime).endOf('day');
  const dayCount = endDay.diff(startDay, 'day') + 1;
  return dayCount;
};

export const countOnes = (num: number) => {
  return num
    .toString(2)
    .split('')
    .filter((bit) => bit === '1').length;
};

export const getTuneDay = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  const startDay = dayjs(startTime).startOf('day');
  const endDay = checkMidnight(endTime).endOf('day');
  const days = [];

  let current = startDay;
  while (current.isBefore(endDay) || current.isSame(endDay)) {
    const dayOfTheWeek = formatDayOfTheWeek(current.day());
    days.push(`${current.format('MM/DD')} ${dayOfTheWeek}`);
    current = current.add(1, 'day');
  }
  return days;
};

export const getGridNumber = ({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) => {
  const days = getTuneDayCount({ startTime, endTime });
  const slots =
    (dayjs(endTime).diff(dayjs(startTime), 'minute') -
      dayjs(endTime).diff(dayjs(startTime), 'day') * 24 * 60) /
    30;
  const grid: number[][] = [];
  for (let d = 0; d < days; d++) {
    grid.push(Array.from({ length: slots }, () => 0));
  }
  return grid;
};

export const buildGrid = ({
  data,
  startTime,
  endTime,
}: {
  data: number[];
  startTime: string;
  endTime: string;
}) => {
  const days = getTuneDayCount({ startTime, endTime });
  const slots =
    (dayjs(endTime).diff(dayjs(startTime), 'minute') -
      dayjs(endTime).diff(dayjs(startTime), 'day') * 24 * 60) /
    30;
  const grid: number[][] = [];
  for (let day = 0; day < days; day++) {
    grid.push(data.slice(day * slots, (day + 1) * slots));
  }
  return grid;
};

export const getHourSlots = (startTime: string, endTime: string): string[] => {
  // startTime / endTime may come in different formats ("HH:mm", "HH:mm:ss", or ISO datetime).
  // Use dayjs to safely parse hours and minutes. Fall back to simple split parsing if parsing fails.
  const parseTime = (t: string) => {
    const d = dayjs(t);
    if (d.isValid()) {
      return { h: d.hour(), m: d.minute() };
    }

    const parts = t.split(':').map(Number);
    return { h: parts[0] ?? 0, m: parts[1] ?? 0 };
  };

  const { h: sH, m: sM } = parseTime(startTime);
  const { h: eH, m: eM } = parseTime(endTime);

  const totalStart = sH * 60 + sM;
  const totalEnd = eH === 24 ? 24 * 60 : eH * 60 + eM;

  const slots: string[] = [];
  for (let time = totalStart; time < totalEnd; time += 60) {
    const hour = Math.floor(time / 60);
    slots.push(`${String(hour)}시`);
  }
  return slots;
};

const colorMap: Record<number, string> = {
  1: 'bg-blue-100',
  2: 'bg-blue-200',
  3: 'bg-blue-300',
  4: 'bg-blue-400',
  5: 'bg-blue-500',
  6: 'bg-blue-600',
  7: 'bg-blue-700',
  8: 'bg-blue-800',
  9: 'bg-blue-900',
};

export const getBgColor = ({
  count,
  maxCount,
}: {
  count: number;
  maxCount: number;
}) => {
  if (count === 0) return 'bg-white';
  const intensity = Math.ceil((count / maxCount) * 9);
  return colorMap[intensity] || 'bg-blue-900';
};

export const getAvailablePersons = ({
  tuneNumber,
  participants,
}: {
  tuneNumber: number;
  participants: Participant[];
}): string[] => {
  return participants
    .filter((participant) => (tuneNumber & participant.candidate_number) !== 0)
    .map((participant) => participant.name);
};
