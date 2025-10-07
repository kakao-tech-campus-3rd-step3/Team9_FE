import apiClient from '@/api';
import { STUDY_ENDPOINTS } from '@/api/constants';
import { downloadImageService } from '@/services/images';
import type { StudyListParams, StudyApplyRequest, Study } from '../types';

// API 응답 타입 정의
interface ApiStudyResponse {
  id: number;
  title: string;
  description: string;
  file_key?: string;
  detail_description?: string;
  interests?: string[];
  region?: string;
  study_time?: string;
  conditions?: string[];
  current_members?: number;
  max_members?: number;
}

// API 응답을 프론트엔드 타입으로 변환하는 매퍼 함수
const mapApiResponseToStudy = async (
  apiStudy: ApiStudyResponse,
): Promise<Study> => {
  // 이미지 URL 처리 - presigned URL 사용
  let imageUrl: string | undefined = undefined;

  console.log(`스터디 ${apiStudy.id} 이미지 디버깅:`, {
    file_key: apiStudy.file_key,
    has_file_key: !!apiStudy.file_key,
    file_key_type: typeof apiStudy.file_key,
    file_key_length: apiStudy.file_key?.length,
  });

  // file_key가 있으면 presigned URL 요청
  if (apiStudy.file_key) {
    try {
      const presignedUrl = await downloadImageService.getImagePresignedUrl(
        apiStudy.file_key,
      );

      if (presignedUrl && presignedUrl !== '') {
        imageUrl = presignedUrl;
        console.log(`이미지 URL 생성 성공 (study ${apiStudy.id}):`, imageUrl);
      } else {
        console.log(
          `presigned URL이 비어있음 (study ${apiStudy.id}) - 아이콘 사용`,
        );
      }
    } catch (error) {
      console.warn(`이미지 URL 생성 실패 (study ${apiStudy.id}):`, error);
      // 실패 시 아이콘 사용 (이미 imageUrl이 undefined로 설정됨)
    }
  } else {
    console.log(`file_key 없음 (study ${apiStudy.id}) - 아이콘 사용`);
  }

  // 🚨 임시 해결책: 백엔드 이미지 API가 작동하지 않으므로
  // 새로 생성한 스터디의 경우 로컬 이미지 미리보기 사용
  if (!imageUrl && apiStudy.id > 30) {
    // 최근 생성된 스터디 (ID > 30)의 경우 로컬 이미지 확인
    const localImageUrl = localStorage.getItem(`study_image_${apiStudy.id}`);
    if (localImageUrl) {
      imageUrl = localImageUrl;
      console.log(`로컬 이미지 사용 (study ${apiStudy.id}):`, imageUrl);
    }
  }

  // 백엔드 데이터에서 description과 detail_description 중 어느 것이 짧은 설명인지 자동 판단
  const desc = apiStudy.description || '';
  const detailDesc = apiStudy.detail_description || '';

  // 길이를 기준으로 짧은 설명과 긴 설명 결정
  let shortDesc = desc;
  let longDesc = detailDesc;

  if (desc.length > detailDesc.length && detailDesc.length > 0) {
    // description이 더 길면 바꿈
    shortDesc = detailDesc;
    longDesc = desc;
  }

  const mappedStudy = {
    id: apiStudy.id,
    title: apiStudy.title,
    description: shortDesc, // 짧은 설명 → 카드에 표시
    shortDescription: longDesc, // 긴 설명 → 상세 모달에 표시
    category: apiStudy.interests?.[0] || '프로그래밍', // 첫 번째 interest를 카테고리로 사용 (호환성)
    interests: apiStudy.interests || [], // interests 배열 그대로 전달
    currentMembers: apiStudy.current_members || 1,
    maxMembers: apiStudy.max_members || 10,
    region: apiStudy.region || '전체',
    imageUrl,
    detailedDescription: longDesc, // 긴 설명
    schedule: apiStudy.study_time,
    requirements: apiStudy.conditions,
  };

  // 디버깅용 로그
  console.log('스터디 매핑 결과:', {
    title: mappedStudy.title,
    description: mappedStudy.description,
    shortDescription: mappedStudy.shortDescription,
    originalApi: {
      description: apiStudy.description,
      detail_description: apiStudy.detail_description,
    },
  });

  return mappedStudy;
};

/**
 * 스터디 탐색 서비스
 * - 스터디 목록 조회 및 검색
 * - 스터디 신청
 * - 기존 API 에러 처리 구조 활용
 */
export const studyExploreService = {
  // 스터디 목록 조회 및 검색
  getStudies: async (params: StudyListParams = {}) => {
    const { data } = await apiClient.get(STUDY_ENDPOINTS.STUDIES, {
      params: {
        page: params.page || 0,
        size: params.size || 50, // 더 많은 스터디 요청
        keyword: params.keyword,
        interests: params.interests?.join(','),
        locations: params.locations?.join(','),
      },
    });

    // 각 스터디의 상세 정보를 병렬로 조회
    const studiesWithDetails = await Promise.all(
      data.studies.map(async (study: ApiStudyResponse) => {
        try {
          const detailResponse = await apiClient.get(
            STUDY_ENDPOINTS.STUDY_DETAIL(study.id),
          );
          return { ...study, ...detailResponse.data } as ApiStudyResponse;
        } catch (error) {
          console.warn(`Failed to fetch details for study ${study.id}:`, error);
          return study; // 상세 정보 조회 실패 시 기본 정보만 반환
        }
      }),
    );

    // 각 스터디에 대해 이미지 URL을 포함한 완전한 데이터 생성
    const studiesWithImages = await Promise.all(
      studiesWithDetails.map(mapApiResponseToStudy),
    );

    return studiesWithImages;
  },

  // 스터디 상세 조회
  getStudyDetail: async (id: number) => {
    const { data } = await apiClient.get(STUDY_ENDPOINTS.STUDY_DETAIL(id));
    return data;
  },

  // 스터디 신청
  applyStudy: async (payload: StudyApplyRequest) => {
    const { data } = await apiClient.post(
      STUDY_ENDPOINTS.STUDY_APPLY(payload.study_id),
      { message: payload.message },
      { showToast: false }, // 신청은 별도 토스트 처리
    );
    return data;
  },
} as const;
