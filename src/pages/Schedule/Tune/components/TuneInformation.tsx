import { useState } from 'react';
import TunePersonalTable from './TunePersonalTable';
import TuneTable from './TuneTable';
import { buildGrid, getGridBoolean, getHourSlots, getTuneDay } from '../utils';
import { tuneCheckData } from '../mock/tuneCheck';
import TuneAvailableList from './TuneAvailableList';
import TuneParticipant from './TuneParticipant';

const TuneInformation = () => {
  const [hoverTable, setHoverTable] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const hourSlots = getHourSlots(
    tuneCheckData.start_time,
    tuneCheckData.end_time,
  );
  const grid = buildGrid({
    data: tuneCheckData.candidate_dates,
    startTime: tuneCheckData.available_start_time,
    endTime: tuneCheckData.available_end_time,
  });
  const gridBoolean = getGridBoolean({
    startTime: tuneCheckData.available_start_time,
    endTime: tuneCheckData.available_end_time,
  });
  const [personalTune, setPersonalTune] = useState(gridBoolean);
  const days = getTuneDay({
    startTime: tuneCheckData.available_start_time,
    endTime: tuneCheckData.available_end_time,
  });

  return (
    <div className='flex flex-col mt-2 p-4 border border-secondary rounded-lg bg-white'>
      <TuneParticipant participants={tuneCheckData.participants} />
      <div className='flex overflow-x-auto justify-between flex-nowrap whitespace-nowrap'>
        <div className='min-w-[600px]'>
          {hoverTable ? (
            <TuneAvailableList
              tuneNumber={grid[hoverTable.col][hoverTable.row]}
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
            />
          )}
        </div>
        <div className='min-w-[600px]'>
          <TuneTable
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
