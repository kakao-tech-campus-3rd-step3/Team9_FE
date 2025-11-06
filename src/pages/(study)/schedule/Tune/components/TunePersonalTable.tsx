import React from 'react';
import { useDrag } from '../hooks';
import { useTuneParticipantAdd } from '../hooks/useTuneParticipantAdd';
import TuneAddForm from './TuneAddForm';
import { useAuthStore } from '@/stores';

type TunePersonalTableProps = {
  hourSlots: string[];
  days: string[];
  personalTune: number[][];
  setPersonalTune: React.Dispatch<React.SetStateAction<number[][]>>;
  title: string;
  content: string;
  tune_id: number;
  complete: boolean;
  setComplete: React.Dispatch<React.SetStateAction<boolean>>;
};

const TunePersonalTable = ({
  hourSlots,
  days,
  personalTune,
  setPersonalTune,
  title,
  content,
  tune_id,
  complete,
  setComplete,
}: TunePersonalTableProps) => {
  const { handleMouseDown, handleMouseEnter, handleMouseUp, isCellSelected } =
    useDrag({ personalTune, setPersonalTune });
  const { mutate: saveTune } = useTuneParticipantAdd();
  const currentStudy = useAuthStore((state) => state.user.currentStudy);

  const handleSaveClick = () => {
    const candidate_dates = personalTune.flat().map((v) => (v ? 1 : 0));

    saveTune({
      tune_id,
      candidate_dates,
    });
  };

  return (
    <div
      className='h-full max-h-[950px] overflow-y-auto flex flex-col items-center'
      onMouseUp={handleMouseUp}
    >
      {!complete && (
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
      )}
      {complete && (
        <div className='h-full'>
          <TuneAddForm tune_id={tune_id} title={title} content={content} />
        </div>
      )}
      <div className='flex gap-4'>
        {currentStudy?.role !== 'MEMBER' && (
          <button
            className='my-4 px-4 py-1 border gorder-primary text-primary rounded-lg text-sm font-bold'
            onClick={() => setComplete(!complete)}
            type='button'
          >
            {complete ? '취소' : '일정 생성'}
          </button>
        )}
        <button
          className='my-4 px-4 py-1 bg-primary text-white rounded-lg text-sm font-bold'
          onClick={handleSaveClick}
          type='button'
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default TunePersonalTable;
