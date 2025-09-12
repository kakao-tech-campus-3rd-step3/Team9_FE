import React from 'react';
import { tuneCheckData } from '../mock/tuneCheck';
import {
  buildGrid,
  countOnes,
  getBgColor,
  getHourSlots,
  getTuneDay,
} from '../utils';

const TuneTable = () => {
  const hourSlots = getHourSlots(
    tuneCheckData.start_time,
    tuneCheckData.end_time,
  );
  const grid = buildGrid({
    data: tuneCheckData.candidate_dates,
    startTime: tuneCheckData.available_start_time,
    endTime: tuneCheckData.available_end_time,
  });
  const days = getTuneDay({
    startTime: tuneCheckData.available_start_time,
    endTime: tuneCheckData.available_end_time,
  });

  return (
    <div className='max-h-[950px] overflow-y-auto'>
      <table>
        <thead>
          <tr>
            <th></th>
            {days.map((day) => (
              <th
                key={day}
                className='border-b border-gray-800 px-2 py-2 text-center text-xs'
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: grid[0].length / 2 }).map((_, hourIdx) => {
            return (
              <React.Fragment key={hourIdx}>
                <tr className='border-b border-dotted border-gray-800'>
                  <td
                    className='border-r border-gray-800 px-2 py-2 text-xs font-bold'
                    rowSpan={2}
                  >
                    {hourSlots[hourIdx]}
                  </td>
                  {grid.map((daySlots, colIdx) => {
                    const value = daySlots[hourIdx * 2];
                    const people = countOnes(value);
                    return (
                      <td
                        key={`${colIdx}-${hourIdx}-1`}
                        className={`border-r border-gray-800px-2 py-1 ${getBgColor(
                          {
                            count: people,
                            maxCount: tuneCheckData.participants.length,
                          },
                        )}`}
                      />
                    );
                  })}
                </tr>
                <tr className='border-gray-800'>
                  {grid.map((daySlots, colIdx) => {
                    const value = daySlots[hourIdx * 2 + 1];
                    const people = countOnes(value);
                    return (
                      <td
                        key={`${colIdx}-${hourIdx}-2`}
                        className={`border-r border-b border-gray-800 px-2 py-1 ${getBgColor(
                          {
                            count: people,
                            maxCount: tuneCheckData.participants.length,
                          },
                        )}`}
                      />
                    );
                  })}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TuneTable;
