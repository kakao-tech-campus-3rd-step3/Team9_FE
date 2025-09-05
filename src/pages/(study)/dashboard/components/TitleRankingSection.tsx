import { Trophy } from 'lucide-react';
import type { StudyInfo, MyRanking } from '../types';

interface TitleRankingSectionProps {
  studyInfo: StudyInfo;
  myRanking: MyRanking;
}

const TitleRankingSection = ({
  studyInfo,
  myRanking,
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
    <div className='flex items-center justify-between p-6 bg-card rounded-xl'>
      {/* 타이틀 섹션 */}
      <div className='flex-1'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-2 h-8 bg-primary rounded-full'></div>
          <h1 className='text-4xl font-bold text-foreground'>
            {studyInfo.name}
          </h1>
        </div>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <div className='w-2 h-2 bg-primary/30 rounded-full'></div>
          <span className='text-sm font-medium'>스터디 대시보드</span>
        </div>
      </div>

      {/* 내 랭킹 섹션 */}
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

        <div className='flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-xl border border-primary/20'>
          {getRankDisplay(myRanking.rank)}
          <div className='text-center'>
            <div className='text-lg font-bold text-primary'>
              {myRanking.score}점
            </div>
            <div className='text-xs text-muted-foreground'>획득 점수</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleRankingSection;
