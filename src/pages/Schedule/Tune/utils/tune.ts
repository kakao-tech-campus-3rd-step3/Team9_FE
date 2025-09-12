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

export const getGridBoolean = ({
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
  const grid: boolean[][] = [];
  for (let d = 0; d < days; d++) {
    grid.push(Array.from({ length: slots }, () => false));
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
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const totalStart = startH * 60 + startM;
  const totalEnd = endH === 24 ? 24 * 60 : endH * 60 + endM;

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
