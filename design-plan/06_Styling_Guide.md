# 06. 스타일링 가이드 (Styling Guide)

## 1. 기본 원칙

- **일관성**: 애플리케이션 전체에 걸쳐 일관된 디자인 언어를 사용.
- **모듈성**: 컴포넌트 스코프 스타일을 기본으로 하여 스타일 충돌을 방지. (Vue SFC의 `<style scoped>`)
- **반응형**: 모바일, 태블릿, 데스크탑 등 다양한 화면 크기에 대응하는 반응형 디자인을 적용.

## 2. 디자인 컨셉

- **Sleek, Futuristic, Clean**: 세련되고, 미래지향적이며, 깔끔한 느낌.
- **Color Palette**:
    - **Primary Background**: Very Dark Gray (예: `#121212`) - 눈의 피로를 줄이고 콘텐츠에 집중.
    - **Secondary Background**: Dark Gray (예: `#1E1E1E`) - 패널, 모달 등 구분되는 영역에 사용.
    - **Primary Accent**: Neon Cyan (예: `#00FFFF`) - 버튼, 링크, 활성화된 요소 등 주요 인터랙션에 사용.
    - **Secondary Accent**: Neon Magenta (예: `#FF00FF`) - 보조적인 강조나 특정 효과에 사용.
    - **Text Color**: Light Gray (예: `#E0E0E0`) - 기본 텍스트.
    - **Text Muted**: Medium Gray (예: `#888888`) - 보조 텍스트.
- **Typography**:
    - **Font Family**: `Roboto`, `Noto Sans KR`, `sans-serif` - 가독성이 높은 모던 산세리프 폰트 사용.
    - **Font Size**: 기본 `16px`를 기준으로, `rem` 단위를 사용하여 확장성을 확보.
    - **Font Weight**: `Light (300)`, `Regular (400)`, `Bold (700)` 등 다양한 굵기를 목적에 맞게 사용.

## 3. CSS 방법론

- **Scoped CSS**: Vue SFC의 `<style scoped>`를 사용하여 컴포넌트별 스타일을 캡슐화하는 것을 기본으로 함.
- **CSS 변수**: 색상, 폰트 크기, 간격 등 공통 디자인 토큰은 `:root`에 CSS 변수로 정의하여 재사용성과 유지보수성을 높임. (`src/styles/variables.css`)
- **PostCSS**: `autoprefixer`와 같은 플러그인을 사용하여 브라우저 호환성을 자동으로 관리.
    - Webpack에서는 `postcss-loader`를 사용하고, 루트에 `postcss.config.js`를 둠.
- **유틸리티 클래스 (선택 사항)**: `margin`, `padding`, `flex` 등 자주 사용되는 스타일은 유틸리티 클래스로 만들어 생산성을 높일 수 있음. (예: `.mt-4 { margin-top: 1rem; }`)

## 4. 파일 구조 (`src/styles`)

```
src/styles/
|-- base.css         # 브라우저 기본 스타일 리셋 및 전역 기본 스타일 정의
|-- variables.css    # CSS 변수 (색상, 폰트, 간격 등)
|-- typography.css   # h1, p 등 타이포그래피 관련 스타일
`-- utils.css        # 유틸리티 클래스 (선택 사항)
```

- `main.js`에서 이 스타일 파일들을 순서대로 import하여 전역에 적용.

```javascript
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// 전역 스타일 import
import './styles/variables.css';
import './styles/base.css';
import './styles/typography.css';

// 선택: 유틸리티 클래스
// import './styles/utils.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
```
