/**
 * 스터디 정보 관리 컴포넌트
 */

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { MapPin, Plus, X, Camera } from 'lucide-react';
import RegionSelectModal from '../../components/RegionSelectModal';
import { MOCK_STUDY_INFO, CATEGORIES } from '../constants';

interface StudyInfoFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  maxMembers: number;
  schedule: string;
  region: string;
  conditions: string[];
  image?: string;
}

export const StudyInfoManagement: React.FC = () => {
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [conditionInput, setConditionInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, register, handleSubmit, setValue, watch } =
    useForm<StudyInfoFormData>({
      defaultValues: {
        title: MOCK_STUDY_INFO.title,
        shortDescription: MOCK_STUDY_INFO.shortDescription,
        description: MOCK_STUDY_INFO.description,
        category: MOCK_STUDY_INFO.category,
        maxMembers: MOCK_STUDY_INFO.maxMembers,
        schedule: MOCK_STUDY_INFO.schedule,
        region: MOCK_STUDY_INFO.region,
        conditions: [...MOCK_STUDY_INFO.conditions], // 배열 복사본으로 명시적 설정
      },
    });

  const watchedConditions = watch('conditions');
  const watchedRegion = watch('region');

  const handleConditionAdd = () => {
    const value = conditionInput.trim();
    if (value && !watchedConditions.includes(value)) {
      setValue('conditions', [...watchedConditions, value]);
      setConditionInput('');
    }
  };

  const handleConditionRemove = (index: number) => {
    const updatedConditions = watchedConditions.filter((_, i) => i !== index);
    setValue('conditions', updatedConditions);
  };

  const handleConditionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConditionAdd();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setValue('image', '');
  };

  const onSubmit = (data: StudyInfoFormData) => {
    console.log('스터디 정보 수정:', data);
    // TODO: 실제 수정 로직 구현
  };

  return (
    <div className='bg-card rounded-lg border border-border p-6'>
      <div className='space-y-6'>
        <div>
          <h2 className='text-lg font-semibold text-foreground'>스터디 관리</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            스터디 정보를 수정할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* 스터디 이름 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 이름
            </label>
            <input
              {...register('title', { required: true })}
              className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              placeholder='스터디 이름을 입력하세요'
            />
          </div>

          {/* 스터디 한 줄 소개 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 한 줄 소개
            </label>
            <input
              {...register('shortDescription', { required: true })}
              className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              placeholder='스터디에 대한 간략한 설명'
            />
          </div>

          {/* 스터디 설명 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 설명
            </label>
            <textarea
              {...register('description', { required: true })}
              rows={4}
              className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none'
              placeholder='스터디에 대한 상세한 설명'
            />
          </div>

          {/* 스터디 카테고리 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 카테고리
            </label>
            <div className='flex flex-wrap gap-2'>
              {CATEGORIES.map((category) => (
                <Controller
                  key={category}
                  name='category'
                  control={control}
                  render={({ field }) => (
                    <button
                      type='button'
                      onClick={() => field.onChange(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        field.value === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {category}
                    </button>
                  )}
                />
              ))}
            </div>
          </div>

          {/* 스터디 인원 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 인원
            </label>
            <select
              {...register('maxMembers', { required: true })}
              className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}명
                </option>
              ))}
            </select>
          </div>

          {/* 스터디 시간 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 시간
            </label>
            <input
              {...register('schedule', { required: true })}
              className='w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              placeholder='예: 매주 토요일 오후 2시'
            />
          </div>

          {/* 스터디 지역 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 지역
            </label>
            <button
              type='button'
              onClick={() => setIsRegionModalOpen(true)}
              className='w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors'
            >
              <span className='flex items-center'>
                <MapPin className='h-4 w-4 mr-2 text-muted-foreground' />
                {watchedRegion || '지역을 선택하세요'}
              </span>
            </button>
          </div>

          {/* 참여조건 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              참여조건
            </label>
            <div className='flex gap-2 mb-3'>
              <input
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyPress={handleConditionKeyPress}
                className='flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                placeholder='참여조건을 입력하세요'
              />
              <button
                type='button'
                onClick={handleConditionAdd}
                className='flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
              >
                <Plus className='h-4 w-4' />
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {watchedConditions.map((condition, index) => (
                <span
                  key={index}
                  className='flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm'
                >
                  {condition}
                  <button
                    type='button'
                    onClick={() => handleConditionRemove(index)}
                    className='ml-2 text-muted-foreground hover:text-destructive'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 스터디 대표 이미지 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 대표 이미지
            </label>
            <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
              {imagePreview ? (
                <div className='relative'>
                  <img
                    src={imagePreview}
                    alt='스터디 대표 이미지'
                    className='max-w-full h-48 object-cover mx-auto rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={handleImageRemove}
                    className='absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ) : (
                <div>
                  <Camera className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <p className='text-muted-foreground mb-4'>
                    클릭하여 대표 이미지를 설정해주세요
                  </p>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                    id='image-upload'
                  />
                  <label
                    htmlFor='image-upload'
                    className='inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 cursor-pointer transition-colors'
                  >
                    <Camera className='h-4 w-4 mr-2' />
                    이미지 업로드
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 수정하기 버튼 */}
          <div className='flex justify-end'>
            <button
              type='submit'
              className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
            >
              수정하기
            </button>
          </div>
        </form>

        {/* 지역 선택 모달 */}
        <RegionSelectModal
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          selectedRegion={watchedRegion}
          onRegionSelect={(region: string) => {
            setValue('region', region);
            setIsRegionModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};
