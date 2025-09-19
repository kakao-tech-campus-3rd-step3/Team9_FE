import { useFormContext } from 'react-hook-form';
import { validateManageTime } from './utils';

type ScheduleFormValues = {
  fixed?: {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  };
};

const ScheduleAddManage = () => {
  const {
    register,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<ScheduleFormValues>();

  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='font-bold'>스터디 기간</div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>시작</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
            {...register('fixed.startDate', {
              onChange: () => {
                // 시작 변경 시 종료 필드 재검증
                trigger(['fixed.endDate', 'fixed.endTime']);
              },
            })}
          />
          <input
            type='time'
            className='border border-gray-300 rounded-lg p-2'
            {...register('fixed.startTime', {
              onChange: () => trigger('fixed.endTime'),
            })}
          />
        </div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>종료</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
            {...register('fixed.endDate', {
              validate: () =>
                validateManageTime({
                  startDate: getValues('fixed.startDate'),
                  startTime: getValues('fixed.startTime'),
                  endDate: getValues('fixed.endDate'),
                  endTime: getValues('fixed.endTime'),
                }),
              onChange: () => trigger('fixed.endTime'),
            })}
          />
          <input
            type='time'
            className='border border-gray-300 rounded-lg p-2'
            {...register('fixed.endTime', {
              validate: () =>
                validateManageTime({
                  startDate: getValues('fixed.startDate'),
                  startTime: getValues('fixed.startTime'),
                  endDate: getValues('fixed.endDate'),
                  endTime: getValues('fixed.endTime'),
                }),
            })}
          />
        </div>
        {errors.fixed?.endDate?.message && (
          <p className='text-red-500 text-sm'>{errors.fixed.endDate.message}</p>
        )}
      </div>
    </>
  );
};

export default ScheduleAddManage;
