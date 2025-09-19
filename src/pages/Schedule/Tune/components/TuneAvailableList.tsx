import { tuneCheckData } from '../mock/tuneCheck';
import { getAvailablePersons } from '../utils';

type TuneAvailableListProps = {
  day: string;
  hour: string;
  half: boolean;
  tuneNumber: number;
};

const TuneAvailableList = ({
  day,
  hour,
  half,
  tuneNumber,
}: TuneAvailableListProps) => {
  const AvailablePerson = getAvailablePersons({
    tuneNumber,
    participants: tuneCheckData.participants,
  });

  return (
    <div className='max-h-[950px] overflow-y-auto flex flex-col gap-2 items-center p-4'>
      <div className='font-bold'>
        {day} {hour} {half ? '30분' : '00분'}
      </div>
      <div className='font-bold'>가능한 스터디원</div>
      {AvailablePerson.map((person) => (
        <div key={person} className='py-1 w-full text-center'>
          {person}
        </div>
      ))}
    </div>
  );
};

export default TuneAvailableList;
