import { useMemo } from 'react';
import {
  Filter,
  ChevronDown,
  SortDesc,
  SortAsc,
  Search,
  X,
  Check,
} from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';
import { MATERIAL_CATEGORIES_KR } from '../constants';
import type { Material } from '../types';

interface FilterBarProps {
  materials: Material[];
  // 주차 옵션 계산에 사용할 원본 재료(주차 비필터 목록). 없으면 materials 사용
  weekSourceMaterials?: Material[];
  selectedWeeks: string[];
  onChangeWeeks: (weeks: string[]) => void;
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
  onClearCategory: () => void;
  sort: string;
  onToggleSort: () => void;
  search: string;
  onChangeSearch: (term: string) => void;
}

const FilterBar = ({
  materials,
  weekSourceMaterials,
  selectedWeeks,
  onChangeWeeks,
  selectedCategories,
  onToggleCategory,
  onClearCategory,
  sort,
  onToggleSort,
  search,
  onChangeSearch,
}: FilterBarProps) => {
  const weekOptions = useMemo(() => {
    const source = weekSourceMaterials ?? materials;
    const weeks = Array.from(new Set(source.map((m) => m.week))).filter(
      (w) => typeof w === 'number' && w > 0,
    ) as number[];
    return weeks
      .sort((a, b) => a - b)
      .map((w) => ({ id: `week${w}`, label: `${w}주차` }));
  }, [weekSourceMaterials, materials]);

  const isAllWeeksSelected =
    weekOptions.length > 0 && selectedWeeks.length === weekOptions.length;
  const isPartialWeeksSelected =
    selectedWeeks.length > 0 && selectedWeeks.length < weekOptions.length;

  const toggleWeek = (id: string) => {
    if (selectedWeeks.includes(id)) {
      onChangeWeeks(selectedWeeks.filter((w) => w !== id));
    } else {
      onChangeWeeks([...selectedWeeks, id]);
    }
  };

  const toggleAllWeeks = () => {
    onChangeWeeks(isAllWeeksSelected ? [] : weekOptions.map((w) => w.id));
  };

  return (
    <div className='px-4 py-3 border-b border-border bg-background'>
      <div className='flex flex-wrap items-center gap-2'>
        <div className='flex items-center gap-2 px-2 py-1 rounded-lg bg-accent/40'>
          <Filter className='w-4 h-4 text-muted-foreground' />
          <span className='text-sm text-muted-foreground'>필터</span>
        </div>

        {/* 주차 드롭다운 (멀티 선택) */}
        <div className='relative'>
          <details className='group'>
            <summary
              className={cn(
                'list-none inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm border cursor-pointer select-none whitespace-nowrap',
                isAllWeeksSelected || isPartialWeeksSelected
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'text-foreground border-border hover:bg-accent/50',
              )}
            >
              <span>주차 선택</span>
              <span
                className={cn(
                  'inline-flex items-center justify-center text-xs rounded h-5 w-9',
                  selectedWeeks.length > 0
                    ? 'bg-primary/10 text-primary opacity-100'
                    : 'opacity-0',
                )}
              >
                {selectedWeeks.length}
              </span>
              <ChevronDown className='w-4 h-4' />
            </summary>
            <div className='absolute z-10 mt-2 w-56 border border-border rounded-lg shadow-lg p-2 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md'>
              <div className='flex items-center justify-between px-2 py-1.5'>
                <span className='text-xs text-muted-foreground'>주차 선택</span>
                <button
                  className={cn(
                    'text-xs text-muted-foreground hover:text-foreground px-1 py-0.5 rounded hover:bg-accent text-right w-16',
                    selectedWeeks.length > 0
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none',
                  )}
                  onClick={() => onChangeWeeks([])}
                  type='button'
                >
                  선택 해제
                </button>
              </div>
              <button
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                  isAllWeeksSelected
                    ? 'bg-primary/10 text-primary'
                    : isPartialWeeksSelected
                      ? 'bg-primary/5 text-primary'
                      : 'hover:bg-accent/50',
                )}
                onClick={toggleAllWeeks}
                type='button'
              >
                <span className='flex-1 text-left'>전체</span>
                <span className='text-xs text-muted-foreground'>
                  {weekOptions.length}
                </span>
              </button>
              <div className='my-1 h-px bg-border' />
              {weekOptions.length === 0 && (
                <div className='px-3 py-2 text-sm text-muted-foreground'>
                  주차 없음
                </div>
              )}
              <div className='flex flex-col gap-1.5'>
                {weekOptions.map((w) => {
                  const selected = selectedWeeks.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                        selected
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent/50',
                      )}
                      onClick={() => toggleWeek(w.id)}
                      type='button'
                    >
                      <span className='flex-1 text-left'>{w.label}</span>
                      {selected && <Check className='w-4 h-4 text-primary' />}
                    </button>
                  );
                })}
              </div>
            </div>
          </details>
        </div>

        {/* 카테고리 토글 */}
        <div className='flex items-center gap-2 flex-wrap'>
          {MATERIAL_CATEGORIES_KR.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                cat.id === 'all' ? onClearCategory() : onToggleCategory(cat.id)
              }
              className={cn(
                'px-3 py-1 rounded-lg text-sm border',
                cat.id === 'all'
                  ? 'border-muted-foreground text-muted-foreground hover:bg-accent'
                  : selectedCategories.includes(cat.id)
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'text-foreground border-border hover:bg-accent/50',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 정렬 토글 */}
        <div className='ml-auto flex items-center gap-2'>
          <button
            onClick={onToggleSort}
            className='px-3 py-1 rounded-lg text-sm border border-border hover:bg-accent/50 inline-flex items-center gap-2'
            type='button'
          >
            {sort === 'createdAt,desc' ? (
              <>
                <SortDesc className='w-4 h-4' />
                최신순
              </>
            ) : (
              <>
                <SortAsc className='w-4 h-4' />
                오래된순
              </>
            )}
          </button>
        </div>

        {/* 검색 */}
        <div className='w-full md:w-60 ml-0 md:ml-2'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4' />
            <input
              type='text'
              placeholder='자료 검색'
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              className={cn(
                'w-full pl-10 pr-8 py-2 border border-border rounded-lg text-sm',
                'bg-background text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                'transition-all duration-200 hover:border-primary/50',
              )}
            />
            {search && (
              <button
                className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent'
                onClick={() => onChangeSearch('')}
                type='button'
                aria-label='검색어 지우기'
              >
                <X className='w-4 h-4 text-muted-foreground' />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
