import React from 'react';
import { useDrag } from '../hooks';
import { useTuneParticipantAdd } from '../hooks/useTuneParticipantAdd';

type TunePersonalTableProps = {
  hourSlots: string[];
  days: string[];
  personalTune: number[][];
  setPersonalTune: React.Dispatch<React.SetStateAction<number[][]>>;
  tune_id: number;
};

const TunePersonalTable = ({
  hourSlots,
  days,
  personalTune,
  setPersonalTune,
  tune_id,
}: TunePersonalTableProps) => {
  const { handleMouseDown, handleMouseEnter, handleMouseUp, isCellSelected } =
    useDrag({ personalTune, setPersonalTune });
  const { mutate: saveTune } = useTuneParticipantAdd();

  const handleSaveClick = () => {
    const candidate_dates = personalTune.flat().map((v) => (v ? 1 : 0));

    saveTune({
      tune_id,
      candidate_dates,
    });
  };

  return (
    <div
      className='max-h-[950px] overflow-y-auto flex flex-col items-center'
      onMouseUp={handleMouseUp}
    >
      <table>
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th
                key={day}
                className='border-b border-gray-800 px-2 py-2 text-center text-xs'
              >
                {day.split(' ')[0]} <br /> {day.split(' ')[1]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(personalTune) &&
            personalTune.length > 0 &&
            Array.from({ length: personalTune[0].length / 2 }).map(
              (_, hourIdx) => {
                const rows = [hourIdx * 2, hourIdx * 2 + 1];

                return (
                  <React.Fragment key={hourIdx}>
                    {rows.map((rowIdx, index) => (
                      <tr
                        key={`${hourIdx}-${rowIdx}`}
                        className={`border-gray-800 ${index === 0 ? 'border-b border-dotted' : ''}`}
                      >
                        {index === 0 && (
                          <td
                            className='border-r border-gray-800 px-2 py-2 text-xs font-bold text-center select-none'
                            rowSpan={2}
                          >
                            {hourSlots[hourIdx]}
                          </td>
                        )}
                        {personalTune.map((_, colIdx) => {
                          const isSelected = isCellSelected(rowIdx, colIdx);
                          return (
                            <td
                              key={`${colIdx}-${rowIdx}`}
                              className={`border-r border-gray-800 px-2 py-1 cursor-pointer ${
                                isSelected ? 'bg-blue-400' : 'bg-red-100'
                              } ${index === 1 ? 'border-b' : ''}`}
                              onMouseDown={() =>
                                handleMouseDown(rowIdx, colIdx)
                              }
                              onMouseEnter={() =>
                                handleMouseEnter(rowIdx, colIdx)
                              }
                            />
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              },
            )}
        </tbody>
      </table>
      <button
        className='my-4 px-4 py-1 bg-primary text-white rounded-lg text-sm font-bold'
        onClick={handleSaveClick}
        type='button'
      >
        저장
      </button>
    </div>
  );
};

export default TunePersonalTable;
