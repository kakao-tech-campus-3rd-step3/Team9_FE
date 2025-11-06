import { Trophy } from 'lucide-react';
import type { MyRanking } from '../types';

interface TitleRankingSectionProps {
  studyTitle?: string;
  myRanking?: MyRanking;
  onOpenRanking?: () => void;
  isLoading?: boolean;
}

const TitleRankingSection = ({
  studyTitle,
  myRanking,
  onOpenRanking,
  isLoading,
}: TitleRankingSectionProps) => {
  const getRankDisplay = (rank: number) => {
    if (rank <= 3) {
      const rankStyles = [
        {
          bgColor: 'bg-yellow-500',
          shadowColor: 'shadow-yellow-500/20',
          rankBg: 'bg-yellow-100',
          rankText: 'text-yellow-800',
        },
        {
          bgColor: 'bg-gray-400',
          shadowColor: 'shadow-gray-400/20',
          rankBg: 'bg-gray-100',
          rankText: 'text-gray-800',
        },
        {
          bgColor: 'bg-amber-600',
          shadowColor: 'shadow-amber-600/20',
          rankBg: 'bg-amber-100',
          rankText: 'text-amber-800',
        },
      ];

      const style = rankStyles[rank - 1];

      return (
        <div
          className={`w-14 h-14 ${style.bgColor} rounded-full flex items-center justify-center shadow-md ${style.shadowColor} relative`}
        >
          <span className='text-2xl font-bold text-white leading-none'>
            {rank}
          </span>
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 ${style.rankBg} rounded-full flex items-center justify-center border border-border shadow-sm`}
          >
            <span
              className={`text-xs font-bold ${style.rankText} leading-none`}
            >
              등
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className='w-14 h-14 bg-muted rounded-full flex items-center justify-center shadow-md relative'>
        <span className='text-xl font-bold text-muted-foreground leading-none'>
          {rank}
        </span>
        <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-muted-foreground/10 rounded-full flex items-center justify-center border-2 border-white shadow-sm'>
          <span className='text-xs font-bold text-muted-foreground leading-none'>
            등
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className='flex items-center justify-between p-5 bg-card rounded-xl'>
      {/* 타이틀 섹션 */}
      <div className='flex-1'>
        <div className='flex items-center gap-3'>
          <div className='w-2 h-8 bg-primary rounded-full' />
          {isLoading ? (
            <div className='h-7 w-48 bg-accent/40 rounded-md animate-pulse' />
          ) : (
            <h1 className='text-3xl font-bold text-foreground tracking-tight'>
              {studyTitle}
            </h1>
          )}
        </div>
      </div>

      {/* 내 랭킹 박스: 클릭 시 순위 표 모달 오픈 */}
      {myRanking && (
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md'>
              <Trophy className='w-5 h-5 text-white' />
            </div>
            <div className='text-right'>
              <div className='text-sm font-medium text-muted-foreground'>
                내 랭킹
              </div>
              <div className='text-xs text-muted-foreground'>현재 순위</div>
            </div>
          </div>

          <button
            type='button'
            onClick={onOpenRanking}
            className='flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 focus:outline-none'
          >
            {getRankDisplay(myRanking.rank)}
            <div className='text-center'>
              <div className='text-lg font-bold text-primary'>
                {myRanking.score}점
              </div>
              <div className='text-xs text-muted-foreground'>획득 점수</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleRankingSection;
