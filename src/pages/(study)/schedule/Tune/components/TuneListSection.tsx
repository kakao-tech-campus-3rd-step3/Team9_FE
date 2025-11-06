import { Suspense, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useParams, useSearchParams } from 'react-router-dom';
import TuneInformation from './TuneInformation';
import { useTuneList } from '../hooks/useTuneList';

const TuneListSection = () => {
  const { study_id } = useParams<{ study_id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTune, setSelectedTune] = useState<number | null>(null);
  const { data: tuneList } = useTuneList({ study_id: Number(study_id) });

  const tuneDataList = (tuneList ?? []).map((tune, index) => ({
    id: index + 1,
    ...tune,
  }));

  useEffect(() => {
    const tuneIdParam = searchParams.get('tune');
    if (tuneIdParam) {
      setSelectedTune(Number(tuneIdParam));
    }
  }, [searchParams]);

  const handleClickTune = (tuneId: number) => {
    if (selectedTune === tuneId) {
      setSelectedTune(null);
      searchParams.delete('tune');
      setSearchParams(searchParams);
    } else {
      setSelectedTune(tuneId);
      setSearchParams({ tune: tuneId.toString() });
    }
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className='flex flex-col w-full p-4 gap-3'>
        {tuneDataList.map((tune) => (
          <div key={`${tune.id}`} className='flex flex-col gap-2'>
            <div
              className='flex flex-col px-6 py-4 border border-primary rounded-lg gap-1 bg-blue-50 cursor-pointer'
              onClick={() => handleClickTune(tune.id)}
            >
              <h3 className='text-lg font-bold'>{tune.title}</h3>
              <p className='text-sm text-gray-500'>
                {`${dayjs(tune.start).format('YYYY-MM-DD HH:mm')} - ${dayjs(
                  tune.end,
                ).format('YYYY-MM-DD HH:mm')}`}
              </p>
            </div>

            {selectedTune === tune.id && <TuneInformation />}
          </div>
        ))}
      </section>
    </Suspense>
  );
};

export default TuneListSection;
