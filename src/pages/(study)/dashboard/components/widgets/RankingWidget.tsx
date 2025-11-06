import { Trophy } from 'lucide-react';
import { SectionCard } from '../common';
import type { RankingData } from '../../types';
import { cn } from '../../utils';

interface RankingWidgetProps {
  data?: RankingData;
  isLoading?: boolean;
  onClick?: () => void;
}

/**
 * 랭킹 위젯 컴포넌트
 * - 상위 N명의 랭킹과 본인 순위를 표시
 */
const RankingWidget = ({
  data,
  isLoading = false,
  onClick,
}: RankingWidgetProps) => {
  if (isLoading) {
    return (
      <SectionCard icon={Trophy} title='랭킹' onClick={onClick}>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>로딩 중...</p>
        </div>
      </SectionCard>
    );
  }

  if (!data || !data.rankings || data.rankings.length === 0) {
    return (
      <SectionCard icon={Trophy} title='랭킹' onClick={onClick}>
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>랭킹 데이터가 없습니다.</p>
        </div>
      </SectionCard>
    );
  }

  const topRankings = data.rankings.slice(0, 5); // 상위 5명
  const myRank = data.myRanking;

  const getRankBadgeColor = (rank: number, isMe: boolean) => {
    if (isMe) return 'bg-primary text-primary-foreground';

    const rankColors: Record<number, string> = {
      1: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
      2: 'bg-gray-400/20 text-gray-700 border-gray-400/30',
      3: 'bg-amber-600/20 text-amber-700 border-amber-600/30',
    };

    const color = rankColors[rank];
    if (color) return color;

    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <SectionCard icon={Trophy} title='랭킹' onClick={onClick}>
      <div className='space-y-4'>
        {/* 상위 랭킹 목록 */}
        <div className='space-y-2'>
          {topRankings.map((item) => {
            const isMe = item.isMe || myRank.userId === item.userId;

            return (
              <div
                key={item.userId}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-colors',
                  isMe
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-card border-border hover:bg-accent/50',
                )}
              >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm border-2',
                      getRankBadgeColor(item.rank, isMe),
                    )}
                  >
                    {item.rank}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={cn(
                          'font-semibold truncate',
                          isMe ? 'text-primary' : 'text-foreground',
                        )}
                      >
                        {item.userName}
                      </span>
                      {isMe && (
                        <span className='text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full font-medium'>
                          나
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-bold text-foreground'>
                    {item.score}점
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 본인 순위 하이라이트 (상위 5명에 포함되지 않은 경우) */}
        {myRank && !topRankings.some((r) => r.userId === myRank.userId) && (
          <div className='pt-3 border-t border-border'>
            <div className='flex items-center justify-between p-3 rounded-lg bg-primary/5 border-2 border-primary/30'>
              <div className='flex items-center gap-3 flex-1 min-w-0'>
                <div className='flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-primary text-primary-foreground border-2 border-primary/50'>
                  {myRank.rank}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-primary truncate'>
                      {myRank.userName}
                    </span>
                    <span className='text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full font-medium'>
                      나
                    </span>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm font-bold text-primary'>
                  {myRank.score}점
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 전체 참여자 수 */}
        {data.totalCount > 0 && (
          <div className='text-center text-xs text-muted-foreground pt-2 border-t border-border'>
            전체 {data.totalCount}명 참여
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default RankingWidget;
