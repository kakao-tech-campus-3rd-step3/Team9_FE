import { useState } from 'react';
import {
  StudyRoadmapTab,
  IndividualStatusTab,
  ProgressTab,
} from './components';

/**
 * 스터디 진척도 페이지
 * - 스터디 로드맵과 개인별 현황판 두 개의 탭으로 구성
 */
const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'status'>('roadmap');

  return (
    <div className='flex-1 overflow-y-auto bg-background'>
      <div className='p-6'>
        {/* 페이지 헤더 */}
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold text-foreground mb-2'>
            스터디 진척도
          </h1>
          <p className='text-muted-foreground'>
            스터디 진행 상황을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <ProgressTab activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 탭 컨텐츠 */}
        <div className='bg-card rounded-lg border border-border'>
          {activeTab === 'roadmap' && <StudyRoadmapTab />}
          {activeTab === 'status' && <IndividualStatusTab />}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
