import React, { useState } from 'react';
import { Search, Camera, X } from 'lucide-react';
import Toast from '@/components/common/Toast';

interface StudyFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  maxMembers: number;
  image?: File;
}

const categories = [
  '어학',
  '프로그래밍',
  '취업',
  '고시/공무원',
  '취미/교양',
  '자율/기타',
];
const memberOptions = [
  '2인',
  '3인',
  '4인',
  '5인',
  '6인',
  '7인',
  '8인',
  '9인',
  '10인',
];

const StudyCreatePage: React.FC = () => {
  const [formData, setFormData] = useState<StudyFormData>({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    maxMembers: 2,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const handleInputChange = (
    field: keyof StudyFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      isVisible: true,
      type,
      message,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('스터디 생성 데이터:', {
      ...formData,
      categories: selectedCategories,
    });

    // 성공 토스트 표시
    showToast('success', '스터디 생성이 완료되었습니다.');

    // 폼 초기화
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      category: '',
      maxMembers: 2,
    });
    setSelectedCategories([]);
    setImagePreview(null);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* 헤더 */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                  <div className='w-4 h-4 bg-white rounded-sm'></div>
                </div>
                <span className='text-xl font-bold text-gray-900'>파도</span>
              </div>
            </div>

            <div className='flex-1 max-w-md mx-8'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                <input
                  type='text'
                  placeholder='스터디 검색...'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-blue-600 rounded-full'></div>
              <span className='text-sm font-medium text-gray-900'>김경대</span>
            </div>
          </div>
        </div>
      </div>

      <div className='flex'>
        {/* 사이드바 */}
        <div className='w-64 bg-white shadow-sm border-r min-h-screen'>
          <div className='p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-6'>
              스터디 생성
            </h2>

            <div className='space-y-3'>
              {categories.map((category) => (
                <label
                  key={category}
                  className='flex items-center space-x-3 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className='flex-1 p-6'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-2xl font-bold text-gray-900 mb-8'>
              스터디 생성
            </h1>

            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* 스터디 이름 */}
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  스터디 이름
                </label>
                <input
                  type='text'
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='스터디 이름'
                />
              </div>

              {/* 스터디 한 줄 소개 */}
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  스터디 한 줄 소개
                </label>
                <input
                  type='text'
                  required
                  value={formData.shortDescription}
                  onChange={(e) =>
                    handleInputChange('shortDescription', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='스터디에 대한 간략한 설명'
                />
              </div>

              {/* 스터디 설명 */}
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  스터디 설명
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='스터디에 대한 상세한 설명'
                />
              </div>

              {/* 스터디 카테고리 */}
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <label className='block text-sm font-medium text-gray-700 mb-4'>
                  스터디 카테고리
                </label>
                <div className='flex flex-wrap gap-2'>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type='button'
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      + {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 스터디 인원 */}
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  스터디 인원
                </label>
                <select
                  value={formData.maxMembers}
                  onChange={(e) =>
                    handleInputChange('maxMembers', parseInt(e.target.value))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  {memberOptions.map((option, index) => (
                    <option key={option} value={index + 2}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 스터디 대표 이미지 */}
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <label className='block text-sm font-medium text-gray-700 mb-4'>
                  스터디 대표 이미지
                </label>

                {!imagePreview ? (
                  <div className='flex items-center justify-center w-full'>
                    <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                      <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                        <Camera className='w-8 h-8 mb-4 text-gray-500' />
                        <p className='mb-2 text-sm text-gray-500'>
                          <span className='font-semibold'>
                            클릭하여 대표 이미지를 설정해주세요
                          </span>
                        </p>
                      </div>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        className='hidden'
                      />
                    </label>
                  </div>
                ) : (
                  <div className='relative'>
                    <img
                      src={imagePreview}
                      alt='스터디 이미지 미리보기'
                      className='w-full h-48 object-cover rounded-lg'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, image: undefined }));
                      }}
                      className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                )}
              </div>

              {/* 제출 버튼 */}
              <div className='flex justify-end'>
                <button
                  type='submit'
                  className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  생성하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 토스트 알림 */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default StudyCreatePage;
