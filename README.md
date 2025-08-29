# 🌊 Pado FE - 스터디 통합 관리 플랫폼

## ✨ 주요 기능 (Features)

- **통합 대시보드**: 내가 참여하는 모든 스터디의 현황과 다가오는 일정을 한눈에 확인하세요.
- **스터디 탐색**: 관심 분야와 지역에 맞는 스터디를 쉽게 찾고 참여할 수 있습니다.
- **스마트 일정 조율**: When2Meet처럼 팀원들과 편리하게 다음 스터디 시간을 조율하세요.
- **자료 아카이브**: 스터디 자료를 체계적으로 관리하고 언제든지 다시 찾아볼 수 있습니다.
- **실시간 채팅**: 스터디별 전용 채팅방에서 팀원들과 원활하게 소통하세요.
- **출석 및 랭킹**: 스터디 참여도를 기반으로 한 출석 관리와 랭킹 시스템으로 학습 동기를 부여합니다.

## 🛠️ 기술 스택 (Tech Stack)

### 개발 환경
- **`React`** & **`TypeScript`**
- **`Vite`** + **`SWC`**
- **`pnpm`**

### 주요 라이브러리
- **상태 관리**: `TanStack Query`, `Zustand`
- **라우팅**: `React Router DOM`
- **스타일링**: `Tailwind CSS`
- **폼 관리**: `React Hook Form`, `zod`
- **기타**: `Axios`, `FullCalendar`, `Day.js`, `Lucide`

## 🚀 시작하기 (Getting Started)

### 1. 프로젝트 클론
```bash
git clone https://github.com/kakao-tech-campus-3rd-step3/Team9_FE.git
cd Team9_FE
```

### 2. 의존성 설치

pnpm을 사용하여 의존성을 설치합니다.

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

이제 `http://localhost:5173` 에서 프로젝트를 확인할 수 있습니다.

## 📜 프로젝트 스크립트 (Scripts)

  - **`pnpm dev`**: 개발 서버를 실행합니다.
  - **`pnpm build`**: 프로덕션용으로 프로젝트를 빌드합니다.
  - **`pnpm preview`**: 빌드된 결과물을 로컬에서 미리 봅니다.
  - **`pnpm lint`**: ESLint로 코드 문제를 검사합니다.
  - **`pnpm format`**: Prettier로 전체 코드 스타일을 통일합니다.

## 📁 프로젝트 구조 (Project Structure)

```
src
├── api               # API 요청 관련 함수 및 Axios 인스턴스 관리
├── assets            # 이미지, 폰트, SVG 등 정적 에셋 관리
├── components        # 재사용 가능한 컴포넌트
│   ├── common        # 버튼, 인풋, 모달 등 프로젝트 전반에서 사용되는 공용 컴포넌트
│   └── layout        # 헤더, 푸터, 사이드바 등 페이지 레이아웃 구조 컴포넌트
├── constants         # 변하지 않는 상수 값 관리 (e.g., API 경로, 기본 설정 값)
├── contexts          # React Context API를 사용한 전역 상태 관리
├── stores            # Zustand 라이브러리를 사용한 전역 상태 관리 로직
├── hoc               # 컴포넌트 로직 재사용을 위한 고차 컴포넌트 (Higher-Order Components)
├── hooks             # 여러 컴포넌트에서 재사용되는 커스텀 훅 (Custom Hooks)
├── pages             # 라우팅의 단위가 되는 페이지
│   ├── login         # 로그인 페이지 관련 파일 그룹
|   |    ├── loginPage.tsx # 로그인 페이지의 메인 컴포넌트
|   |    ├── components    # 해당 페이지에서만 사용되는 하위 컴포넌트
|   |    ├── hooks         # 해당 페이지에서만 사용되는 커스텀 훅
|   |    └── types         # 해당 페이지에서만 사용되는 타입 정의
│   └── other         # 다른 페이지들...
├── routes            # 라우팅 설정 및 경로 관리
├── styles            # 전역 스타일(Global Styles), 테마(Theme), 믹스인(Mixin) 관리
├── types             # 프로젝트 전반에서 사용되는 공통 타입 정의
├── utils             # 날짜 포맷팅, 정규식 등 순수 함수 및 유틸리티 관리
└── App.tsx           # 애플리케이션의 최상위 진입점 컴포넌트
```

## 🖋️ 코딩 컨벤션 (Coding Convention)

  - **폴더명**: `kebab-case`
  - **컴포넌트 파일명**: `PascalCase.tsx`
  - **그 외 파일명**: `camelCase.ts`
  - **코드 스타일**: ESLint와 Prettier 규칙을 따릅니다.
      - `pnpm lint`로 검사
      - `pnpm format`으로 자동 수정