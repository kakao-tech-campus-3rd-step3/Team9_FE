import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, FileText, Trash2, X } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';
import {
  MaterialSearch,
  MaterialTable,
  WeekFilter,
  ConfirmDialog,
} from './components';
import { mockMaterials } from './mock';
import { TOAST_MESSAGES } from './constants';
import type { Material } from './types';

/**
 * 문서 관리 페이지
 */
const DocumentPage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [materials] = useState<Material[]>(mockMaterials); // 자료 목록
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]); // 선택된 자료 ID 목록
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]); // 선택된 주차 필터
  const [search, setSearch] = useState(''); // 검색어
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 삭제 확인 다이얼로그 상태

  // 주차별 필터와 검색어에 따른 자료 목록 필터링
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesWeeks =
        selectedWeeks.length === 0 || selectedWeeks.includes(material.category);
      const matchesSearch =
        search === '' ||
        material.title.toLowerCase().includes(search.toLowerCase()) ||
        material.content.toLowerCase().includes(search.toLowerCase());
      return matchesWeeks && matchesSearch;
    });
  }, [materials, selectedWeeks, search]);

  // 네비게이션 핸들러
  const handleMaterialClick = (id: string) => navigate(`/study/document/${id}`);
  const handleAddMaterial = () => navigate('/study/document/add');

  // 자료 선택 관련 핸들러
  const handleSelectMaterial = (id: string) => {
    setSelectedMaterials(
      selectedMaterials.includes(id)
        ? selectedMaterials.filter((materialId) => materialId !== id)
        : [...selectedMaterials, id],
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedMaterials(selected ? filteredMaterials.map((m) => m.id) : []);
  };

  const handleClearSelection = () => setSelectedMaterials([]);

  // 액션 핸들러
  const handleCreateQuiz = () => {
    toast.success(TOAST_MESSAGES.QUIZ_CREATE_SUCCESS);
    setSelectedMaterials([]);
  };

  const handleDeleteMaterials = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    toast.error(TOAST_MESSAGES.DELETE_MULTIPLE_SUCCESS);
    setSelectedMaterials([]);
    setIsConfirmOpen(false);
  };

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 헤더 */}
      <div className='flex items-center justify-between px-6 py-6 border-b border-border bg-background'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>문서 관리</h1>
        </div>

        <div className='flex items-center gap-3'>
          {/* 선택된 항목이 있을 때 액션 버튼들 */}
          {selectedMaterials.length > 0 && (
            <>
              <div className='flex items-center gap-2'>
                <span className='text-base font-semibold text-foreground'>
                  {selectedMaterials.length}개 선택
                </span>
                <button
                  onClick={handleClearSelection}
                  className='p-1.5 hover:bg-accent rounded-lg transition-colors'
                  aria-label='선택 해제'
                >
                  <X className='w-4 h-4 text-muted-foreground hover:text-foreground' />
                </button>
              </div>
              <div className='h-6 w-px bg-border' />
              <div className='flex gap-2'>
                <button
                  onClick={handleCreateQuiz}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm',
                    'hover:bg-primary-hover transition-colors font-semibold',
                  )}
                >
                  <FileText className='w-4 h-4' />
                  <span>퀴즈 생성</span>
                </button>
                <button
                  onClick={handleDeleteMaterials}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg text-sm',
                    'hover:bg-destructive-hover transition-colors font-semibold',
                  )}
                >
                  <Trash2 className='w-4 h-4' />
                  <span>삭제</span>
                </button>
              </div>
            </>
          )}

          {/* 추가 버튼 */}
          <button
            onClick={handleAddMaterial}
            className='flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary-hover transition-colors font-semibold'
          >
            <Plus className='w-4 h-4' />
            <span>추가</span>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className='flex-1 flex overflow-hidden'>
        {/* 주차별 필터 */}
        <WeekFilter
          materials={materials}
          selectedWeeks={selectedWeeks}
          onWeekChange={setSelectedWeeks}
        />

        {/* 검색 + 테이블 영역 */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* 검색 */}
          <MaterialSearch searchTerm={search} onSearchChange={setSearch} />

          {/* 테이블 */}
          <div className='flex-1 overflow-y-auto bg-background p-4'>
            <MaterialTable
              materials={filteredMaterials}
              selectedMaterials={selectedMaterials}
              onSelectMaterial={handleSelectMaterial}
              onSelectAll={handleSelectAll}
              onMaterialClick={handleMaterialClick}
            />
          </div>
        </div>
      </div>

      {/* 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title='자료 삭제'
        message={`선택된 ${selectedMaterials.length}개의 자료를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default DocumentPage;
