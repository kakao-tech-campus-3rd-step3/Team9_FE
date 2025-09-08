<p align="center">
  <img src="https://github.com/user-attachments/assets/0cb819ae-1209-457d-a10b-669c1aec4c34" width="260px" alt="PADO Logo">
</p>

# 파도 Frontend

**스터디 통합 관리 플랫폼 '파도'의 프론트엔드 레포지토리입니다.**

## ✨ 핵심 기능

- **대시보드**: 공지/일정/퀴즈/진행도/랭킹
- **문서 관리**: 카테고리·주차 기반 문서 열람/검색
- **일정/캘린더**: 주간 일정 확인, 주요 일정 관리
- **반응형 레이아웃**: 헤더·사이드바 기반 공통 레이아웃

## 🛠️ 기술 스택

- **핵심**: React 19, TypeScript 5, Vite 7(SWC)
- **스타일링**: Tailwind CSS v4
- **라우팅**: React Router v7
- **데이터/상태**: TanStack Query, Zustand, Axios

## 🚀 시작하기

### 사전 준비

- Node.js `v22`
- pnpm `v9.1.0` (Corepack 권장: `corepack enable`)

### 설치 및 실행

```bash
pnpm install
pnpm dev
```

- 앱: http://localhost:5173
- Mock API: http://localhost:8080

### 환경 변수

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080
```

- 실제 개발/프로덕션 API 주소는 **개별 공유** 및 **Vercel 환경 변수**로
  관리합니다.

## 📁 프로젝트 구조

```
src
├── api/        # API 유틸 (Axios 등)
├── assets/     # 정적 파일(이미지, 폰트, SVG)
├── components/ # 공용 UI/레이아웃 컴포넌트
├── constants/  # 공통 상수(경로, 설정 등)
├── hooks/      # 커스텀 훅
├── stores/     # Zustand 전역 상태
├── styles/     # 전역 스타일/테마
├── types/      # 공통 타입
├── utils/      # 유틸 함수
└── App.tsx
```

## 📚 문서 & 협업

- **프로젝트 위키**(개발 가이드·협업 규칙·배포 정책):  
  https://github.com/kakao-tech-campus-3rd-step3/Team9_FE/wiki
