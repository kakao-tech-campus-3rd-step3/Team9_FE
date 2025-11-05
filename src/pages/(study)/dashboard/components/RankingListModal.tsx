// 모달 내부 랭킹 표 UI 컴포넌트
import BaseModal from '@/components/common/BaseModal';
import type { RankingListItem } from '../utils/mapper';

interface RankingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: RankingListItem[];
}

const RankingListModal = ({
  isOpen,
  onClose,
  items,
}: RankingListModalProps) => {
  const rankBadgeClass = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-600 text-white';
    return 'bg-muted text-foreground';
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='스터디원 랭킹'
      maxWidth='max-w-xl'
    >
      <div className='p-5 min-w-[360px] min-h-[320px] bg-card'>
        {items.length === 0 ? (
          <div className='h-full flex items-center justify-center text-muted-foreground text-sm'>
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <div className='overflow-hidden rounded-xl border-2 border-border bg-card'>
            {/* 헤더: sticky + 대비 보더로 본문과 구분 */}
            <div className='sticky top-0 z-10 grid grid-cols-12 bg-accent/60 backdrop-blur px-5 py-3 text-[11px] font-semibold tracking-wide text-muted-foreground border-b-2 border-primary/20 shadow-sm'>
              <div className='col-span-2'>순위</div>
              <div className='col-span-7'>닉네임</div>
              <div className='col-span-3 text-right'>점수</div>
            </div>

            {/* 행들: 줄무늬 + 호버 강조 */}
            <div className='max-h-80 overflow-y-auto divide-y divide-border'>
              {items.map((item, idx) => (
                <div
                  key={`${item.userId}-${idx}`}
                  className='grid grid-cols-12 items-center px-5 py-3 text-sm transition-colors odd:bg-card even:bg-accent/10 hover:bg-accent/30'
                >
                  <div className='col-span-2'>
                    <div
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankBadgeClass(
                        item.rank,
                      )}`}
                    >
                      {item.rank}
                    </div>
                  </div>
                  <div className='col-span-7'>
                    <span className='font-medium text-foreground'>
                      {item.userName}
                    </span>
                  </div>
                  <div className='col-span-3 text-right'>
                    <span className='font-semibold'>{item.score}점</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default RankingListModal;
