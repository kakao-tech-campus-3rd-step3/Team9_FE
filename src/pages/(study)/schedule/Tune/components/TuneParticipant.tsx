import type { Participant } from '../types';

type TuneParticipantProps = {
  participants: Participant[];
};

const TuneParticipant = ({ participants }: TuneParticipantProps) => {
  return (
    <div className='flex flex-col justify-center items-center p-6'>
      <div className='text-lg font-bold'>참여한 스터디원</div>
      <div className='flex gap-4'>
        {participants.map((participant) => (
          <div key={participant.id} className='text-sm'>
            {participant.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TuneParticipant;
