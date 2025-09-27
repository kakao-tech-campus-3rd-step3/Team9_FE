import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { REGIONS, type RegionKey } from '@/constants';
import BaseModal from '@/components/common/BaseModal';

interface RegionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegions?: string[];
  selectedRegion?: string;
  onRegionToggle?: (region: string) => void;
  onRegionSelect?: (region: string) => void;
  multiSelect?: boolean;
}

const RegionSelectModal: React.FC<RegionSelectModalProps> = ({
  isOpen,
  onClose,
  selectedRegions,
  selectedRegion,
  onRegionToggle,
  onRegionSelect,
  multiSelect = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const regionEntries = Object.entries(REGIONS) as [RegionKey, string][];

  const filteredRegions = regionEntries.filter(([, value]) =>
    value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRegionClick = (region: string) => {
    if (multiSelect && onRegionToggle) {
      onRegionToggle(region);
    } else if (!multiSelect && onRegionSelect) {
      onRegionSelect(region);
      onClose();
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title='지역 선택'>
      {/* 검색 입력 */}
      <div className='p-6 pb-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='지역 검색...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
          />
        </div>
      </div>

      {/* 지역 목록 */}
      <div className='flex-1 overflow-y-auto px-6 pb-6'>
        <div className='grid grid-cols-3 gap-3'>
          {filteredRegions.map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleRegionClick(value)}
              className={`text-center px-3 py-3 rounded-lg transition-colors ${
                multiSelect
                  ? selectedRegions?.includes(value)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                  : selectedRegion === value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
              }`}
            >
              <div className='flex flex-col items-center space-y-1'>
                <MapPin className='h-4 w-4' />
                <span className='text-sm font-medium'>{value}</span>
              </div>
            </button>
          ))}
        </div>

        {filteredRegions.length === 0 && (
          <div className='text-center py-8'>
            <MapPin className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <p className='text-muted-foreground'>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className='p-6 pt-4 border-t border-border'>
        {multiSelect ? (
          <div className='flex justify-between items-center'>
            <div className='text-sm text-muted-foreground'>
              {selectedRegions && selectedRegions.length > 0 && (
                <span>
                  {selectedRegions.includes('전체')
                    ? '전체 지역 선택됨'
                    : `${selectedRegions.length}개 지역 선택됨`}
                </span>
              )}
            </div>
            <div className='flex space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors'
              >
                완료
              </button>
            </div>
          </div>
        ) : (
          <div className='flex justify-end space-x-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary border border-border rounded-lg hover:bg-secondary-hover transition-colors'
            >
              취소
            </button>
            <button
              onClick={() => handleRegionClick('전체')}
              className='px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-hover transition-colors'
            >
              전체 지역
            </button>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default RegionSelectModal;
