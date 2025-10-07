import {
  HomePage,
  LoginPage,
  SignupPage,
  StudyCreatePage,
  ManagePage,
  TunePage,
  SchedulePage,
  ExamplePage,
  NotFoundPage,
  StudyExplorePage,
} from '@/pages';
import {
  DashboardPage,
  DocumentPage,
  DocumentAddPage,
  DocumentDetailPage,
  DocumentEditPage,
  ProgressPage,
  AdminPage,
  MemberManagement,
  ApplicantManagement,
  StudyInfoManagement,
} from '@/pages/(study)';
import { ReflectionPage } from '@/pages/(study)/reflection';

// TODO: 팀원과 논의 후 HOC 적용 결정 후 주석 제거
// import { auth, guest, role } from './routeHelpers';

/**
 * 라우트 설정 객체
 * - auth(): 인증 필요 (모든 로그인 사용자)
 * - guest(): 게스트만 접근 (로그인한 사용자는 홈으로 리다이렉트)
 * - role(Component, 'ROLE'): 최소 역할 필요 (계층적 접근)
 * - 직접 컴포넌트: 공개 페이지 (인증 불필요)
 *
 */
export const routes = {
  Home: HomePage,
  Example: ExamplePage,
  Login: LoginPage,
  Signup: SignupPage,
  StudyDashboard: DashboardPage,
  StudyDocument: DocumentPage,
  StudyDocumentAdd: DocumentAddPage,
  StudyDocumentDetail: DocumentDetailPage,
  StudyDocumentEdit: DocumentEditPage,
  StudyProgress: ProgressPage,
  Schedule: SchedulePage,
  ScheduleManage: ManagePage,
  ScheduleTune: TunePage,
  StudyAdmin: AdminPage,
  StudyAdminMembers: MemberManagement,
  StudyAdminApplicants: ApplicantManagement,
  StudyAdminStudyInfo: StudyInfoManagement,
  StudyCreate: StudyCreatePage,
  StudyExplore: StudyExplorePage,
  StudyReflection: ReflectionPage,
  NotFound: NotFoundPage,

  //  TODO: 팀원과 논의 후 페이지 별 HOC 적용 결정
  // 메인 페이지 (로그인 필요 여부 논의)
  // Home: auth(HomePage),  // 로그인 필요 시 활성화

  // 인증 관련 페이지 (비로그인 사용자만 접근)
  // Login: guest(LoginPage),    // 로그인 페이지
  // Signup: guest(SignupPage),  // 회원가입 페이지

  // 스터디 일반 페이지 (모든 로그인 사용자 접근)
  // StudyDashboard: auth(DashboardPage),        // 스터디 대시보드
  // StudyDocument: auth(DocumentPage),          // 문서 목록
  // StudyDocumentAdd: auth(DocumentAddPage),    // 문서 작성
  // StudyDocumentDetail: auth(DocumentDetailPage), // 문서 상세
  // StudyDocumentEdit: auth(DocumentEditPage),  // 문서 편집

  // 스터디 관리 페이지 (스터디 리더 이상만 접근)
  // StudyAdmin: role(AdminPage, 'STUDY_LEADER'),              // 관리 메인
  // StudyAdminMembers: role(MemberManagement, 'STUDY_LEADER'), // 멤버 관리
  // StudyAdminApplicants: role(ApplicantManagement, 'STUDY_LEADER'), // 신청자 관리
  // StudyAdminStudyInfo: role(StudyInfoManagement, 'STUDY_LEADER'), // 스터디 정보 관리
  // StudyCreate: role(StudyCreatePage, 'STUDY_LEADER'),       // 스터디 생성

  // 일정 관리 페이지 (모든 로그인 사용자 접근)
  // Schedule: auth(SchedulePage),        // 일정 메인
  // ScheduleManage: auth(ManagePage),    // 일정 관리
  // ScheduleTune: auth(TunePage),        // 일정 조정
} as const;

export default routes;
