import React, { useState } from 'react';
import { Search, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudyApplyModal from '@/components/Study/StudyApplyModal';
import Toast from '@/components/common/Toast';
import { ROUTES } from '@/constants';

interface Study {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  maxMembers: number;
  currentMembers: number;
  image?: string;
}

const mockStudies: Study[] = [
  {
    id: '1',
    title: 'A 스터디',
    description: '해당 스터디에 대한 간략한 설명',
    category: '어학',
    location: '대구광역시 북구',
    maxMembers: 8,
    currentMembers: 3,
  },
  {
    id: '2',
    title: 'B 스터디',
    description: '해당 스터디에 대한 간략한 설명',
    category: '프로그래밍',
    location: '대구광역시 북구',
    maxMembers: 6,
    currentMembers: 4,
  },
  {
    id: '3',
    title: 'C 스터디',
    description: '해당 스터디에 대한 간략한 설명',
    category: '취업',
    location: '대구광역시 북구',
    maxMembers: 5,
    currentMembers: 2,
  },
  {
    id: '4',
    title: 'D 스터디',
    description: '해당 스터디에 대한 간략한 설명',
    category: '고시/공무원',
    location: '대구광역시 북구',
    maxMembers: 7,
    currentMembers: 5,
  },
];

const categories = [
  '전체',
  '어학',
  '취업',
  '고시/공무원',
  '취미/교양',
  '프로그래밍',
  '자율/기타',
];

const StudyExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('어학');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
    message: string;
  }>({
    isVisible: false,
    type: 'success',
    message: '',
  });

  const filteredStudies = mockStudies.filter((study) => {
    if (selectedCategory !== '전체' && study.category !== selectedCategory) {
      return false;
    }
    if (
      searchTerm &&
      !study.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleApplyClick = (study: Study) => {
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStudy(null);
  };

  const handleCreateStudy = () => {
    navigate(ROUTES.STUDY.CREATE);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              스터디 탐색
            </h2>

            <div className='space-y-3'>
              {categories.map((category) => (
                <label
                  key={category}
                  className='flex items-center space-x-3 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
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
          <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h1 className='text-xl font-semibold text-gray-900'>
                대구광역시 북구 근처 스터디
              </h1>
              <button className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'>
                지역 선택
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredStudies.map((study) => (
                <div
                  key={study.id}
                  className='bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow'
                >
                  <div className='p-6'>
                    <div className='mb-4'>
                      <div className='w-full h-32 bg-blue-600 rounded-lg mb-4 flex items-center justify-center'>
                        <div className='w-12 h-12 bg-white rounded-lg'></div>
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        {study.title}
                      </h3>
                      <p className='text-sm text-gray-600 mb-3'>
                        {study.description}
                      </p>
                      <div className='flex items-center text-sm text-gray-500 mb-3'>
                        <Users className='h-4 w-4 mr-1' />
                        <span>
                          참여자 수 {study.currentMembers}/{study.maxMembers}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyClick(study)}
                      className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
                    >
                      참여하기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudies.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-gray-500'>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        onClick={handleCreateStudy}
        className='fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center'
      >
        <Plus className='h-6 w-6' />
      </button>

      {/* 스터디 신청 모달 */}
      <StudyApplyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        studyTitle={selectedStudy?.title || ''}
      />

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

export default StudyExplorePage;
