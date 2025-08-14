# 04. 디렉토리 구조 (Directory Structure)

- 프로젝트의 확장성과 유지보수성을 고려하여 기능별로 모듈화된 디렉토리 구조를 제안.

## 1. 최상위 디렉토리 구조

```
.
├── public/                  # 정적 파일 (favicon, robots.txt 등)
├── src/                     # 소스 코드 루트
│   ├── assets/              # CSS, 폰트, 이미지 등 에셋 파일
│   ├── components/          # 재사용 가능한 Vue 컴포넌트
│   ├── constants/           # 애플리케이션 전역 상수
│   ├── effects/             # Three.js 효과 모듈
│   ├── layouts/             # 페이지 레이아웃 컴포넌트
│   ├── mock/                # Mock 데이터 파일
│   ├── router/              # Vue Router 설정
│   ├── services/            # API 호출 등 외부 서비스 연동 로직
│   ├── store/               # Pinia 스토어 모듈
│   ├── styles/              # 전역 스타일 및 변수
│   ├── types/               # TypeScript 타입 정의
│   ├── utils/               # 순수 함수 유틸리티
│   ├── views/               # 페이지 레벨 컴포넌트
│   ├── App.vue              # 루트 Vue 컴포넌트
│   └── main.js              # 애플리케이션 진입점
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js        # PostCSS 설정
└── webpack.config.js           # Webpack 설정
```

## 2. 주요 디렉토리 설명

- **`src/assets`**: CSS 파일, 폰트, 로고 이미지 등 Webpack 빌드 프로세스에 포함될 정적 에셋을 위치시킴.
- **`src/components`**: 공통적으로 재사용되는 UI 컴포넌트를 기능 또는 역할에 따라 하위 디렉토리로 구분하여 관리. (예: `ui`, `layout`, `library`)
- **`src/constants`**: `API_ENDPOINTS`, `EVENT_NAMES` 등 애플리케이션 전반에서 사용되는 상수 값을 모아 관리.
- **`src/effects`**: 각 Three.js 효과의 구현 로직을 담은 JavaScript/TypeScript 모듈(`*.effect.js`)을 위치시킴. 각 파일은 `init`, `animate`, `dispose` 함수를 export하는 일관된 인터페이스를 가짐.
- **`src/layouts`**: 여러 페이지에서 공통으로 사용되는 레이아웃(예: 헤더와 푸터를 포함하는 `DefaultLayout.vue`)을 정의.
- **`src/mock`**: 개발 단계에서 사용할 Mock JSON 데이터 파일을 관리.
- **`src/router`**: `index.js` 파일에 Vue Router 인스턴스 생성 및 라우트 설정을 정의.
- **`src/services`**: API 연동, 외부 라이브러리 래핑 등 특정 도메인의 비즈니스 로직을 캡슐화.
- **`src/store`**: Pinia 스토어 모듈을 기능별로 분리하여 관리. (예: `effectStore.js`, `uiStore.js`)
- **`src/styles`**: 전역적으로 적용될 CSS, SCSS 변수, 믹스인 등을 관리.
- **`src/types`**: TypeScript 사용 시, 프로젝트 전반에서 사용될 인터페이스나 타입을 정의.
- **`src/utils`**: 특정 프레임워크에 의존하지 않는 순수 함수 유틸리티(예: 포맷팅 함수, 계산 함수)를 관리.
- **`src/views`**: Vue Router에 의해 매핑되는 페이지 단위의 컴포넌트를 위치시킴.
