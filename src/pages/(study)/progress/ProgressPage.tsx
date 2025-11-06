import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { study_id } = useParams<{ study_id: string }>();
  const studyId = study_id ? Number(study_id) : undefined;
  const [activeTab, setActiveTab] = useState<'roadmap' | 'status'>('roadmap');

  if (!studyId || !Number.isFinite(studyId)) {
    return (
      <div className='h-full flex items-center justify-center'>
        <p className='text-muted-foreground'>스터디 ID가 올바르지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 - 고정 */}
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background flex-shrink-0'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>스터디 진척도</h1>
        </div>
      </div>

      {/* 탭 네비게이션 - 고정 */}
      <div className='px-6 pt-6 bg-background flex-shrink-0'>
        <ProgressTab activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className='flex-1 px-6 pb-6 overflow-auto'>
        {activeTab === 'roadmap' && <StudyRoadmapTab studyId={studyId} />}
        {activeTab === 'status' && <IndividualStatusTab studyId={studyId} />}
      </div>
    </div>
  );
};

export default ProgressPage;
