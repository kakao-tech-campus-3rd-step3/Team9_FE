import { FileText, Paperclip, Check } from 'lucide-react';
import { SimpleSkeleton } from '@/components/common';
import { cn } from '@/pages/(study)/dashboard/utils';
import { formatDate, getWeekNameById, getCategoryKrName } from '../utils';
import type { Material } from '../types';

// 자료 목록 테이블: 선택/클릭 콜백을 부모로 위임
interface MaterialTableProps {
  materials: Material[];
  selectedMaterials: string[];
  onSelectMaterial: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onMaterialClick: (id: string) => void;
  isLoading?: boolean;
}

/**
 * 자료 테이블 컴포넌트
 */
const MaterialTable = ({
  materials,
  selectedMaterials,
  onSelectMaterial,
  onSelectAll,
  onMaterialClick,
  isLoading = false,
}: MaterialTableProps) => {
  const isAllSelected =
    materials.length > 0 && selectedMaterials.length === materials.length;
  const isPartiallySelected =
    selectedMaterials.length > 0 && selectedMaterials.length < materials.length;

  // 빈 상태 처리 (로딩 중이 아닐 때만)
  if (!isLoading && materials.length === 0) {
    return (
      <div className='bg-background border border-border rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted border-b border-border'>
              <tr>
                <th className='px-4 py-3 text-left'>
                  <input type='checkbox' className='w-4 h-4' disabled />
                </th>
                <th className='px-4 py-3 text-left font-medium text-muted-foreground'>
                  제목
                </th>
                <th className='px-4 py-3 text-left font-medium text-muted-foreground'>
                  주차
                </th>
                <th className='px-4 py-3 text-left font-medium text-muted-foreground'>
                  카테고리
                </th>
                <th className='px-4 py-3 text-left font-medium text-muted-foreground'>
                  첨부파일
                </th>
                <th className='px-4 py-3 text-left font-medium text-muted-foreground'>
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className='px-4 py-16 text-center'>
                  <div className='flex flex-col items-center justify-center'>
                    <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
                      <FileText className='w-8 h-8 text-muted-foreground' />
                    </div>
                    <h3 className='text-lg font-semibold text-foreground mb-2'>
                      자료가 없습니다
                    </h3>
                    <p className='text-muted-foreground'>
                      새로운 자료를 추가하거나 다른 필터를 선택해보세요.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-background border border-border rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-muted border-b border-border'>
            <tr>
              <th className='w-12 px-4 py-3 text-left'>
                <div className='flex items-center justify-center'>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200',
                      isAllSelected
                        ? 'bg-primary border-primary shadow-sm'
                        : isPartiallySelected
                          ? 'bg-primary/20 border-primary/50'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5',
                    )}
                    onClick={() => onSelectAll(!isAllSelected)}
                  >
                    {isAllSelected && (
                      <Check className='w-3.5 h-3.5 text-primary-foreground' />
                    )}
                    {isPartiallySelected && (
                      <div className='w-2.5 h-0.5 bg-primary rounded-full' />
                    )}
                  </div>
                </div>
              </th>
              <th className='px-4 py-3 text-left font-semibold text-foreground'>
                제목
              </th>
              <th className='px-4 py-3 text-left font-semibold text-foreground min-w-20'>
                날짜
              </th>
              <th className='px-4 py-3 text-left font-semibold text-foreground min-w-16'>
                주차
              </th>
              <th className='px-4 py-3 text-left font-semibold text-foreground min-w-16'>
                카테고리
              </th>
              <th className='px-4 py-3 text-left font-semibold text-foreground min-w-12 whitespace-nowrap'>
                첨부
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {materials.map((material) => {
              const isSelected = selectedMaterials.includes(material.id);
              return (
                <tr
                  key={material.id}
                  className={cn(
                    'hover:bg-accent/30 transition-all duration-200 group',
                    isSelected && 'bg-primary/5',
                  )}
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-center'>
                      <div
                        className={cn(
                          'w-5 h-5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200',
                          isSelected
                            ? 'bg-primary border-primary shadow-sm'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5',
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMaterial(material.id);
                        }}
                      >
                        {isSelected && (
                          <Check className='w-3.5 h-3.5 text-primary-foreground' />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 min-w-0'>
                    <div
                      className='flex items-center gap-3 min-w-0 cursor-pointer'
                      onClick={() => onMaterialClick(material.id)}
                    >
                      <div className='p-1.5 bg-primary/10 rounded-lg'>
                        <FileText className='w-4 h-4 text-primary' />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='font-semibold text-foreground truncate hover:text-primary transition-colors'>
                          {material.title}
                        </div>
                        <div className='text-sm text-muted-foreground truncate'>
                          {material.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 min-w-20'>
                    <div className='text-sm text-muted-foreground whitespace-nowrap'>
                      {formatDate(material.createdAt)}
                    </div>
                  </td>
                  <td className='px-4 py-3 min-w-16'>
                    {getCategoryKrName(material.category) === '학습자료' &&
                    material.week > 0 ? (
                      <span className='inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-primary/10 text-primary whitespace-nowrap'>
                        {getWeekNameById(`week${material.week}`)}
                      </span>
                    ) : (
                      <span className='text-sm text-muted-foreground'>-</span>
                    )}
                  </td>
                  <td className='px-4 py-3 min-w-16'>
                    <span className='inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-muted text-foreground whitespace-nowrap'>
                      {getCategoryKrName(material.category)}
                    </span>
                  </td>
                  <td className='px-4 py-3 min-w-12'>
                    {material.attachments.length > 0 ? (
                      <div className='flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap'>
                        <Paperclip className='w-4 h-4' />
                        <span className='font-semibold'>
                          {material.attachments.length}
                        </span>
                      </div>
                    ) : (
                      <span className='text-sm text-muted-foreground'>-</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* 로딩 중일 때 추가 스켈레톤 행들 */}
            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className='hover:bg-accent/30'>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-center'>
                      <div className='w-5'>
                        <SimpleSkeleton
                          height='h-5'
                          width='w-5'
                          className='rounded'
                        />
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <SimpleSkeleton
                        height='h-6'
                        width='w-6'
                        className='rounded'
                      />
                      <SimpleSkeleton height='h-4' width='w-3/4' />
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <SimpleSkeleton height='h-4' width='w-20' />
                  </td>
                  <td className='px-4 py-3'>
                    <SimpleSkeleton height='h-4' width='w-24' />
                  </td>
                  <td className='px-4 py-3'>
                    <SimpleSkeleton height='h-4' width='w-12' />
                  </td>
                  <td className='px-4 py-3'>
                    <SimpleSkeleton height='h-4' width='w-24' />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialTable;
