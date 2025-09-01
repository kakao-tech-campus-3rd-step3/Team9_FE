import StudyNothing from './StudyNothing';

type StudyListSectionProps = {
  titles: string[];
};

const StudyListSection = ({ titles }: StudyListSectionProps) => {
  return (
    <section className='flex flex-col w-full max-w-7xl gap-2'>
      <h3 className='text-left font-bold'>나의 스터디</h3>
      {titles.length > 0 ? (
        <div className='flex gap-2'>
          {titles.map((title, index) => (
            <div
              key={index}
              className={`rounded-full w-18 h-18 flex items-center justify-center font-bold ${
                index === 0 ? 'bg-red-400' : 'bg-blue-400'
              } `}
            >
              {title}
            </div>
          ))}
        </div>
      ) : (
        <StudyNothing />
      )}
    </section>
  );
};

export default StudyListSection;
