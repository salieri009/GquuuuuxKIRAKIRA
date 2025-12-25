<div align="center">

![Kirakira Header](https://capsule-render.vercel.app/api?type=waving&color=0:00FFFF,100:FF00FF&height=200&section=header&text=Kirakira&fontSize=80&fontColor=ffffff&fontAlignY=35&desc=인터랙티브%203D%20건담%20효과%20뷰어&descAlignY=65&descSize=24&animation=fadeIn)

**기술적 정교함과 사용자 친화적 디자인의 만남**

언어: [🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | [🇯🇵 日本語](README.ja.md)

---

## 📋 프로젝트 정보

**프로젝트**: Kirakira - 인터랙티브 3D 건담 효과 뷰어  
**유형**: 웹 애플리케이션  
**기술**: React 18 + TypeScript + Three.js + Vite

</div>

---

## 🚀 개요

Three.js를 활용하여 건담 시리즈의 상징적인 시각 효과를 실시간으로 체험할 수 있는 현대적인 웹 애플리케이션입니다. GN 입자, 뉴타입 섬광, 미노프스키 입자 등을 인터랙티브한 3D 환경에서 경험해보세요.

---

## ✨ 주요 기능

- **🎭 3D 효과 뷰어**: 건담 시리즈의 전설적인 시각 효과를 실시간으로 렌더링
- **🎮 인터랙티브 컨트롤**: 파라미터를 실시간으로 조정하며 변화 관찰
- **📱 반응형 디자인**: 데스크탑과 모바일에서 최적화된 경험
- **🎨 미래지향적 UI**: 건담 미학에서 영감을 받은 세련되고 깔끔한 디자인
- **⚡ 고성능**: Webpack 코드 스플리팅을 통한 최적화된 렌더링
- **🌙 다크 테마**: 네온 포인트 컬러가 적용된 눈에 편안한 다크 테마
- **♿ 접근성**: 키보드 내비게이션을 지원하는 WCAG 2.1 AA 준수

---

## 🎯 프로젝트 목표

- ✅ Three.js를 활용한 인터랙티브 3D 효과 구현
- ✅ Vue.js 3 Composition API 활용 능력 시연
- ✅ MVC 아키텍처 패턴 적용
- ✅ 직관적이고 현대적인 사용자 인터페이스 생성
- ✅ 접근성 준수 보장
- ✅ 성능과 사용자 경험 최적화

---

## 🏃 빠른 시작

### 사전 요구사항

- **Node.js** 16+ 설치
- **npm** 9+ 또는 **yarn** 1.22+ 설치
- 의존성 설치를 위한 **인터넷 연결**

### 설치 및 설정

1. **저장소 클론**  
```bash
git clone <repository-url>
cd GundamKiraKIra
```

2. **의존성 설치**  
```bash
npm install
```

3. **개발 서버 실행**  
```bash
npm run dev
```

4. **애플리케이션 접속**  
```
http://localhost:8080
```

### 빌드 및 미리보기

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 빌드 미리보기
npm run preview
```

---

## 📁 프로젝트 구조

```
GundamKiraKIra/
├── frontend/
│   └── src/
│       ├── components/       # React 컴포넌트
│       │   ├── common/       # 공유 컴포넌트
│       │   ├── effects/      # 3D 효과 컴포넌트
│       │   ├── layout/       # 레이아웃 컴포넌트
│       │   └── ui/           # UI 프리미티브
│       ├── contexts/         # React Context 프로바이더
│       ├── effects/          # Three.js 효과 모듈
│       ├── hooks/            # 커스텀 React 훅
│       ├── services/         # API 서비스
│       ├── styles/           # CSS 변수 & 전역 스타일
│       └── data/             # 정적 효과 데이터
├── design-plan/              # 디자인 명세
│   ├── DESIGN/               # UI/UX 디자인 문서 (DES-001~008)
│   ├── RESEARCH/             # 시각 자료조사 (RES-001~004)
│   └── SPECS/                # 기술 명세 (SPEC-001~004)
├── docs/                     # 개발 가이드
└── vite.config.ts            # Vite 설정
└── webpack.config.js        # Webpack 설정
```

---

## 🛠️ 기술 스택

### 프론트엔드

- **React 18**: Hooks를 활용한 함수형 컴포넌트
- **TypeScript**: 타입 안전 개발
- **Three.js**: 3D 그래픽 및 WebGL 렌더링
- **Framer Motion**: 부드러운 애니메이션
- **Vite**: 빠른 개발 및 빌드 도구

### 스타일링

- **CSS3**: 커스텀 속성, 현대적 스타일링
- **PostCSS**: CSS 처리 및 최적화
- **반응형 디자인**: 모바일 우선 접근 방식

### 개발 도구

- **ESLint**: 코드 품질
- **Prettier**: 코드 포맷팅
- **Webpack Dev Server**: Hot Module Replacement

---

## 🎨 구현된 효과

### 🌌 GN 입자
- **시리즈**: 건담 00
- **설명**: GN 드라이브에서 방출되는 고에너지 입자
- **관련 기체**: 엑시아, 더블오 건담, 큐안타

### ⚡ 뉴타입 섬광
- **시리즈**: 우주세기
- **설명**: 뉴타입 각성 시 발생하는 강렬한 금색 섬광
- **관련 기체**: 뉴 건담, 유니콘 건담

### 🔮 미노프스키 입자
- **시리즈**: 우주세기
- **설명**: 미노프스키 입자의 전자기 간섭 효과
- **관련 기체**: 모든 모빌슈트

---

## 📚 문서

| 언어 | 문서 | 설명 |
| ----- | ---- | ---- |
| 🇰🇷 | [한국어](README.ko.md) | 한국어 전체 문서 |
| 🇺🇸 | [English](README.md) | 영어 전체 문서 |
| 🇯🇵 | [日本語](README.ja.md) | 일본어 전체 문서 |

### 디자인 명세 (`design-plan/`)

| 폴더 | 문서 | 내용 |
|------|------|------|
| `RESEARCH/` | RES-001~004 | 타임라인별 시각 자료조사 (UC/AD) |
| `DESIGN/` | DES-001~008 | 색상 시스템, 타이포그래피, 컴포넌트 |
| `SPECS/` | SPEC-001~004 | 아키텍처, API, 빌드 설정 |

### 기술 문서 (`design-plan/SPECS/`)

- [SPEC-001: 시스템 아키텍처](design-plan/SPECS/SPEC-001-System-Architecture.md)
- [SPEC-002: 컴포넌트 설계](design-plan/SPECS/SPEC-002-Component-Design.md)
- [SPEC-003: API & 데이터 흐름](design-plan/SPECS/SPEC-003-API-Data-Flow.md)
- [SPEC-004: 빌드 환경](design-plan/SPECS/SPEC-004-Build-Environment.md)

---

## 🎮 사용법

### 키보드 단축키

- `Ctrl/Cmd + I`: 정보 패널 토글
- `Ctrl/Cmd + L`: 라이브러리 패널 토글
- `Ctrl/Cmd + Enter`: 풀스크린 토글
- `Escape`: 모든 패널 닫기

### 마우스/터치 컨트롤

- **드래그**: 카메라 회전
- **스크롤**: 줌 인/아웃
- **터치**: 모바일 최적화 제스처

---

## 🧪 테스팅

```bash
# 테스트 실행
npm run test

# 테스트 커버리지
npm run test:coverage

# E2E 테스트
npm run test:e2e
```

---

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성
3. 변경사항 작성
4. Pull Request 제출

### 코드 표준

- Vue.js 스타일 가이드 준수
- ESLint 및 Prettier 사용
- 의미 있는 커밋 메시지 작성
- 새 기능에 대한 테스트 추가

---

## 📄 라이선스

이 프로젝트는 **교육 목적**으로 개발되었습니다. 모든 코드와 문서는 교육용으로만 사용됩니다.

---

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:00FFFF,100:FF00FF&height=150&section=footer&text=Kirakira&fontSize=60&fontColor=ffffff&fontAlignY=50&animation=fadeIn)

<div align="center">

**건담 애호가를 위해 ❤️로 제작되었습니다**

⭐ 이 저장소가 도움이 되었다면 스타를 눌러주세요! ⭐

</div>

