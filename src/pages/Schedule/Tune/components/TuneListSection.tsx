import { useEffect, useState } from 'react';
import { tuneData } from '../mock/tune';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import TuneInfoSection from './TuneInfoSection';

const TuneListSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTune, setSelectedTune] = useState<number | null>(null);

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
    <section className='flex flex-col w-full p-4 gap-3'>
      {tuneData.tunes.map((tune) => (
        <div key={tune.id} className='flex flex-col gap-2'>
          <div
            className='flex flex-col px-6 py-4 border border-primary rounded-lg gap-1 bg-blue-50 cursor-pointer'
            onClick={() => handleClickTune(tune.id)}
          >
            <h3 className='text-lg font-bold'>{tune.title}</h3>
            <p className='text-sm text-gray-500'>
              {`${dayjs(tune.start_time).format('YYYY-MM-DD HH:mm')} - ${dayjs(
                tune.end_time,
              ).format('YYYY-MM-DD HH:mm')}`}
            </p>
          </div>

          {selectedTune === tune.id && <TuneInfoSection />}
        </div>
      ))}
    </section>
  );
};

export default TuneListSection;
