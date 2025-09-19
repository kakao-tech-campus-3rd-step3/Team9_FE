import dayjs from 'dayjs';

export const validateManageTime = ({
  startDate,
  startTime,
  endDate,
  endTime,
}: {
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
}) => {
  if (!startDate || !endDate) return true;

  const start = dayjs(`${startDate} ${startTime ?? '00:00'}`);
  const end = dayjs(`${endDate} ${endTime ?? '00:00'}`);
  if (!start.isValid() || !end.isValid()) return true;

  return end.isBefore(start) ? '종료는 시작 이후여야 해요' : true;
};
