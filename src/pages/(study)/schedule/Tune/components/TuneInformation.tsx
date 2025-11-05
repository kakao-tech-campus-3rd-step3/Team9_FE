import { useState } from 'react';
import TunePersonalTable from './TunePersonalTable';
import TuneTable from './TuneTable';
import {
  buildGrid,
  getAvailablePersons,
  getGridNumber,
  getHourSlots,
  getTuneDay,
} from '../utils';
import TuneAvailableList from './TuneAvailableList';
import TuneParticipant from './TuneParticipant';
import { useTuneDetail } from '../hooks/useTuneDetail';

type TuneInformationProps = {
  tune_id: number;
};

const TuneInformation = ({ tune_id }: TuneInformationProps) => {
  const { data: tuneDetailData } = useTuneDetail({ tune_id });
  const [hoverTable, setHoverTable] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const hourSlots = getHourSlots(
    tuneDetailData.available_start_time,
    tuneDetailData.available_end_time,
  );
  const grid = buildGrid({
    data: tuneDetailData.candidate_dates,
    startTime: tuneDetailData.available_start_time,
    endTime: tuneDetailData.available_end_time,
  });
  const gridNumber = getGridNumber({
    startTime: tuneDetailData.available_start_time,
    endTime: tuneDetailData.available_end_time,
  });
  const [personalTune, setPersonalTune] = useState(gridNumber);
  const days = getTuneDay({
    startTime: tuneDetailData.available_start_time,
    endTime: tuneDetailData.available_end_time,
  });

  const availablePerson =
    hoverTable != null
      ? getAvailablePersons({
          tuneNumber: grid[hoverTable.col][hoverTable.row],
          participants: tuneDetailData.participants,
        })
      : [];

  return (
    <div className='flex flex-col mt-2 p-4 border border-secondary rounded-lg bg-white'>
      <TuneParticipant participants={tuneDetailData.participants} />
      <div className='flex overflow-x-auto justify-between flex-nowrap whitespace-nowrap'>
        <div className='min-w-[600px]'>
          {hoverTable ? (
            <TuneAvailableList
              availablePerson={availablePerson}
              day={days[hoverTable.col]}
              hour={hourSlots[Math.floor(hoverTable.row / 2)]}
              half={hoverTable.row % 2 === 1 ? true : false}
              key={`${hoverTable.col}-${hoverTable.row}`}
            />
          ) : (
            <TunePersonalTable
              hourSlots={hourSlots}
              days={days}
              personalTune={personalTune}
              setPersonalTune={setPersonalTune}
              tune_id={tune_id}
            />
          )}
        </div>
        <div className='min-w-[600px]'>
          <TuneTable
            tuneDetailData={tuneDetailData}
            hourSlots={hourSlots}
            grid={grid}
            days={days}
            setHoverTable={setHoverTable}
          />
        </div>
      </div>
    </div>
  );
};

export default TuneInformation;
