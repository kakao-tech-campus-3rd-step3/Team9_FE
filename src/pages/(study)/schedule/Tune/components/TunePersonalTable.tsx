import React from 'react';
import { useDrag } from '../hooks';

type TunePersonalTableProps = {
  hourSlots: string[];
  days: string[];
  personalTune: boolean[][];
  setPersonalTune: React.Dispatch<React.SetStateAction<boolean[][]>>;
};

const TunePersonalTable = ({
  hourSlots,
  days,
  personalTune,
  setPersonalTune,
}: TunePersonalTableProps) => {
  const { handleMouseDown, handleMouseEnter, handleMouseUp, isCellSelected } =
    useDrag({ personalTune, setPersonalTune });

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
    </div>
  );
};

export default TunePersonalTable;
