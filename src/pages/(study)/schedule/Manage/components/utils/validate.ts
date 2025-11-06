import dayjs from 'dayjs';

/** 스터디 일정 추가 유효성 검사 */
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
  // Normalize end time: treat '24:00' as the next day's 00:00 for accurate comparison
  const end =
    endTime === '24:00'
      ? dayjs(`${endDate} 00:00`).add(1, 'day')
      : dayjs(`${endDate} ${endTime ?? '00:00'}`);
  if (!start.isValid() || !end.isValid()) return true;

  return end.isBefore(start) ? '종료는 시작 이후여야 해요' : true;
};

/** 일정 조율하기 날짜 유효성 검사 */
export const validateTuneDate = ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) => {
  if (!startDate || !endDate) return true;

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  if (!start.isValid() || !end.isValid()) return true;

  return end.isBefore(start) ? '종료는 시작 이후여야 해요' : true;
};

/** 일정 조율하기 시간 유효성 검사 */
export const validateTuneTime = ({
  startTime,
  endTime,
}: {
  startTime?: string;
  endTime?: string;
}) => {
  if (!startTime || !endTime) return true;
  // Normalize '24:00' as next day's 00:00 so comparison works
  const start = dayjs(`2000-01-01 ${startTime}`);
  const end =
    endTime === '24:00'
      ? dayjs('2000-01-02 00:00')
      : dayjs(`2000-01-01 ${endTime}`);
  if (!start.isValid() || !end.isValid()) return true;

  return end.isBefore(start) ? '종료는 시작 이후여야 해요' : true;
};
