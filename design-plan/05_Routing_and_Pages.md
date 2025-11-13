# 05. 라우팅 및 페이지 설계 (Routing and Pages)

## 1. 라우팅 설계

- Vue Router를 사용하여 SPA(Single Page Application)의 페이지 전환을 관리.
- 프로젝트 규모가 크지 않으므로, 중첩 라우트보다는 플랫한 구조의 라우트를 사용.
 - Webpack `devServer.historyApiFallback: true` 설정으로 새로고침 시 404 방지.
 - 라우트 컴포넌트는 필요 시 지연 로딩(`import()`)으로 코드 스플리팅.

## 2. 라우트 정의 (`src/router/index.js`)

- **`/` (Home)**: 메인 페이지. 3D 효과 뷰어와 컨트롤 패널 등 핵심 기능이 위치.
- **`/:pathMatch(.*)*` (Not Found)**: 정의되지 않은 모든 경로에 대해 404 페이지를 표시.

```javascript
// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
// 지연 로딩 예시 (필요 시 적용)
const HomePage = () => import('@/views/HomePage.vue');
const NotFoundPage = () => import('@/views/NotFoundPage.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    // 메타 필드를 사용하여 페이지별 레이아웃이나 제목 등을 관리할 수 있음
    meta: {
      title: 'Kirakira - Gundam Effects',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      title: '404 - Not Found',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드를 사용하여 페이지 타이틀을 동적으로 변경
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Kirakira';
  next();
});

export default router;
```

## 3. 페이지 컴포넌트 명세

### 3.1. `views/HomePage.vue`

- **역할**: 애플리케이션의 메인 랜딩 페이지. 모든 핵심 컴포넌트를 조합하여 완전한 사용자 경험을 제공.
- **구성 요소**:
    - `TheHeader`: 사이트 탐색 및 로고.
    - `EffectCanvas`: 중앙에 위치하는 3D 뷰어.
    - `EffectList`: 사이드바 형태로 제공되는 효과 라이브러리.
    - `EffectControls`: 선택된 효과를 제어하는 컨트롤 패널.
    - `InfoPanel`: 효과의 상세 정보를 보여주는 패널.
    - `TheFooter`: 저작권 및 추가 정보.
- **로직**:
    - 페이지 마운트 시 `effectStore`의 `fetchEffects` 액션을 호출하여 효과 목록 데이터를 로드.
    - `effectStore`와 `uiStore`의 상태를 구독하여 각 하위 컴포넌트에 필요한 데이터와 상태(props)를 전달.
    - 하위 컴포넌트에서 발생한 이벤트(예: `@update:param`)를 수신하여 적절한 스토어 액션을 호출.

### 3.2. `views/NotFoundPage.vue`

- **역할**: 사용자가 잘못된 URL로 접근했을 때 안내 메시지를 표시.
- **구성 요소**:
    - 간단한 텍스트 메시지와 홈으로 돌아갈 수 있는 링크(`RouterLink`).
- **디자인**:
    - 중앙 정렬된 컨테이너에 "404 - Page Not Found"와 같은 명확한 메시지를 표시.
    - 사이트의 전체적인 디자인 톤앤매너를 유지.
