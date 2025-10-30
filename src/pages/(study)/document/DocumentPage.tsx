import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, FileText, Trash2, X } from 'lucide-react';
import { cn } from '@/pages/(study)/dashboard/utils';
import {
  MaterialTable,
  ConfirmDialog,
  FilterBar,
  QuizCreateModal,
} from './components';
import {
  useMaterialsQuery,
  useDeleteMaterialsMutation,
} from './hooks/useMaterials';
import { TOAST_MESSAGES } from './constants';
import type { Material } from './types';
import { EmptyState } from './components/common';

/**
 * 문서 관리 페이지
 */
const DocumentPage = () => {
  const navigate = useNavigate();

  // 상태 관리 (서버 필터만 사용, 로컬 목록 상태 없음)
  const { study_id } = useParams<{ study_id: string }>();
  // URL 동기화 제거로 쿼리 파라미터 사용하지 않음
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]); // 선택된 자료 ID 목록
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]); // 선택된 주차 필터
  const [search, setSearch] = useState(''); // 검색어
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 삭제 확인 다이얼로그 상태
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false); // 퀴즈 생성 모달 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [sort, setSort] = useState<string>('createdAt,desc');

  // 목록 로드 (TanStack Query)
  const weekNumbers = selectedWeeks
    .map((w) => parseInt(w.replace('week', '')))
    .filter((n) => !Number.isNaN(n));
  const studyIdNum = Number(study_id);
  const materialsQuery = useMaterialsQuery(studyIdNum, {
    week: weekNumbers.length > 0 ? weekNumbers : undefined,
    category: selectedCategories.length > 0 ? selectedCategories : undefined,
    keyword: search || undefined,
    page,
    size,
    sort,
  });

  // 주차 드롭다운 옵션 계산용: 주차 필터만 제거하여 전체 주차를 보존
  const weekSourceQuery = useMaterialsQuery(studyIdNum, {
    category: selectedCategories.length > 0 ? selectedCategories : undefined,
    keyword: search || undefined,
    page: 0,
    size: 1000,
    sort,
  });

  // 서버 필터만 사용 (추가 클라이언트 필터 없음)
  // 로딩 중이어도 빈 배열을 전달하여 테이블 구조 유지
  const materialsFromQuery: Material[] = materialsQuery.isLoading
    ? []
    : ((materialsQuery.data?.materials as Material[]) ?? []);

  // 네비게이션 핸들러
  const handleMaterialClick = (id: string) => navigate(id);
  const handleAddMaterial = () => navigate('add');

  // 자료 선택 관련 핸들러
  const handleSelectMaterial = (id: string) => {
    setSelectedMaterials(
      selectedMaterials.includes(id)
        ? selectedMaterials.filter((materialId) => materialId !== id)
        : [...selectedMaterials, id],
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedMaterials(selected ? materialsFromQuery.map((m) => m.id) : []);
  };

  const handleClearSelection = () => setSelectedMaterials([]);

  // 액션 핸들러
  // - 퀴즈 생성(토스트), 다중 삭제(확인 모달)
  const handleCreateQuiz = () => {
    // 모달 오픈으로 변경
    setIsQuizModalOpen(true);
  };

  const handleDeleteMaterials = () => {
    setIsConfirmOpen(true);
  };

  const deleteMutation = useDeleteMaterialsMutation(Number(study_id));
  // 선택 삭제 확정: 삭제 → 토스트 → 선택 해제 → 첫 페이지로 이동
  const confirmDelete = async () => {
    try {
      if (selectedMaterials.length === 0) return;
      await deleteMutation.mutateAsync(
        selectedMaterials.map((id) => Number(id)),
      );
      toast.error(TOAST_MESSAGES.DELETE_MULTIPLE_SUCCESS);
      setSelectedMaterials([]);
      setIsConfirmOpen(false);
      // refresh list
      setPage(0);
    } catch {
      toast.error('자료 삭제 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 토글/초기화: 서버 쿼리 파라미터 갱신 유도
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setPage(0);
  };

  const clearCategory = () => {
    setSelectedCategories([]);
    setPage(0);
  };

  // 주차 변경 시 페이지 초기화하여 일관된 서버 필터링 보장
  const handleChangeWeeks = (weeks: string[]) => {
    setSelectedWeeks(weeks);
    setPage(0);
  };

  // 검색 변경 시 첫 페이지로 이동 (디바운스는 상위에서 필요 시 적용)
  const handleChangeSearch = (term: string) => {
    setSearch(term);
    setPage(0);
  };

  // 정렬 토글: 최신순/오래된순 전환
  const toggleSort = () => {
    setSort((prev) =>
      prev === 'createdAt,desc' ? 'createdAt,asc' : 'createdAt,desc',
    );
    setPage(0);
  };

  // 페이지 이동: 이전/다음
  const goPrev = () => {
    setPage((p) => Math.max(0, p - 1));
  };
  const goNext = () => {
    if (materialsQuery.data?.hasNext) setPage((p) => p + 1);
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
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* 통합 필터 바 */}
        <FilterBar
          materials={materialsFromQuery}
          weekSourceMaterials={
            (weekSourceQuery.data?.materials as Material[]) ??
            materialsFromQuery
          }
          selectedWeeks={selectedWeeks}
          onChangeWeeks={handleChangeWeeks}
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onClearCategory={clearCategory}
          sort={sort}
          onToggleSort={toggleSort}
          search={search}
          onChangeSearch={handleChangeSearch}
        />

        {/* 테이블 / 로딩 / 에러 */}
        <div className='flex-1 overflow-y-auto bg-background p-4 relative'>
          {materialsQuery.isError ? (
            <div className='h-full flex items-center justify-center'>
              <EmptyState
                title='오류가 발생했습니다'
                description={'목록을 불러오는 중 오류가 발생했습니다.'}
                action={{
                  label: '다시 시도',
                  onClick: () => materialsQuery.refetch(),
                }}
              />
            </div>
          ) : (
            <MaterialTable
              materials={materialsFromQuery}
              selectedMaterials={selectedMaterials}
              onSelectMaterial={handleSelectMaterial}
              onSelectAll={handleSelectAll}
              onMaterialClick={handleMaterialClick}
              isLoading={materialsQuery.isLoading}
            />
          )}
        </div>

        {/* 페이지네이션 */}
        <div className='px-4 py-3 flex items-center justify-between border-t border-border'>
          <div className='text-sm text-muted-foreground'>페이지 {page + 1}</div>
          <div className='flex items-center gap-2'>
            <button
              onClick={goPrev}
              disabled={page === 0}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm border',
                page === 0
                  ? 'border-muted-foreground/30 text-muted-foreground/50'
                  : 'border-border hover:bg-accent/50',
              )}
            >
              이전
            </button>
            <button
              onClick={goNext}
              disabled={!materialsQuery.data?.hasNext}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm border',
                !materialsQuery.data?.hasNext
                  ? 'border-muted-foreground/30 text-muted-foreground/50'
                  : 'border-border hover:bg-accent/50',
              )}
            >
              다음
            </button>
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

      {/* 퀴즈 생성 모달 */}
      <QuizCreateModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        materials={(
          (weekSourceQuery.data?.materials as Material[]) ?? materialsFromQuery
        ).filter((m) => selectedMaterials.includes(m.id))}
        onSubmit={() => {
          // TODO: 실제 API 요청 연결 (주석 해제 시 동작)
          // import { QuizzesService } from './services/quizzes';
          // (async () => {
          //   try {
          //     const fileIds = attachmentIds.map((id) => Number(id)).filter((n) => Number.isFinite(n));
          //     await QuizzesService.create(studyIdNum, { title, fileIds });
          //     toast.success('퀴즈가 생성되었습니다.');
          //   } catch (e) {
          //     toast.error('퀴즈 생성 중 오류가 발생했습니다.');
          //   }
          // })();

          // 현재는 토스트만 표시
          toast.success(TOAST_MESSAGES.QUIZ_CREATE_SUCCESS);
          setSelectedMaterials([]);
          setIsQuizModalOpen(false);
        }}
      />
    </div>
  );
};

export default DocumentPage;
