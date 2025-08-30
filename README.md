# 🌊 Pado FE - 스터디 통합 관리 플랫폼

## ✨ 주요 기능 (Features)

- **기본 라우터 구조**: React Router DOM을 활용한 페이지 라우팅 시스템
- **반응형 레이아웃**: 헤더, 사이드바를 조합한 다양한 레이아웃 타입 지원
- **경로 별칭 시스템**: `@/` 경로를 통한 깔끔한 import 구조
- **타입 안전성**: TypeScript를 활용한 완전한 타입 체크
- **모던 스타일링**: Tailwind CSS v4 기반의 커스텀 테마 시스템
- **개발 도구**: ESLint, Prettier, Husky를 통한 코드 품질 관리

## 🛠️ 기술 스택 (Tech Stack)

### 개발 환경

- **`React 19`** & **`TypeScript 5.8`**
- **`Vite 7`** + **`SWC`**
- **`pnpm`** + **`Husky`**

### 주요 라이브러리

- **상태 관리**: `TanStack Query 5`, `Zustand 5`
- **라우팅**: `React Router DOM 7`
- **스타일링**: `Tailwind CSS 4` (커스텀 테마)
- **폼 관리**: `React Hook Form 7`, `zod 4`
- **UI 아이콘**: `Lucide React`
- **날짜 관리**: `Day.js`, `FullCalendar`
- **HTTP 클라이언트**: `Axios`

### 개발 도구

- **코드 품질**: `ESLint 9`, `Prettier 3`
- **Git Hooks**: `Husky`, `lint-staged`
- **모킹 서버**: `json-server`

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

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

이제 `http://localhost:5173` 에서 프로젝트를 확인할 수 있습니다.

**참고**: 개발 서버는 Mock API 서버(`http://localhost:8080`)와 함께 실행됩니다.

## 📜 프로젝트 스크립트 (Scripts)

- **`pnpm dev`**: 개발 서버와 Mock API 서버를 동시에 실행합니다.
- **`pnpm dev:app`**: Vite 개발 서버만 실행합니다.
- **`pnpm dev:mock`**: Mock API 서버만 실행합니다.
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
│   ├── common        # 로고 등 공용 컴포넌트
│   └── layout        # 헤더, 사이드바, 레이아웃 컴포넌트
├── constants         # 라우트 경로 등 상수 값 관리
├── contexts          # React Context API를 사용한 전역 상태 관리
├── stores            # Zustand 라이브러리를 사용한 전역 상태 관리 로직
├── hoc               # 컴포넌트 로직 재사용을 위한 고차 컴포넌트
├── hooks             # 여러 컴포넌트에서 재사용되는 커스텀 훅
├── pages             # 라우팅의 단위가 되는 페이지
│   ├── Home          # 홈 페이지
│   ├── Example       # 예시 페이지
│   └── NotFound      # 404 페이지
├── routes            # 라우터 설정 및 경로 관리
├── styles            # 전역 스타일, 테마, 폰트 관리
├── types             # 프로젝트 전반에서 사용되는 공통 타입 정의
├── utils             # 순수 함수 및 유틸리티 관리
├── App.tsx           # 애플리케이션의 최상위 진입점 컴포넌트
└── main.tsx          # React 앱의 진입점
```

## 🔧 개발 환경 설정 (Development Setup)

### 경로 별칭 (Path Alias)

프로젝트에서는 `@/` 경로 별칭을 사용하여 깔끔한 import 구조를 제공합니다.

```typescript
// 사용 예시
import { Router } from '@/routes';
import { Layout } from '@/components/layout';
import { ROUTES } from '@/constants';
import { padoLogo } from '@/assets';
```

### 라우터 구조

- **파일 기반 라우팅**: `src/routes/Router.tsx`에서 중앙 관리
- **경로 상수화**: `src/constants/routes.ts`에서 경로 상수 관리
- **레이아웃 시스템**: 페이지별로 다른 레이아웃 타입 적용

### 레이아웃 시스템

프로젝트는 다양한 레이아웃 타입을 지원하는 유연한 레이아웃 시스템을 제공합니다.

#### 레이아웃 타입

```typescript
type LayoutType = 'none' | 'header-only' | 'sidebar-only' | 'header-sidebar';
```

- **`none`**: 레이아웃 없이 컨텐츠만 표시 (404 페이지 등)
- **`header-only`**: 헤더만 있는 레이아웃 (홈 페이지)
- **`sidebar-only`**: 사이드바만 있는 레이아웃 (예시 페이지)
- **`header-sidebar`**: 헤더와 사이드바가 모두 있는 레이아웃 (기본값)

#### 레이아웃 컴포넌트 구조

```typescript
// src/components/layout/Layout.tsx
const Layout: React.FC<LayoutProps> = ({ layoutType = 'header-sidebar' }) => {
  // 레이아웃 타입에 따른 조건부 렌더링
};
```

#### 사용 예시

```typescript
// 라우터에서 레이아웃 타입 지정
{
  path: ROUTES.HOME,
  element: <Layout layoutType='header-only' />,
  children: [{ index: true, element: <HomePage /> }]
}
```

### 스타일 시스템

- **Tailwind CSS v4**: 최신 버전 사용
- **커스텀 테마**: `src/styles/theme.css`에서 색상 팔레트 정의
- **반응형 디자인**: 모바일 우선 접근법

## 🖋️ 코딩 컨벤션 (Coding Convention)

### 파일 및 폴더 명명 규칙

- **폴더명**: `kebab-case`
- **컴포넌트 파일명**: `PascalCase.tsx`
- **그 외 파일명**: `camelCase.ts`
- **상수 파일명**: `camelCase.ts`

### Import/Export 규칙

- **절대 경로 사용**: `@/` 경로 별칭 활용
- **Index 파일 활용**: 각 폴더의 `index.ts`를 통한 중앙 export
- **Named Export 선호**: `export { Component }` 형태 사용

### 코드 스타일

- **ESLint와 Prettier 규칙**을 따릅니다.
- **JSDoc 주석**: 컴포넌트와 함수에 설명 주석 추가
- **타입 안전성**: TypeScript strict 모드 사용
- **일관된 코드 스타일**: `pnpm lint`로 검사, `pnpm format`으로 자동 수정

### Git 커밋 규칙

- **컨벤셔널 커밋**: `<type>(<scope>): <subject>` 형식
- **타입**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **스코프**: 변경된 부분 명시 (예: `router`, `components`)
