/**
 * 스터디 정보 관리 컴포넌트
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { MapPin, Plus, X, Camera, Loader2, Save } from 'lucide-react';
import RegionSelectModal from '../../components/RegionSelectModal';
import { getStudyInfo, updateStudyInfo } from '../services';
import { CATEGORIES, MAX_MEMBER_OPTIONS } from '../constants';
import type { StudyInfo, UpdateStudyInfoRequest } from '../types';
import { ROUTE_PARAMS } from '@/constants';
import { useImageUrl } from '@/hooks';
import { studyKeys } from '@/constants/queryKeys';

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
  const params = useParams<{ [ROUTE_PARAMS.studyId]: string }>();
  const studyId = params[ROUTE_PARAMS.studyId]
    ? Number(params[ROUTE_PARAMS.studyId])
    : null;

  const queryClient = useQueryClient();

  const [studyInfo, setStudyInfo] = useState<StudyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [conditionInput, setConditionInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { control, register, handleSubmit, setValue, watch, reset } =
    useForm<StudyInfoFormData>({
      defaultValues: {
        title: '',
        shortDescription: '',
        description: '',
        category: '',
        maxMembers: 2,
        schedule: '',
        region: '',
        conditions: [],
      },
    });

  const watchedRegion = watch('region');

  // 스터디 이미지 URL 로드 (file_key가 있을 때)
  const { imageUrl: studyImageUrl, isLoading: imageLoading } = useImageUrl(
    studyInfo?.file_key,
  );

  // 스터디 이미지 URL이 로드되면 preview에 설정
  useEffect(() => {
    if (studyImageUrl && !imageLoading) {
      setImagePreview(studyImageUrl);
    } else if (!studyInfo?.file_key) {
      // 이미지가 없으면 preview 초기화
      setImagePreview(null);
    }
  }, [studyImageUrl, imageLoading, studyInfo?.file_key]);

  // 스터디 정보가 변경될 때 폼 업데이트
  useEffect(() => {
    if (studyInfo) {
      // 카테고리 배열 설정 (interests 배열 우선, 없으면 category 문자열을 배열로 변환)
      const categoriesArray =
        studyInfo.interests &&
        Array.isArray(studyInfo.interests) &&
        studyInfo.interests.length > 0
          ? studyInfo.interests
          : studyInfo.category
            ? [studyInfo.category]
            : [];

      setSelectedCategories(categoriesArray);

      reset({
        title: studyInfo.study_name,
        shortDescription: studyInfo.description,
        description: studyInfo.detailed_description,
        category: '', // 더 이상 단일 카테고리 사용 안 함
        maxMembers: studyInfo.max_members,
        schedule: studyInfo.schedule || '',
        region: studyInfo.region || '',
        conditions: studyInfo.conditions || [],
      });
    }
  }, [studyInfo, reset]);

  // 스터디 정보 조회
  const fetchStudyInfo = useCallback(async () => {
    if (!studyId) {
      console.error('스터디 ID가 없습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`[스터디 정보 조회] studyId: ${studyId}`);
      const response = await getStudyInfo(studyId);
      console.log('[스터디 정보 조회 성공]', response);
      console.log('[스터디 정보 응답 구조]', {
        hasStudy: 'study' in response,
        responseKeys: Object.keys(response || {}),
        responseType: typeof response,
      });

      // 응답 구조가 다를 수 있으므로 유연하게 처리
      let rawData: unknown = null;

      if (response && response.study) {
        // { study: {...} } 형태
        rawData = response.study;
      } else if (response && typeof response === 'object') {
        // 직접 study 객체인 경우 또는 다른 구조
        // response 자체가 study 데이터일 수 있음
        rawData = response;
      }

      if (!rawData) {
        console.warn(
          '[스터디 정보 조회] 응답에서 데이터를 찾을 수 없습니다:',
          response,
        );
        setStudyInfo(null);
        return;
      }

      // 백엔드 응답 필드를 프론트엔드 타입으로 매핑
      // 백엔드: title, detail_description 등
      // 프론트엔드: study_name, detailed_description 등
      const data = rawData as Record<string, unknown>;
      const studyData: StudyInfo = {
        study_id: (typeof data?.study_id === 'number'
          ? data.study_id
          : typeof data?.id === 'number'
            ? data.id
            : studyId) as number,
        study_name: (typeof data?.study_name === 'string'
          ? data.study_name
          : typeof data?.title === 'string'
            ? data.title
            : '') as string,
        description: (typeof data?.description === 'string'
          ? data.description
          : '') as string,
        detailed_description: (typeof data?.detailed_description === 'string'
          ? data.detailed_description
          : typeof data?.detail_description === 'string'
            ? data.detail_description
            : '') as string,
        category: (() => {
          // 카테고리 매핑 (다양한 필드명 및 값 형식 지원)
          // 백엔드 응답: interests 배열 또는 category 문자열
          let categoryValue = '';

          // 1. interests 배열 확인 (백엔드 API 스펙: interests는 배열)
          if (Array.isArray(data?.interests) && data.interests.length > 0) {
            categoryValue = String(data.interests[0]);
            console.log('[카테고리 매핑] interests 배열에서 추출:', {
              interests: data.interests,
              첫번째값: categoryValue,
            });
          }
          // 2. category 문자열 확인
          else if (typeof data?.category === 'string') {
            categoryValue = data.category;
            console.log('[카테고리 매핑] category 문자열 사용:', categoryValue);
          }
          // 3. category_name 문자열 확인
          else if (typeof data?.category_name === 'string') {
            categoryValue = data.category_name;
            console.log(
              '[카테고리 매핑] category_name 문자열 사용:',
              categoryValue,
            );
          }

          // 카테고리 값 정규화 (공백 제거)
          const normalizedCategory = categoryValue.trim();

          // CATEGORIES 배열에 있는 값인지 확인
          const matchedCategory = CATEGORIES.find(
            (cat) =>
              cat === normalizedCategory ||
              cat.includes(normalizedCategory) ||
              normalizedCategory.includes(cat),
          );

          if (matchedCategory) {
            console.log('[카테고리 매핑 성공]', {
              원본값: normalizedCategory,
              매칭된값: matchedCategory,
            });
            return matchedCategory;
          }

          // 매칭되지 않으면 원본 값 반환 (디버깅을 위해)
          console.warn('[카테고리 매핑] CATEGORIES에 없는 값:', {
            원본값: normalizedCategory,
            CATEGORIES목록: CATEGORIES,
            원본데이터카테고리필드: data?.category,
            원본데이터interests: data?.interests,
          });

          return normalizedCategory;
        })() as string,
        max_members: (typeof data?.max_members === 'number'
          ? data.max_members
          : typeof data?.maxMembers === 'number'
            ? data.maxMembers
            : 2) as number,
        current_members: (typeof data?.current_members === 'number'
          ? data.current_members
          : typeof data?.currentMembers === 'number'
            ? data.currentMembers
            : 0) as number,
        leader_id: (typeof data?.leader_id === 'number'
          ? data.leader_id
          : typeof data?.leaderId === 'number'
            ? data.leaderId
            : 0) as number,
        created_at: (typeof data?.created_at === 'string'
          ? data.created_at
          : typeof data?.createdAt === 'string'
            ? data.createdAt
            : '') as string,
        updated_at: (typeof data?.updated_at === 'string'
          ? data.updated_at
          : typeof data?.updatedAt === 'string'
            ? data.updatedAt
            : '') as string,
        schedule: (typeof data?.schedule === 'string'
          ? data.schedule
          : typeof data?.study_time === 'string'
            ? data.study_time
            : '') as string,
        region: (typeof data?.region === 'string'
          ? data.region
          : typeof data?.region_name === 'string'
            ? data.region_name
            : '') as string,
        conditions: (Array.isArray(data?.conditions)
          ? data.conditions
          : Array.isArray(data?.requirements)
            ? data.requirements
            : []) as string[],
        file_key: (typeof data?.file_key === 'string'
          ? data.file_key
          : typeof data?.image_key === 'string'
            ? data.image_key
            : undefined) as string | undefined,
        image_url: (typeof data?.image_url === 'string'
          ? data.image_url
          : typeof data?.imageUrl === 'string'
            ? data.imageUrl
            : undefined) as string | undefined,
      };

      setStudyInfo(studyData);
    } catch (error) {
      console.error('[스터디 정보 조회 실패]', error);
      setStudyInfo(null);
      toast.error('스터디 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [studyId]);

  useEffect(() => {
    if (studyId) {
      fetchStudyInfo();
    }
  }, [studyId, fetchStudyInfo]);

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

  // 스터디 정보 수정
  const onSubmit = async (data: StudyInfoFormData) => {
    if (!studyId) {
      toast.error('스터디 ID가 없습니다.');
      return;
    }

    try {
      setSaving(true);

      // API 스펙에 맞게 필드명 변환 및 데이터 구조 수정
      // 모든 값의 타입을 명시적으로 확인하여 안전하게 전송
      // 모든 문자열 필드를 안전하게 정리 (JSON 직렬화 안전하게)
      const sanitizeString = (str: string): string => {
        if (typeof str !== 'string') return '';
        // 줄바꿈을 공백으로 변환하고, JSON 직렬화를 방해하는 특수 문자 제거
        return (
          str
            .replace(/\r\n/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\t/g, ' ') // 탭 제거
            // 제어 문자 제거 (eslint no-control-regex 규칙 우회)
            // eslint-disable-next-line no-control-regex
            .replace(/[\u0000-\u001F]/g, '')
            .trim()
        );
      };

      const updateData: UpdateStudyInfoRequest = {
        title: typeof data.title === 'string' ? sanitizeString(data.title) : '',
        description:
          typeof data.shortDescription === 'string'
            ? sanitizeString(data.shortDescription)
            : '',
        detail_description:
          typeof data.description === 'string'
            ? sanitizeString(data.description)
            : '',
        // interests는 필수 필드이며 최소 1개 이상이어야 함
        // 백엔드 Collection Merge 방식에 맞춰 항상 배열로 전송
        interests:
          selectedCategories.length > 0
            ? selectedCategories
            : studyInfo?.interests &&
                Array.isArray(studyInfo.interests) &&
                studyInfo.interests.length > 0
              ? studyInfo.interests
              : studyInfo?.category
                ? [studyInfo.category]
                : ['자율/기타'],
        region:
          typeof data.region === 'string' ? sanitizeString(data.region) : '',
        study_time:
          typeof data.schedule === 'string'
            ? sanitizeString(data.schedule)
            : '',
        max_members:
          typeof data.maxMembers === 'number' ? data.maxMembers : undefined,
        conditions: Array.isArray(data.conditions)
          ? data.conditions.map((c: string) => String(c))
          : [],
        // file_key: 기존 스터디 정보의 file_key를 유지 (이미지 업로드가 없으면 기존 값 유지)
        file_key: studyInfo?.file_key || undefined,
      };

      // 조건 배열의 각 문자열을 안전하게 처리 (특수 문자 제거)
      if (updateData.conditions) {
        updateData.conditions = updateData.conditions.map(
          (condition) => String(condition).trim().replace(/['"]/g, ''), // 작은따옴표, 큰따옴표 제거
        );
      }

      // undefined와 null만 제거 (단, 필수 필드는 기존 값 유지)
      const cleanedData: Record<string, unknown> = {};
      Object.keys(updateData).forEach((key) => {
        const value = updateData[key as keyof UpdateStudyInfoRequest];
        // max_members는 API 스펙 필수 필드이므로 undefined일 때 기존 값 사용
        if (key === 'max_members') {
          cleanedData[key] =
            value !== undefined && value !== null
              ? value
              : studyInfo?.max_members || 2;
        } else if (key === 'interests') {
          // interests는 필수 필드이며 최소 1개 이상이어야 함
          // 빈 배열이면 기존 interests 사용
          if (Array.isArray(value) && value.length > 0) {
            cleanedData[key] = value;
          } else if (
            studyInfo?.interests &&
            Array.isArray(studyInfo.interests) &&
            studyInfo.interests.length > 0
          ) {
            cleanedData[key] = studyInfo.interests;
          } else if (studyInfo?.category) {
            cleanedData[key] = [studyInfo.category];
          } else {
            // 최소 1개 이상 보장 (빈 배열 방지)
            cleanedData[key] = value && Array.isArray(value) ? value : [];
          }
        } else {
          // 다른 필드는 undefined와 null만 제거 (빈 문자열, 빈 배열, 0 등은 포함)
          if (value !== undefined && value !== null) {
            cleanedData[key] = value;
          }
        }
      });

      const finalUpdateData = cleanedData as UpdateStudyInfoRequest;

      const response = await updateStudyInfo(studyId, finalUpdateData);

      // 응답 처리
      if (response && (response.success || response.study)) {
        const updatedStudyInfo = response.study || studyInfo;
        if (updatedStudyInfo) {
          setStudyInfo(updatedStudyInfo);
          // 스터디 정보 새로고침
          await fetchStudyInfo();
        }

        // 스터디 정보를 사용하는 모든 쿼리 캐시 무효화
        // 1. 스터디 목록 (탐색 페이지의 스터디 카드 목록)
        queryClient.invalidateQueries({
          queryKey: studyKeys.all,
        });
        // 2. 해당 스터디의 상세 정보 (상세 모달 등)
        queryClient.invalidateQueries({
          queryKey: studyKeys.detail(String(studyId)),
        });
        // 3. 스터디 상세 범위 전체 (모든 스터디 상세 정보)
        queryClient.invalidateQueries({
          queryKey: studyKeys.detailScope(),
        });
        // 4. 내 스터디 목록 (홈 페이지 등)
        queryClient.invalidateQueries({
          queryKey: studyKeys.me,
        });

        toast.success('스터디 정보가 수정되었습니다.');
      } else {
        // 응답이 없거나 성공 표시가 없어도 업데이트된 정보가 있을 수 있음
        await fetchStudyInfo();

        // 스터디 정보를 사용하는 모든 쿼리 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: studyKeys.all,
        });
        queryClient.invalidateQueries({
          queryKey: studyKeys.detail(String(studyId)),
        });
        queryClient.invalidateQueries({
          queryKey: studyKeys.detailScope(),
        });
        queryClient.invalidateQueries({
          queryKey: studyKeys.me,
        });

        toast.success('스터디 정보가 수정되었습니다.');
      }
    } catch (error) {
      console.error('스터디 정보 수정 실패:', error);

      if (error instanceof AxiosError) {
        const errorData = error.response?.data as
          | {
              message?: string;
              error?: string;
            }
          | undefined;

        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          '스터디 정보 수정에 실패했습니다.';

        toast.error(errorMessage);
      } else {
        toast.error('스터디 정보 수정에 실패했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='bg-card rounded-lg border border-border p-6'>
        <div className='flex justify-center items-center h-32'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
          <span className='ml-3 text-sm text-muted-foreground'>
            스터디 정보를 불러오는 중...
          </span>
        </div>
      </div>
    );
  }

  if (!studyInfo) {
    return (
      <div className='bg-card rounded-lg border border-border p-6'>
        <div className='space-y-6'>
          <div>
            <h2 className='text-lg font-semibold text-foreground'>
              스터디 관리
            </h2>
            <p className='text-sm text-muted-foreground mt-1'>
              스터디 정보를 불러올 수 없습니다.
            </p>
          </div>
          <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
            <p className='text-sm text-destructive'>
              스터디 정보를 불러오는 데 실패했습니다.
            </p>
            <p className='text-xs text-muted-foreground mt-2'>가능한 원인:</p>
            <ul className='text-xs text-muted-foreground mt-1 ml-4 list-disc'>
              <li>백엔드에 해당 스터디 데이터가 없을 수 있습니다.</li>
              <li>
                접근 권한이 없을 수 있습니다. (개발자 도구 콘솔 확인 필요)
              </li>
              <li>네트워크 오류가 발생했을 수 있습니다.</li>
            </ul>
            <button
              onClick={fetchStudyInfo}
              className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm'
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              스터디 카테고리 (중복 선택 가능)
            </label>
            <div className='flex flex-wrap gap-2'>
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <button
                    key={category}
                    type='button'
                    onClick={() => {
                      setSelectedCategories((prev) => {
                        if (prev.includes(category)) {
                          // 이미 선택된 경우 제거 (최소 1개는 유지)
                          if (prev.length <= 1) {
                            return prev; // 최소 1개는 유지
                          }
                          return prev.filter((c) => c !== category);
                        } else {
                          // 선택되지 않은 경우 추가
                          return [...prev, category];
                        }
                      });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
            {selectedCategories.length > 0 && (
              <p className='mt-2 text-xs text-muted-foreground'>
                선택된 카테고리: {selectedCategories.join(', ')}
              </p>
            )}
          </div>

          {/* 스터디 인원 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 인원
            </label>
            <Controller
              name='maxMembers'
              control={control}
              rules={{
                required: '스터디 인원을 선택해주세요.',
                min: {
                  value: studyInfo?.current_members || 2,
                  message: `현재 ${studyInfo?.current_members}명이므로 최소 ${studyInfo?.current_members}명 이상이어야 합니다.`,
                },
              }}
              render={({ field }) => (
                <select
                  {...field}
                  className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
                >
                  {MAX_MEMBER_OPTIONS.filter(
                    (num) => num >= (studyInfo?.current_members || 2),
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num}인
                    </option>
                  ))}
                </select>
              )}
            />
            <p className='mt-1 text-xs text-muted-foreground'>
              현재 {studyInfo?.current_members}명이 참여 중입니다. 최대 인원을
              현재 인원보다 적게 설정할 수 없습니다.
            </p>
          </div>

          {/* 스터디 시간 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 시간
            </label>
            <input
              {...register('schedule', {
                required: '스터디 시간을 입력해주세요.',
                minLength: {
                  value: 5,
                  message: '스터디 시간을 구체적으로 입력해주세요.',
                },
              })}
              className='w-full px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
              placeholder='예: 매주 토요일 오후 2시'
            />
            <p className='mt-1 text-xs text-muted-foreground'>
              스터디가 진행되는 시간을 자유롭게 입력해주세요.
            </p>
          </div>

          {/* 스터디 지역 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 지역
            </label>
            <Controller
              name='region'
              control={control}
              rules={{
                required: '스터디 지역을 선택해주세요.',
              }}
              render={({ field }) => (
                <div>
                  <button
                    type='button'
                    onClick={() => setIsRegionModalOpen(true)}
                    className={`w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between ${
                      field.value
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-input bg-background text-muted-foreground'
                    }`}
                  >
                    <div className='flex items-center space-x-2'>
                      <MapPin className='h-4 w-4' />
                      <span>{field.value || '지역을 선택해주세요'}</span>
                    </div>
                    <span className='text-muted-foreground'>▼</span>
                  </button>
                </div>
              )}
            />
          </div>

          {/* 참여조건 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              참여조건
            </label>
            <Controller
              name='conditions'
              control={control}
              render={({ field }) => (
                <div>
                  {/* 입력 필드 */}
                  <div className='flex gap-2 mb-3'>
                    <input
                      type='text'
                      placeholder='참여조건을 입력하세요 (예: React 경험 1년 이상)'
                      value={conditionInput}
                      onChange={(e) => setConditionInput(e.target.value)}
                      className='flex-1 px-4 py-2 border border-input rounded-lg focus:border-primary focus:ring-0 bg-background text-foreground'
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = conditionInput.trim();
                          if (value && !field.value.includes(value)) {
                            field.onChange([...field.value, value]);
                            setConditionInput('');
                          }
                        }
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        const value = conditionInput.trim();
                        if (value && !field.value.includes(value)) {
                          field.onChange([...field.value, value]);
                          setConditionInput('');
                        }
                      }}
                      className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      추가
                    </button>
                  </div>

                  {/* 선택된 참여조건 태그들 */}
                  {field.value.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {field.value.map((condition, index) => (
                        <div
                          key={index}
                          className='flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm'
                        >
                          <span>{condition}</span>
                          <button
                            type='button'
                            onClick={() => {
                              const newConditions = field.value.filter(
                                (_, i) => i !== index,
                              );
                              field.onChange(newConditions);
                            }}
                            className='text-primary-foreground hover:text-primary-foreground/80'
                          >
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className='text-xs text-muted-foreground'>
                    스터디 참여를 위한 조건을 입력해주세요. (선택사항)
                  </p>
                </div>
              )}
            />
          </div>

          {/* 스터디 대표 이미지 */}
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              스터디 대표 이미지
            </label>
            <div className='border-2 border-dashed border-input rounded-lg p-6 text-center'>
              {imagePreview ? (
                <div className='relative'>
                  <img
                    src={imagePreview}
                    alt='미리보기'
                    className='w-full h-48 object-cover rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={handleImageRemove}
                    className='absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive-light'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  <Camera className='mx-auto h-12 w-12 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>
                      클릭하여 대표 이미지를 설정해주세요
                    </p>
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                    id='image-upload'
                  />
                  <label
                    htmlFor='image-upload'
                    className='inline-flex items-center px-4 py-2 border border-input rounded-lg text-sm font-medium text-foreground bg-background hover:bg-accent cursor-pointer'
                  >
                    이미지 선택
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 수정하기 버튼 */}
          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={saving}
              className='px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2'
            >
              {saving ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className='h-4 w-4' />
                  <span>수정하기</span>
                </>
              )}
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
          multiSelect={false}
        />
      </div>
    </div>
  );
};
