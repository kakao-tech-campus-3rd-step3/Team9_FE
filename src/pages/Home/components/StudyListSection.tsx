import StudyNothing from './StudyNothing';

type StudyListSectionProps = {
  studies: { title: string; color: string }[];
};

const StudyListSection = ({ studies }: StudyListSectionProps) => {
  return (
    <section className='flex flex-col w-full max-w-7xl gap-2'>
      <h3 className='text-left font-bold'>나의 스터디</h3>
      {studies.length > 0 ? (
        <div className='flex gap-2'>
          {studies.map((study, index) => (
            <div
              key={index}
              className={`rounded-full w-18 h-18 flex items-center justify-center font-bold`}
              style={{ backgroundColor: study.color }}
            >
              {study.title}
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
