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
  AdminPage,
  MemberManagement,
  ApplicantManagement,
  StudyInfoManagement,
} from '@/pages/(study)';
import { auth, guest, role } from './routeHelpers';

/**
 * 라우트 설정 객체 (간소화)
 * - auth(): 인증 필요 (모든 로그인 사용자)
 * - guest(): 게스트만 접근 (로그인한 사용자는 홈으로 리다이렉트)
 * - role(Component, 'ROLE'): 최소 역할 필요 (계층적 접근)
 * - 직접 컴포넌트: 공개 페이지 (인증 불필요)
 */
export const routes = {
  // 메인 페이지
  Home: auth(HomePage),

  // 인증 페이지
  Login: guest(LoginPage),
  Signup: guest(SignupPage),

  // 스터디 페이지들 (모든 로그인 사용자)
  StudyDashboard: auth(DashboardPage),
  StudyDocument: auth(DocumentPage),
  StudyDocumentAdd: auth(DocumentAddPage),
  StudyDocumentDetail: auth(DocumentDetailPage),
  StudyDocumentEdit: auth(DocumentEditPage),

  // 스터디 관리 페이지들 (스터디 리더 이상만 접근 가능, 관리자도 접근 가능)
  StudyAdmin: role(AdminPage, 'STUDY_LEADER'),
  StudyAdminMembers: role(MemberManagement, 'STUDY_LEADER'),
  StudyAdminApplicants: role(ApplicantManagement, 'STUDY_LEADER'),
  StudyAdminStudyInfo: role(StudyInfoManagement, 'STUDY_LEADER'),
  StudyCreate: role(StudyCreatePage, 'STUDY_LEADER'),

  // 공개 스터디 탐색 페이지 (모든 사용자)
  StudyExplore: StudyExplorePage,

  // 일정 페이지들 (모든 로그인 사용자)
  Schedule: auth(SchedulePage),
  ScheduleManage: auth(ManagePage),
  ScheduleTune: auth(TunePage),

  // 기타 페이지들
  Example: ExamplePage,
  NotFound: NotFoundPage,
} as const;

export default routes;
