import { FormProvider, useForm } from 'react-hook-form';
import type { FieldPath, SubmitHandler } from 'react-hook-form';
import dayjs from 'dayjs';
import { validateManageTime } from '../../Manage/components/utils';
import { useTuneComplete } from '../hooks/useTuneComplete';
import { useParams } from 'react-router-dom';

type ScheduleFormValues = {
  title: string;
  content: string;
  tune?: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
  };
};

type TuneAddFormProps = {
  tune_id: number;
  title: string;
  content: string;
};

const TuneAddForm = ({ tune_id, title, content }: TuneAddFormProps) => {
  const study_id = useParams<{ study_id: string }>().study_id || '';
  const methods = useForm<ScheduleFormValues>({
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      title,
      content,
    },
  });
  const { mutate: tuneComplete } = useTuneComplete({
    study_id: Number(study_id),
  });

  const forceHour =
    (name: FieldPath<ScheduleFormValues>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      const [hour, minute] = e.target.value.split(':');
      if (minute !== '00') {
        const normalized = `${hour.padStart(2, '0')}:00`;
        methods.setValue(name, normalized, { shouldDirty: true });
        // re-run validation for related fields so any existing error messages
        // (which might be attached to endDate or endTime) are updated/cleared.
        methods.trigger([
          'tune.startDate',
          'tune.startTime',
          'tune.endDate',
          'tune.endTime',
        ]);
      }
    };

  const onSubmit: SubmitHandler<ScheduleFormValues> = (values) => {
    {
      // 일정 추가
      const start_time = dayjs(
        `${values.tune?.startDate}T${values.tune?.startTime}`,
      ).toISOString();
      const end_time = dayjs(
        `${values.tune?.endDate}T${values.tune?.endTime}`,
      ).toISOString();

      tuneComplete({
        tune_id: Number(tune_id),
        title: values.title,
        content: values.content ?? '',
        start_time: dayjs(start_time).format('YYYY-MM-DDTHH:mm:ss'),
        end_time: dayjs(end_time).format('YYYY-MM-DDTHH:mm:ss'),
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <h2 className='text-xl font-bold mb-4'>일정 추가하기</h2>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className='flex flex-col gap-4 justify-center'
      >
        <div className='flex flex-col gap-2'>
          <label className='font-bold'>일정 제목</label>
          <input
            type='text'
            placeholder='일정 제목'
            className='border border-gray-300 rounded-lg p-2'
            {...methods.register('title', { required: true })}
          />
          <label className='font-bold'>일정 내용</label>
          <textarea
            placeholder='일정 내용'
            className='border border-gray-300 rounded-lg p-2 h-24 resize-none'
            {...methods.register('content')}
          />
        </div>
        <div className='flex flex-col gap-2 flex-1 min-h-0 justify-between'>
          <div className='flex flex-col gap-2'>
            <div className='font-bold'>스터디 기간</div>
            <div className='flex justify-between gap-2'>
              <label className='flex items-center gap-2'>시작</label>
              <input
                type='date'
                className='border border-gray-300 rounded-lg p-2'
                {...methods.register('tune.startDate', {
                  onChange: () => {
                    // 시작 변경 시 종료 필드 재검증
                    methods.trigger(['tune.endDate', 'tune.endTime']);
                  },
                  validate: () =>
                    validateManageTime({
                      startDate: methods.getValues('tune.startDate'),
                      startTime: methods.getValues('tune.startTime'),
                      endDate: methods.getValues('tune.endDate'),
                      endTime: methods.getValues('tune.endTime'),
                    }),
                })}
              />
              <input
                type='time'
                step='3600'
                className='border border-gray-300 rounded-lg p-2'
                {...methods.register('tune.startTime', {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    // normalize minutes to 00 and revalidate end fields
                    forceHour('tune.startTime')(e);
                    methods.trigger(['tune.endDate', 'tune.endTime']);
                  },
                  validate: () =>
                    validateManageTime({
                      startDate: methods.getValues('tune.startDate'),
                      startTime: methods.getValues('tune.startTime'),
                      endDate: methods.getValues('tune.endDate'),
                      endTime: methods.getValues('tune.endTime'),
                    }),
                })}
              />
            </div>
            <div className='flex justify-between gap-2'>
              <label className='flex items-center gap-2'>종료</label>
              <input
                type='date'
                className='border border-gray-300 rounded-lg p-2'
                {...methods.register('tune.endDate', {
                  onChange: () => {
                    // 종료 변경 시 시작 필드 재검증
                    methods.trigger(['tune.startDate', 'tune.startTime']);
                  },
                  validate: () =>
                    validateManageTime({
                      startDate: methods.getValues('tune.startDate'),
                      startTime: methods.getValues('tune.startTime'),
                      endDate: methods.getValues('tune.endDate'),
                      endTime: methods.getValues('tune.endTime'),
                    }),
                })}
              />
              <input
                type='time'
                step='3600'
                className='border border-gray-300 rounded-lg p-2'
                {...methods.register('tune.endTime', {
                  onChange: (e) => {
                    forceHour('tune.endTime')(e);
                    methods.trigger(['tune.startDate', 'tune.startTime']);
                  },
                  validate: () =>
                    validateManageTime({
                      startDate: methods.getValues('tune.startDate'),
                      startTime: methods.getValues('tune.startTime'),
                      endDate: methods.getValues('tune.endDate'),
                      endTime: methods.getValues('tune.endTime'),
                    }),
                })}
              />
            </div>
            {methods.formState.errors.tune?.endDate?.message && (
              <p className='text-red-500 text-sm'>
                {methods.formState.errors.tune.endDate.message}
              </p>
            )}
          </div>
          <div className='flex justify-end gap-2'>
            <button
              type='submit'
              disabled={
                !methods.formState.isValid || methods.formState.isSubmitting
              }
              className={`px-4 py-2 rounded text-white text-sm font-medium ${
                !methods.formState.isValid || methods.formState.isSubmitting
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary'
              }`}
            >
              추가
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default TuneAddForm;
