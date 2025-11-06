import { useCallback, useEffect, useState } from 'react';

type UseDragParams = {
  personalTune: number[][];
  setPersonalTune: React.Dispatch<React.SetStateAction<number[][]>>;
};

export const useDrag = ({ personalTune, setPersonalTune }: UseDragParams) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragStartValue, setDragStartValue] = useState<number | null>(null);

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
            if (dragStartValue === 1) return 0;
            else return 1;
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

  return {
    isDragging,
    dragStart,
    dragEnd,
    dragStartValue,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isCellSelected,
  };
};
