import React, { useCallback, useEffect } from 'react';

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
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = React.useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragStartValue, setDragStartValue] = React.useState<boolean | null>(
    null,
  );

  const handleMouseDown = (row: number, col: number) => {
    setIsDragging(true);
    setDragStart({ row, col });
    setDragEnd({ row, col });
    setDragStartValue(personalTune[col][row]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      setDragEnd({ row, col });
    }
  };

  const handleMouseUp = useCallback(() => {
    if (!dragStart || !dragEnd) return;
    const startRow = Math.min(dragStart.row, dragEnd.row);
    const endRow = Math.max(dragStart.row, dragEnd.row);
    const startCol = Math.min(dragStart.col, dragEnd.col);
    const endCol = Math.max(dragStart.col, dragEnd.col);

    setPersonalTune((prev) => {
      const newGrid = prev.map((daySlots, colIdx) =>
        daySlots.map((slot, rowIdx) => {
          if (
            colIdx >= startCol &&
            colIdx <= endCol &&
            rowIdx >= startRow &&
            rowIdx <= endRow
          ) {
            return !dragStartValue;
          }
          return slot;
        }),
      );
      return newGrid;
    });
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [dragStart, dragEnd, dragStartValue, setPersonalTune]);

  const isCellSelected = (row: number, col: number) => {
    const baseSelected = personalTune[col][row];
    if (isDragging && dragStart && dragEnd) {
      const startRow = Math.min(dragStart.row, dragEnd.row);
      const endRow = Math.max(dragStart.row, dragEnd.row);
      const startCol = Math.min(dragStart.col, dragEnd.col);
      const endCol = Math.max(dragStart.col, dragEnd.col);

      if (
        col >= startCol &&
        col <= endCol &&
        row >= startRow &&
        row <= endRow
      ) {
        return !dragStartValue;
      }
    }
    return baseSelected;
  };

  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, handleMouseUp]);

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
          {Array.from({ length: personalTune[0].length / 2 }).map(
            (_, hourIdx) => {
              return (
                <React.Fragment key={hourIdx}>
                  <tr className='border-b border-dotted border-gray-800'>
                    <td
                      className='border-r border-gray-800 px-2 py-2 text-xs font-bold text-center select-none'
                      rowSpan={2}
                    >
                      {hourSlots[hourIdx]}
                    </td>
                    {personalTune.map((_, colIdx) => {
                      const boolean = isCellSelected(hourIdx * 2, colIdx);
                      return (
                        <td
                          key={`${colIdx}-${hourIdx}-1`}
                          className={`border-r border-gray-800 px-2 py-1 cursor-pointer ${boolean ? 'bg-blue-400' : 'bg-red-100'}`}
                          onMouseDown={() =>
                            handleMouseDown(hourIdx * 2, colIdx)
                          }
                          onMouseEnter={() =>
                            handleMouseEnter(hourIdx * 2, colIdx)
                          }
                        />
                      );
                    })}
                  </tr>
                  <tr className='border-gray-800'>
                    {personalTune.map((_, colIdx) => {
                      const boolean = isCellSelected(hourIdx * 2 + 1, colIdx);
                      return (
                        <td
                          key={`${colIdx}-${hourIdx}-2`}
                          className={`border-r border-b border-gray-800 px-2 py-1 cursor-pointer ${boolean ? 'bg-blue-400' : 'bg-red-100'}`}
                          onMouseDown={() =>
                            handleMouseDown(hourIdx * 2 + 1, colIdx)
                          }
                          onMouseEnter={() =>
                            handleMouseEnter(hourIdx * 2 + 1, colIdx)
                          }
                        />
                      );
                    })}
                  </tr>
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
