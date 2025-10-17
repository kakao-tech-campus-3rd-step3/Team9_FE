type TuneAvailableListProps = {
  availablePerson: string[];
  day: string;
  hour: string;
  half: boolean;
};

const TuneAvailableList = ({
  availablePerson,
  day,
  hour,
  half,
}: TuneAvailableListProps) => {
  return (
    <div className='max-h-[950px] overflow-y-auto flex flex-col gap-2 items-center p-4'>
      <div className='font-bold'>
        {day} {hour} {half ? '30분' : '00분'}
      </div>
      <div className='font-bold'>가능한 스터디원</div>
      {availablePerson.map((person) => (
        <div key={person} className='py-1 w-full text-center'>
          {person}
        </div>
      ))}
    </div>
  );
};

export default TuneAvailableList;
