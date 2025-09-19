import { useFormContext, type FieldPath } from 'react-hook-form';
import { validateTuneDate, validateTuneTime } from './utils';

type ScheduleFormValues = {
  tune?: {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  };
};

const ScheduleAddTune = () => {
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<ScheduleFormValues>();

  const forceHour =
    (name: FieldPath<ScheduleFormValues>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      const [hour, minute] = e.target.value.split(':');
      if (minute !== '00') {
        const normalized = `${hour.padStart(2, '0')}:00`;
        setValue(name, normalized, { shouldDirty: true });
      }
    };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='font-bold'>일정 조율 기간</div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>시작</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
            {...register('tune.startDate', {
              onChange: () => {
                trigger('tune.startDate');
              },
              validate: () =>
                validateTuneDate({
                  startDate: getValues('tune.startDate'),
                  endDate: getValues('tune.endDate'),
                }),
            })}
          />
        </div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>종료</label>
          <input
            type='date'
            className='border border-gray-300 rounded-lg p-2'
            {...register('tune.endDate', {
              onChange: () => {
                trigger('tune.endDate');
              },
              validate: () =>
                validateTuneDate({
                  startDate: getValues('tune.startDate'),
                  endDate: getValues('tune.endDate'),
                }),
            })}
          />
        </div>
        {errors.tune?.endDate?.message && (
          <p className='text-red-500 text-sm'>{errors.tune.endDate.message}</p>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <div className='font-bold'>가능한 시간대</div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>시작</label>
          <input
            type='time'
            step='3600'
            className='border border-gray-300 rounded-lg p-2'
            {...register('tune.startTime', {
              onChange: forceHour('tune.startTime'),
              validate: () =>
                validateTuneTime({
                  startTime: getValues('tune.startTime'),
                  endTime: getValues('tune.endTime'),
                }),
            })}
          />
        </div>
        <div className='flex justify-between gap-2'>
          <label className='flex items-center gap-2'>종료</label>
          <input
            type='time'
            step='3600'
            className='border border-gray-300 rounded-lg p-2'
            {...register('tune.endTime', {
              onChange: forceHour('tune.endTime'),
              validate: () =>
                validateTuneTime({
                  startTime: getValues('tune.startTime'),
                  endTime: getValues('tune.endTime'),
                }),
            })}
          />
        </div>
        {errors.tune?.endTime?.message && (
          <p className='text-red-500 text-sm'>{errors.tune.endTime.message}</p>
        )}
      </div>
    </>
  );
};

export default ScheduleAddTune;
