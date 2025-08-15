# 🚀 Kirakira - Gundam Effects Viewer

<div align="center">

![Kirakira Logo](https://img.shields.io/badge/Kirakira-Gundam%20Effects-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?style=for-the-badge&logo=vite)

**건담 시리즈의 전설적인 시각 효과들을 3D로 체험하는 인터랙티브 웹 애플리케이션**

[🚀 데모 보기](#-데모) • [📖 문서](#-문서) • [🛠️ 개발](#-개발) • [🎨 기능](#-기능)

</div>

---

## ✨ 프로젝트 소개

**Kirakira**는 건담 시리즈에서 영감을 받은 3D 시각 효과들을 실시간으로 체험할 수 있는 웹 애플리케이션입니다. GN 입자, 뉴타입 섬광, 미노프스키 입자 등 건담 세계관의 상징적인 효과들을 Three.js와 React를 통해 구현했습니다.

### 🌟 주요 특징

- **🎭 3D 효과 체험**: 건담 시리즈의 전설적인 시각 효과들을 실시간으로 체험
- **🎮 인터랙티브 컨트롤**: 파라미터를 실시간으로 조정하며 효과 변화 관찰
- **📱 반응형 디자인**: 데스크탑과 모바일 모두에서 최적화된 경험
- **🎨 건담 테마**: 건담 세계관에 어울리는 미래지향적 UI/UX
- **⚡ 고성능**: Vite와 Three.js를 활용한 빠른 렌더링

---

## 🎨 구현된 효과들

### 🌌 GN 입자 (GN Particles)
- **출처**: 건담 00 시리즈
- **설명**: GN 드라이브에서 방출되는 고에너지 입자들의 환상적인 빛의 향연
- **관련 건담**: 가넷 건담, 엑시아, 더블오, 큐안타

### ⚡ 뉴타입 섬광 (Newtype Flash)
- **출처**: 건담 UC 시리즈
- **설명**: 뉴타입의 정신적 각성 순간에 발생하는 강렬한 금색 섬광과 충격파
- **관련 건담**: 뉴 건담, 유니콘 건담, 바나지, 아무로

### 🔮 미노프스키 입자 (Minofsky Particles)
- **출처**: 건담 UC 시리즈
- **설명**: MS의 핵융합 반응에서 생성되는 미노프스키 입자의 전자기 간섭 효과
- **관련 건담**: 건담, 자쿠, 겔구그, 모든 MS

---

## 🛠️ 기술 스택

### **Frontend Framework**
- **React 18.3.1** - 최신 React 기능과 동시성 렌더링
- **TypeScript 5.5.3** - 타입 안전성과 개발자 경험 향상
- **Vite 5.4.2** - 빠른 개발 서버와 빌드 도구

### **3D Graphics & Animation**
- **Three.js 0.158.0** - WebGL 기반 3D 렌더링
- **@react-three/fiber** - React용 Three.js 렌더러
- **@react-three/drei** - Three.js 유틸리티 컴포넌트
- **Framer Motion** - 부드러운 애니메이션과 전환 효과

### **State Management & Utilities**
- **Zustand** - 가벼운 상태 관리 라이브러리
- **Immer** - 불변성 보장과 상태 업데이트 단순화
- **clsx** - 조건부 클래스명 조합

### **Styling & UI**
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **PostCSS** - CSS 전처리 및 최적화
- **CSS Variables** - 테마 시스템과 동적 스타일링

### **Development Tools**
- **ESLint** - 코드 품질 및 일관성 유지
- **Prettier** - 코드 포맷팅
- **TypeScript ESLint** - TypeScript 전용 린팅 규칙

---

## 🚀 빠른 시작

### **사전 요구사항**
- **Node.js** 18.0.0 이상
- **npm** 9.0.0 이상 또는 **yarn** 1.22.0 이상

### **설치 및 실행**

```bash
# 저장소 클론
git clone https://github.com/your-username/kirakira.git
cd kirakira/frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 열기
# http://localhost:5173
```

### **빌드 및 배포**

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 린팅
npm run lint

# 타입 체크
npm run type-check
```

---

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── ui/             # 기본 UI 컴포넌트
│   │   ├── layout/         # 레이아웃 컴포넌트
│   │   └── effects/        # 3D 효과 컴포넌트
│   ├── store/              # Zustand 상태 관리
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   ├── styles/             # 글로벌 스타일
│   └── contexts/           # React Context
├── public/                 # 정적 자산
├── docs/                   # 개발 문서
└── design-plan/            # 기획 문서
```

---

## 🎮 사용법

### **키보드 단축키**
- **Ctrl + I**: 정보 패널 토글
- **Ctrl + L**: 라이브러리 패널 토글
- **Ctrl + K**: 컨트롤 패널 토글
- **Ctrl + Enter**: 풀스크린 모드
- **Escape**: 모든 패널 닫기

### **마우스/터치 컨트롤**
- **드래그**: 카메라 회전
- **스크롤**: 줌 인/아웃
- **터치**: 모바일 최적화된 제스처

---

## 🎨 테마 시스템

### **지원 테마**
- **🌙 다크 테마**: 기본 테마, 건담 세계관에 어울리는 어두운 분위기
- **☀️ 라이트 테마**: 밝고 깔끔한 인터페이스
- **🔍 고대비 테마**: 접근성을 위한 고대비 모드

### **커스터마이징**
- 글로우 효과 on/off
- 모션 감소 모드 지원
- 반응형 레이아웃 자동 조정

---

## 🧪 테스트

```bash
# 단위 테스트 실행
npm run test

# 테스트 커버리지 확인
npm run test:coverage

# E2E 테스트 (Cypress)
npm run test:e2e
```

---

## 📚 개발 문서

자세한 개발 가이드는 `docs/` 폴더를 참조하세요:

- [개발 환경 설정](docs/01_Development_Environment_Setup.md)
- [컴포넌트 구현 가이드](docs/02_Component_Implementation_Guide.md)
- [상태 관리 가이드](docs/03_State_Management_Guide.md)
- [3D 효과 시스템 가이드](docs/04_3D_Effect_System_Guide.md)
- [API 서비스 가이드](docs/05_API_Services_Guide.md)
- [스타일링 구현 가이드](docs/06_Styling_Implementation_Guide.md)
- [테스트 설정 가이드](docs/07_Testing_Setup_Guide.md)
- [배포 가이드](docs/08_Deployment_Guide.md)

---

## 🤝 기여하기

### **개발 환경 설정**
1. 프로젝트를 포크하고 클론
2. `npm install`로 의존성 설치
3. `npm run dev`로 개발 서버 실행
4. 새로운 브랜치에서 개발
5. Pull Request 생성

### **코드 컨벤션**
- **TypeScript**: 엄격한 타입 체크 사용
- **ESLint**: 코드 품질 규칙 준수
- **Prettier**: 일관된 코드 포맷팅
- **커밋 메시지**: [Conventional Commits](https://www.conventionalcommits.org/) 형식

---

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 🙏 감사의 말

- **Sunrise Inc.** - 건담 시리즈 제작
- **Three.js Community** - 놀라운 3D 웹 기술
- **React Team** - 혁신적인 UI 라이브러리
- **Vite Team** - 빠른 빌드 도구

---

## 📞 연락처

- **프로젝트**: [GitHub Issues](https://github.com/your-username/kirakira/issues)
- **개발자**: [GitHub Profile](https://github.com/your-username)
- **이메일**: your-email@example.com

---

<div align="center">

**⭐ 이 프로젝트가 마음에 드셨다면 스타를 눌러주세요! ⭐**

Made with ❤️ by Gundam Fans for Gundam Fans

</div>
