import React from 'react';
import { tuneCheckData } from '../mock/tuneCheck';
import { countOnes, getBgColor } from '../utils';

type TuneTableProps = {
  hourSlots: string[];
  grid: number[][];
  days: string[];
  setHoverTable: React.Dispatch<
    React.SetStateAction<{ col: number; row: number } | null>
  >;
};

const TuneTable = ({
  hourSlots,
  grid,
  days,
  setHoverTable,
}: TuneTableProps) => {
  return (
    <div className='max-h-[950px] overflow-y-auto flex flex-col items-center'>
      <table onMouseLeave={() => setHoverTable(null)}>
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
          {Array.from({ length: grid[0].length / 2 }).map((_, hourIdx) => {
            const rows = [hourIdx * 2, hourIdx * 2 + 1];
            return (
              <React.Fragment key={hourIdx}>
                {rows.map((row, idx) => (
                  <tr
                    key={`${hourIdx}-${row}`}
                    className='border-b border-dotted border-gray-800'
                  >
                    {idx === 0 && (
                      <td
                        className='border-r border-gray-800 px-2 py-2 text-xs font-bold text-center'
                        rowSpan={2}
                      >
                        {hourSlots[hourIdx]}
                      </td>
                    )}
                    {grid.map((daySlots, colIdx) => {
                      const value = daySlots[row];
                      const people = countOnes(value);
                      return (
                        <td
                          key={`${colIdx}-${row}`}
                          onMouseEnter={() =>
                            setHoverTable({ col: colIdx, row })
                          }
                          className={`border-r border-gray-800 px-2 py-1 ${getBgColor(
                            {
                              count: people,
                              maxCount: tuneCheckData.participants.length,
                            },
                          )}`}
                        />
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className='flex mt-4'>
        <div className='border-r border-gray-800 px-2 py-1 text-xs font-bold'>
          0명 참가
        </div>
        {Array.from({ length: tuneCheckData.participants.length + 1 }).map(
          (_, idx) => (
            <div
              key={idx}
              className={`border-r border-y h-6 w-6 border-gray-800 px-2 py-2 text-xs font-bold ${getBgColor(
                {
                  count: idx,
                  maxCount: tuneCheckData.participants.length,
                },
              )}`}
            ></div>
          ),
        )}
        <div className='px-2 py-1 text-xs font-bold'>
          {tuneCheckData.participants.length}명 참가
        </div>
      </div>
    </div>
  );
};

export default TuneTable;
