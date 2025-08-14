# 01. 시스템 아키텍처 (System Architecture)

## 1. 개요

- Webpack을 기반으로 Vue.js 애플리케이션을 빌드하며, Three.js를 3D 렌더링 엔진으로 사용.
- 컴포넌트 기반 아키텍처(CBA)를 채택하여 코드의 재사용성과 유지보수성을 극대화.
- Pinia를 이용한 중앙 집중식 상태 관리를 통해 데이터 흐름을 명확하고 예측 가능하게 설계.

## 2. 아키텍처 다이어그램

```
[Client: Web Browser]
       |
[View Layer: Vue.js] <--- [Routing: Vue Router]
       |
       +---- [Component: Header]
       |
       +---- [Component: Main Canvas (Three.js)]
       |      |
       |      +---- [3D Effect Modules]
       |
       +---- [Component: Control Panel]
       |
       +---- [Component: Information Modal]
       |
[State Management: Pinia] <--- [Data Fetching] ---> [API / Mock Data]
       |
       +---- [Store: Effect Store] (효과 목록, 현재 선택된 효과)
       |
       +---- [Store: UI Store] (모달 상태, 로딩 상태 등)
```

## 3. 주요 레이어 설명

### 3.1. View Layer (Vue.js)

- 사용자와의 상호작용을 담당하는 UI 계층.
- Vue Router를 통해 페이지를 전환하고, 각 페이지는 여러 개의 재사용 가능한 컴포넌트로 구성.

### 3.2. 3D Rendering Layer (Three.js)

- `MainCanvas.vue` 컴포넌트 내에서 Three.js Scene을 초기화하고 관리.
- 각 3D 효과는 별도의 모듈(`*.effect.js`)로 분리하여 필요에 따라 동적으로 로드. 이를 통해 메인 로직과 3D 효과 구현을 분리.
 - 효과 모듈은 Webpack의 dynamic import(`import()`)로 지연 로드하여 초기 번들을 최소화.

### 3.3. State Management Layer (Pinia)

- 애플리케이션의 전역 상태를 관리.
- **Effect Store**: 서버로부터 가져온 효과 목록, 현재 사용자가 선택한 효과의 정보 및 파라미터 값을 저장.
- **UI Store**: 모달 창의 표시 여부, 로딩 상태, 언어 설정 등 UI와 관련된 상태를 관리.

### 3.4. Data Layer (API / Mock)

- 백엔드 API와의 통신을 담당.
- 초기 개발 단계에서는 Mock 데이터를 사용하여 UI 및 기능 개발을 진행.
- API 호출 로직은 별도의 서비스 모듈(`services/api.js`)로 분리하여, 향후 실제 API로 전환이 용이하도록 설계.

## 4. Webpack 구성 요약

- `resolve.alias`: `@ -> src` 별칭 제공으로 import 경로 단순화.
- `DefinePlugin`: `process.env.NODE_ENV` 주입으로 개발/운영 분기.
- `devServer`:
       - `hot: true` (HMR)
       - `historyApiFallback: true` (SPA 라우팅 지원)
       - `static: public` (정적 에셋 제공)
- 코드 스플리팅: 효과 모듈 및 뷰 레벨 컴포넌트는 `import()` 사용.

## 5. 에러 처리 & 로깅 전략

- 서비스 레이어에서 네트워크 예외를 `throw`로 전파, 뷰 레이어에서 사용자 친화 메시지 표시.
- 전역 에러 핸들러: `app.config.errorHandler`에 로그 수집 훅 연결(콘솔/추후 APM 연동).
- 로딩/에러 상태는 Pinia `status` 필드로 관리(`idle/loading/succeeded/failed`).
