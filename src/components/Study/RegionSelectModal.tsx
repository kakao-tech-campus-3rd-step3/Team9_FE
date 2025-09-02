import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { REGIONS, type RegionKey } from '@/constants';

interface RegionSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
}

const RegionSelectModal: React.FC<RegionSelectModalProps> = ({
  isOpen,
  onClose,
  selectedRegion,
  onRegionSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const regionEntries = Object.entries(REGIONS) as [RegionKey, string][];

  const filteredRegions = regionEntries.filter(([, value]) =>
    value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRegionClick = (region: string) => {
    onRegionSelect(region);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col'>
        {/* 모달 헤더 */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <div className='flex items-center space-x-2'>
            <MapPin className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-semibold text-foreground'>지역 선택</h2>
          </div>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

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
          <div className='space-y-2'>
            {filteredRegions.map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleRegionClick(value)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedRegion === value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <div className='flex items-center space-x-3'>
                  <MapPin className='h-4 w-4' />
                  <span className='font-medium'>{value}</span>
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
        </div>
      </div>
    </div>
  );
};

export default RegionSelectModal;
