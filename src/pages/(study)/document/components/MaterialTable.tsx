import { FileText, Paperclip, Check } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';
import { formatDate } from '../utils';
import type { Material } from '../types';
import { MATERIAL_CATEGORIES } from '../constants';

interface MaterialTableProps {
  materials: Material[];
  selectedMaterials: string[];
  onSelectMaterial: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onMaterialClick: (id: string) => void;
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
}: MaterialTableProps) => {
  const getCategoryName = (categoryId: string) => {
    return (
      MATERIAL_CATEGORIES.find((cat) => cat.id === categoryId)?.name ||
      categoryId
    );
  };

  const isAllSelected =
    materials.length > 0 && selectedMaterials.length === materials.length;
  const isPartiallySelected =
    selectedMaterials.length > 0 && selectedMaterials.length < materials.length;

  if (materials.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
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
                    <span className='inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-primary/10 text-primary whitespace-nowrap'>
                      {getCategoryName(material.category)}
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialTable;
