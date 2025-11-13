# 06. 스타일링 구현 가이드

## 1. 디자인 시스템 개요

### 1.1. 디자인 컨셉
- **Sleek, Futuristic, Clean**: 세련되고 미래지향적이며 깔끔한 디자인
- **건담 세계관**: SF적 분위기와 메카닉 감성
- **사용성 우선**: 직관적이고 접근 가능한 인터페이스
- **반응형**: 모든 디바이스에서 최적화된 경험

### 1.2. 색상 팔레트
```css
/* Primary Colors */
--color-primary-bg: #121212;        /* 메인 배경 */
--color-secondary-bg: #1E1E1E;      /* 패널, 모달 배경 */
--color-tertiary-bg: #2A2A2A;       /* 카드, 버튼 배경 */

/* Accent Colors */
--color-primary-accent: #00FFFF;    /* 시안 (기본 강조) */
--color-secondary-accent: #FF00FF;  /* 마젠타 (보조 강조) */
--color-success: #00FF88;           /* 성공 (GN 입자 색) */
--color-warning: #FFD700;           /* 경고 (뉴타입 색) */
--color-error: #FF4444;             /* 오류 */

/* Text Colors */
--color-text: #E0E0E0;              /* 기본 텍스트 */
--color-text-muted: #888888;        /* 보조 텍스트 */
--color-text-inverse: #121212;      /* 역전 텍스트 */

/* Border & UI */
--color-border: #333333;            /* 경계선 */
--color-border-focus: #00FFFF;      /* 포커스 경계선 */
--color-shadow: rgba(0, 255, 255, 0.3); /* 그림자 */
```

### 1.3. 타이포그래피
```css
/* Font Families */
--font-family-primary: 'Roboto', 'Noto Sans KR', sans-serif;
--font-family-mono: 'Roboto Mono', 'Consolas', monospace;

/* Font Sizes */
--font-size-xs: 0.75rem;     /* 12px */
--font-size-sm: 0.875rem;    /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;    /* 18px */
--font-size-xl: 1.25rem;     /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
--font-size-3xl: 2rem;       /* 32px */
--font-size-4xl: 2.5rem;     /* 40px */

/* Font Weights */
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### 1.4. 간격 시스템
```css
/* Spacing Scale */
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
```

## 2. 전역 스타일 구현

### 2.1. variables.css

```css
/**
 * CSS 커스텀 속성 (CSS Variables)
 * 전역에서 사용되는 디자인 토큰 정의
 */

:root {
  /* === 색상 시스템 === */
  
  /* 배경 색상 */
  --color-primary-bg: #121212;
  --color-secondary-bg: #1E1E1E;
  --color-tertiary-bg: #2A2A2A;
  
  /* 강조 색상 */
  --color-primary-accent: #00FFFF;
  --color-secondary-accent: #FF00FF;
  --color-success: #00FF88;
  --color-warning: #FFD700;
  --color-error: #FF4444;
  --color-info: #3B82F6;
  
  /* 텍스트 색상 */
  --color-text: #E0E0E0;
  --color-text-muted: #888888;
  --color-text-inverse: #121212;
  --color-text-accent: var(--color-primary-accent);
  
  /* UI 요소 */
  --color-border: #333333;
  --color-border-light: #444444;
  --color-border-focus: var(--color-primary-accent);
  --color-overlay: rgba(18, 18, 18, 0.8);
  
  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 20px var(--color-primary-accent);
  --shadow-glow-strong: 0 0 30px var(--color-primary-accent);
  
  /* === 타이포그래피 === */
  
  /* 폰트 패밀리 */
  --font-family-primary: 'Roboto', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'Roboto Mono', 'SF Mono', 'Consolas', 'Liberation Mono', monospace;
  
  /* 폰트 크기 */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;
  
  /* 폰트 굵기 */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 행간 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* === 간격 시스템 === */
  
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  
  /* === 레이아웃 === */
  
  /* 화면 너비 */
  --screen-sm: 640px;
  --screen-md: 768px;
  --screen-lg: 1024px;
  --screen-xl: 1280px;
  --screen-2xl: 1536px;
  
  /* 컨테이너 최대 너비 */
  --container-sm: 100%;
  --container-md: 100%;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;
  
  /* Z-index 계층 */
  --z-index-dropdown: 100;
  --z-index-sticky: 200;
  --z-index-fixed: 300;
  --z-index-modal-backdrop: 400;
  --z-index-modal: 500;
  --z-index-popover: 600;
  --z-index-tooltip: 700;
  --z-index-toast: 800;
  
  /* === 애니메이션 === */
  
  /* 지속 시간 */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
  
  /* 이징 함수 */
  --easing-linear: linear;
  --easing-ease: ease;
  --easing-ease-in: ease-in;
  --easing-ease-out: ease-out;
  --easing-ease-in-out: ease-in-out;
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* === 특수 효과 === */
  
  /* 블러 */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 16px;
  
  /* 테두리 반지름 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* 투명도 */
  --opacity-disabled: 0.4;
  --opacity-hover: 0.8;
  --opacity-focus: 0.9;
}

/* === 다크 테마 (기본) === */
[data-theme="dark"] {
  /* 이미 위에서 정의된 다크 색상들 */
}

/* === 라이트 테마 (선택적) === */
[data-theme="light"] {
  --color-primary-bg: #FFFFFF;
  --color-secondary-bg: #F8F9FA;
  --color-tertiary-bg: #E9ECEF;
  
  --color-text: #212529;
  --color-text-muted: #6C757D;
  --color-text-inverse: #FFFFFF;
  
  --color-border: #DEE2E6;
  --color-border-light: #E9ECEF;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}

/* === 접근성 고려 === */

/* 모션 감소 설정 */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }
}

/* 대비 증가 설정 */
@media (prefers-contrast: high) {
  :root {
    --color-border: #FFFFFF;
    --color-text-muted: #CCCCCC;
  }
}
```

### 2.2. base.css

```css
/**
 * 기본 스타일 및 CSS 리셋
 */

/* === CSS 리셋 === */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  /* 브라우저 기본 폰트 크기 기준으로 rem 계산 */
  font-size: 16px;
  
  /* 부드러운 스크롤 */
  scroll-behavior: smooth;
  
  /* iOS 터치 하이라이트 제거 */
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background-color: var(--color-primary-bg);
  
  /* 폰트 렌더링 최적화 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* 텍스트 렌더링 최적화 */
  text-rendering: optimizeLegibility;
  
  /* 오버플로우 처리 */
  overflow-x: hidden;
}

/* === 폰트 로딩 === */

/* Roboto 폰트 로딩 */
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Roboto+Mono:wght@400;500;700&display=swap');

/* === 기본 요소 스타일 === */

/* 링크 */
a {
  color: var(--color-primary-accent);
  text-decoration: none;
  transition: color var(--duration-normal) var(--easing-ease-out);
}

a:hover {
  color: var(--color-primary-accent);
  opacity: var(--opacity-hover);
}

a:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* 버튼 */
button {
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
  transition: all var(--duration-normal) var(--easing-ease-out);
}

button:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

/* 입력 요소 */
input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background: transparent;
  border: 1px solid var(--color-border);
  transition: border-color var(--duration-normal) var(--easing-ease-out);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
}

/* 이미지 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 목록 */
ul,
ol {
  list-style: none;
}

/* 테이블 */
table {
  border-collapse: collapse;
  width: 100%;
}

/* === 스크롤바 커스터마이징 === */

/* Webkit 브라우저 (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-secondary-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-accent);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) var(--color-secondary-bg);
}

/* === 선택 영역 스타일 === */

::selection {
  background: var(--color-primary-accent);
  color: var(--color-text-inverse);
}

::-moz-selection {
  background: var(--color-primary-accent);
  color: var(--color-text-inverse);
}

/* === 포커스 스타일 === */

:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* === 숨김 요소 === */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* === 유틸리티 클래스 === */

/* 디스플레이 */
.hidden { display: none !important; }
.block { display: block !important; }
.inline { display: inline !important; }
.inline-block { display: inline-block !important; }
.flex { display: flex !important; }
.inline-flex { display: inline-flex !important; }
.grid { display: grid !important; }

/* 가시성 */
.invisible { visibility: hidden !important; }
.visible { visibility: visible !important; }

/* 포지션 */
.relative { position: relative !important; }
.absolute { position: absolute !important; }
.fixed { position: fixed !important; }
.sticky { position: sticky !important; }

/* 텍스트 정렬 */
.text-left { text-align: left !important; }
.text-center { text-align: center !important; }
.text-right { text-align: right !important; }

/* 포인터 이벤트 */
.pointer-events-none { pointer-events: none !important; }
.pointer-events-auto { pointer-events: auto !important; }

/* 사용자 선택 */
.select-none { user-select: none !important; }
.select-all { user-select: all !important; }
.select-auto { user-select: auto !important; }
```

### 2.3. typography.css

```css
/**
 * 타이포그래피 스타일
 */

/* === 헤딩 스타일 === */

h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text);
  margin-bottom: var(--spacing-4);
}

h1 {
  font-size: var(--font-size-4xl);
  color: var(--color-primary-accent);
  text-shadow: 0 0 10px var(--color-primary-accent);
  letter-spacing: -0.025em;
}

h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.025em;
}

h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-secondary-accent);
}

h4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
}

h5 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

h6 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* === 본문 텍스트 === */

p {
  margin-bottom: var(--spacing-4);
  line-height: var(--line-height-relaxed);
}

/* 리드 텍스트 (소개 문단) */
.lead {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
  margin-bottom: var(--spacing-6);
}

/* 작은 텍스트 */
.small, small {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* 극소 텍스트 */
.xs {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* === 강조 텍스트 === */

strong, b {
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

em, i {
  font-style: italic;
  color: var(--color-text);
}

mark {
  background: linear-gradient(90deg, var(--color-primary-accent), var(--color-secondary-accent));
  color: var(--color-text-inverse);
  padding: 0.1em 0.2em;
  border-radius: var(--radius-sm);
}

/* === 코드 텍스트 === */

code {
  font-family: var(--font-family-mono);
  font-size: 0.875em;
  background: var(--color-tertiary-bg);
  color: var(--color-primary-accent);
  padding: 0.125em 0.375em;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

pre {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  background: var(--color-secondary-bg);
  color: var(--color-text);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow-x: auto;
  margin-bottom: var(--spacing-4);
  line-height: var(--line-height-relaxed);
}

pre code {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
}

/* === 인용문 === */

blockquote {
  border-left: 4px solid var(--color-primary-accent);
  padding-left: var(--spacing-4);
  margin: var(--spacing-6) 0;
  font-style: italic;
  color: var(--color-text-muted);
  background: var(--color-secondary-bg);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}

blockquote cite {
  display: block;
  margin-top: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-style: normal;
  color: var(--color-text-muted);
}

blockquote cite::before {
  content: "— ";
}

/* === 목록 === */

ul, ol {
  margin-bottom: var(--spacing-4);
  padding-left: var(--spacing-6);
}

ul {
  list-style: none;
}

ul li {
  position: relative;
  margin-bottom: var(--spacing-2);
}

ul li::before {
  content: "▸";
  color: var(--color-primary-accent);
  position: absolute;
  left: -var(--spacing-6);
  font-weight: var(--font-weight-bold);
}

ol {
  list-style: decimal;
  list-style-position: outside;
}

ol li {
  margin-bottom: var(--spacing-2);
  padding-left: var(--spacing-1);
}

/* 중첩 목록 */
ul ul, ol ol, ul ol, ol ul {
  margin-top: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

/* === 설명 목록 === */

dl {
  margin-bottom: var(--spacing-4);
}

dt {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin-bottom: var(--spacing-1);
}

dd {
  margin-bottom: var(--spacing-3);
  color: var(--color-text-muted);
  padding-left: var(--spacing-4);
}

/* === 링크 스타일 === */

.link {
  color: var(--color-primary-accent);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 0.2em;
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.link:hover {
  text-decoration-color: var(--color-primary-accent);
  text-shadow: 0 0 5px var(--color-primary-accent);
}

/* 외부 링크 */
.link-external::after {
  content: " ↗";
  font-size: 0.875em;
  opacity: 0.7;
}

/* === 텍스트 유틸리티 === */

/* 폰트 크기 */
.text-xs { font-size: var(--font-size-xs) !important; }
.text-sm { font-size: var(--font-size-sm) !important; }
.text-base { font-size: var(--font-size-base) !important; }
.text-lg { font-size: var(--font-size-lg) !important; }
.text-xl { font-size: var(--font-size-xl) !important; }
.text-2xl { font-size: var(--font-size-2xl) !important; }
.text-3xl { font-size: var(--font-size-3xl) !important; }
.text-4xl { font-size: var(--font-size-4xl) !important; }

/* 폰트 굵기 */
.font-light { font-weight: var(--font-weight-light) !important; }
.font-normal { font-weight: var(--font-weight-normal) !important; }
.font-medium { font-weight: var(--font-weight-medium) !important; }
.font-semibold { font-weight: var(--font-weight-semibold) !important; }
.font-bold { font-weight: var(--font-weight-bold) !important; }

/* 행간 */
.leading-tight { line-height: var(--line-height-tight) !important; }
.leading-normal { line-height: var(--line-height-normal) !important; }
.leading-relaxed { line-height: var(--line-height-relaxed) !important; }

/* 텍스트 색상 */
.text-primary { color: var(--color-text) !important; }
.text-muted { color: var(--color-text-muted) !important; }
.text-accent { color: var(--color-primary-accent) !important; }
.text-secondary-accent { color: var(--color-secondary-accent) !important; }
.text-success { color: var(--color-success) !important; }
.text-warning { color: var(--color-warning) !important; }
.text-error { color: var(--color-error) !important; }

/* 텍스트 변환 */
.uppercase { text-transform: uppercase !important; }
.lowercase { text-transform: lowercase !important; }
.capitalize { text-transform: capitalize !important; }

/* 텍스트 장식 */
.underline { text-decoration: underline !important; }
.line-through { text-decoration: line-through !important; }
.no-underline { text-decoration: none !important; }

/* 텍스트 오버플로우 */
.truncate {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.text-ellipsis {
  overflow: hidden !important;
  display: -webkit-box !important;
  -webkit-box-orient: vertical !important;
  -webkit-line-clamp: 2 !important;
}

/* 줄바꿈 */
.whitespace-nowrap { white-space: nowrap !important; }
.whitespace-pre { white-space: pre !important; }
.whitespace-pre-wrap { white-space: pre-wrap !important; }

/* === 특수 효과 === */

/* 글로우 효과 */
.text-glow {
  text-shadow: 0 0 10px currentColor;
}

.text-glow-strong {
  text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
}

/* 그라디언트 텍스트 */
.text-gradient {
  background: linear-gradient(90deg, var(--color-primary-accent), var(--color-secondary-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 애니메이션 */
.text-shimmer {
  background: linear-gradient(
    90deg, 
    var(--color-text-muted) 25%, 
    var(--color-text) 50%, 
    var(--color-text-muted) 75%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 3. 컴포넌트별 스타일 가이드

### 3.1. 버튼 컴포넌트 스타일

```css
/**
 * 버튼 컴포넌트 스타일
 * src/components/ui/BaseButton.vue에서 사용
 */

.btn {
  /* 기본 스타일 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  
  /* 패딩 및 크기 */
  padding: var(--spacing-3) var(--spacing-4);
  min-height: 40px;
  
  /* 폰트 */
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  
  /* 테두리 및 배경 */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-tertiary-bg);
  color: var(--color-text);
  
  /* 커서 및 전환 */
  cursor: pointer;
  user-select: none;
  transition: all var(--duration-normal) var(--easing-ease-out);
  
  /* 포커스 및 상태 */
  position: relative;
  overflow: hidden;
}

/* 호버 효과 */
.btn:hover:not(:disabled) {
  border-color: var(--color-primary-accent);
  color: var(--color-primary-accent);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 포커스 효과 */
.btn:focus:not(:disabled) {
  outline: none;
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.3);
}

/* 활성 상태 */
.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 비활성 상태 */
.btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* === 버튼 변형 === */

/* Primary 버튼 */
.btn--primary {
  background: var(--color-primary-accent);
  border-color: var(--color-primary-accent);
  color: var(--color-text-inverse);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.btn--primary:hover:not(:disabled) {
  background: #00cccc;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Secondary 버튼 */
.btn--secondary {
  background: var(--color-secondary-accent);
  border-color: var(--color-secondary-accent);
  color: var(--color-text-inverse);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.3);
}

.btn--secondary:hover:not(:disabled) {
  background: #cc00cc;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
}

/* Outline 버튼 */
.btn--outline {
  background: transparent;
  border-color: var(--color-primary-accent);
  color: var(--color-primary-accent);
}

.btn--outline:hover:not(:disabled) {
  background: rgba(0, 255, 255, 0.1);
  color: var(--color-primary-accent);
}

/* Ghost 버튼 */
.btn--ghost {
  background: transparent;
  border-color: transparent;
  color: var(--color-text-muted);
}

.btn--ghost:hover:not(:disabled) {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--color-primary-accent);
  color: var(--color-primary-accent);
}

/* Danger 버튼 */
.btn--danger {
  background: var(--color-error);
  border-color: var(--color-error);
  color: var(--color-text-inverse);
}

.btn--danger:hover:not(:disabled) {
  background: #cc3333;
  border-color: #cc3333;
}

/* === 버튼 크기 === */

.btn--xs {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
  min-height: 24px;
}

.btn--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  min-height: 32px;
}

.btn--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
  min-height: 48px;
}

.btn--xl {
  padding: var(--spacing-5) var(--spacing-8);
  font-size: var(--font-size-xl);
  min-height: 56px;
}

/* === 특수 버튼 === */

/* 원형 버튼 */
.btn--round {
  border-radius: var(--radius-full);
}

/* 아이콘 전용 버튼 */
.btn--icon {
  padding: var(--spacing-2);
  min-width: 40px;
  border-radius: var(--radius-md);
}

.btn--icon.btn--sm {
  padding: var(--spacing-1);
  min-width: 32px;
}

.btn--icon.btn--lg {
  padding: var(--spacing-3);
  min-width: 48px;
}

/* 전체 너비 버튼 */
.btn--block {
  width: 100%;
}

/* 로딩 상태 */
.btn--loading {
  position: relative;
  color: transparent !important;
}

.btn--loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* === 버튼 그룹 === */

.btn-group {
  display: inline-flex;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.btn-group .btn {
  border-radius: 0;
  margin-left: -1px;
}

.btn-group .btn:first-child {
  margin-left: 0;
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
}

.btn-group .btn:last-child {
  border-top-right-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.btn-group .btn:hover,
.btn-group .btn:focus {
  z-index: 1;
  position: relative;
}

/* === 애니메이션 === */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 버튼 웨이브 효과 */
.btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.btn:active::before {
  width: 300px;
  height: 300px;
}
```

### 3.2. 입력 필드 스타일

```css
/**
 * 입력 필드 스타일
 * 폼 컨트롤 및 인터랙티브 요소
 */

/* === 기본 입력 필드 === */

.form-control {
  display: block;
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text);
  background: var(--color-secondary-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--duration-normal) var(--easing-ease-out);
  appearance: none;
}

.form-control::placeholder {
  color: var(--color-text-muted);
  opacity: 1;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
  background: var(--color-primary-bg);
}

.form-control:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
  background: var(--color-border);
}

/* === 입력 필드 크기 === */

.form-control--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-xs);
}

.form-control--lg {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--font-size-base);
}

/* === 슬라이더 (Range) === */

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary-accent);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.slider::-webkit-slider-thumb:hover {
  width: 20px;
  height: 20px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: var(--color-primary-accent);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

/* === 체크박스 === */

.checkbox {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
}

.checkbox input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-mark {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: var(--color-secondary-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: all var(--duration-normal) var(--easing-ease-out);
  cursor: pointer;
}

.checkbox input:checked + .checkbox-mark {
  background: var(--color-primary-accent);
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.checkbox-mark::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--easing-ease-out);
}

.checkbox input:checked + .checkbox-mark::after {
  opacity: 1;
}

/* === 토글 스위치 === */

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-border);
  border-radius: 24px;
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.toggle-slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: all var(--duration-normal) var(--easing-ease-out);
  box-shadow: var(--shadow-sm);
}

.toggle input:checked + .toggle-slider {
  background: var(--color-primary-accent);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(26px);
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

/* === 셀렉트 박스 === */

.select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.select select {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-8) var(--spacing-3) var(--spacing-4);
  background: var(--color-secondary-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  appearance: none;
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.select::after {
  content: "▼";
  position: absolute;
  top: 50%;
  right: var(--spacing-4);
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
  font-size: var(--font-size-xs);
}

.select select:focus {
  outline: none;
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2);
}

/* === 컬러 피커 === */

.color-picker {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.color-picker input[type="color"] {
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  cursor: pointer;
}

.color-picker:hover {
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

/* === 폼 그룹 === */

.form-group {
  margin-bottom: var(--spacing-5);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.form-label.required::after {
  content: " *";
  color: var(--color-error);
}

.form-help {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.form-error {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

/* === 인라인 폼 === */

.form-inline {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.form-inline .form-group {
  margin-bottom: 0;
  flex: 1;
}

.form-inline .form-label {
  margin-bottom: 0;
  margin-right: var(--spacing-2);
  white-space: nowrap;
}
```

## 4. 애니메이션 시스템

### 4.1. animations.css

```css
/**
 * 애니메이션 및 전환 효과
 */

/* === 키프레임 애니메이션 === */

/* 페이드 인 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 페이드 아웃 */
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 슬라이드 업 */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 슬라이드 다운 */
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 스케일 인 */
@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 회전 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 펄스 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 글로우 펄스 */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 5px var(--color-primary-accent);
  }
  50% {
    box-shadow: 0 0 20px var(--color-primary-accent), 0 0 30px var(--color-primary-accent);
  }
}

/* 시머 (로딩 효과) */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 바운스 */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

/* 흔들림 */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}

/* 타이핑 효과 */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  0%, 50% {
    border-color: transparent;
  }
  51%, 100% {
    border-color: var(--color-primary-accent);
  }
}

/* === 애니메이션 클래스 === */

.animate-fadeIn {
  animation: fadeIn var(--duration-normal) var(--easing-ease-out);
}

.animate-fadeOut {
  animation: fadeOut var(--duration-normal) var(--easing-ease-out);
}

.animate-slideUp {
  animation: slideUp var(--duration-normal) var(--easing-ease-out);
}

.animate-slideDown {
  animation: slideDown var(--duration-normal) var(--easing-ease-out);
}

.animate-scaleIn {
  animation: scaleIn var(--duration-normal) var(--easing-ease-out);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-glowPulse {
  animation: glowPulse 2s ease-in-out infinite;
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-border) 25%,
    var(--color-text-muted) 50%,
    var(--color-border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* === 전환 효과 === */

.transition-all {
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.transition-colors {
  transition: color var(--duration-normal) var(--easing-ease-out),
              background-color var(--duration-normal) var(--easing-ease-out),
              border-color var(--duration-normal) var(--easing-ease-out);
}

.transition-transform {
  transition: transform var(--duration-normal) var(--easing-ease-out);
}

.transition-opacity {
  transition: opacity var(--duration-normal) var(--easing-ease-out);
}

/* === 지연 시간 === */

.delay-0 { animation-delay: 0ms; }
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }
.delay-700 { animation-delay: 700ms; }
.delay-1000 { animation-delay: 1000ms; }

/* === 지속 시간 === */

.duration-fast { animation-duration: var(--duration-fast); }
.duration-normal { animation-duration: var(--duration-normal); }
.duration-slow { animation-duration: var(--duration-slow); }
.duration-slower { animation-duration: var(--duration-slower); }

/* === 호버 효과 === */

.hover-glow:hover {
  box-shadow: var(--shadow-glow);
  transition: box-shadow var(--duration-normal) var(--easing-ease-out);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-normal) var(--easing-ease-out);
}

.hover-scale:hover {
  transform: scale(1.05);
  transition: transform var(--duration-normal) var(--easing-ease-out);
}

/* === 로딩 상태 === */

.loading-skeleton {
  background: linear-gradient(
    90deg,
    var(--color-secondary-bg) 25%,
    var(--color-tertiary-bg) 50%,
    var(--color-secondary-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% {
    color: rgba(0, 0, 0, 0);
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0),
                 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  40% {
    color: var(--color-text);
    text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0),
                 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  60% {
    text-shadow: 0.25em 0 0 var(--color-text),
                 0.5em 0 0 rgba(0, 0, 0, 0);
  }
  80%, 100% {
    text-shadow: 0.25em 0 0 var(--color-text),
                 0.5em 0 0 var(--color-text);
  }
}

/* === 접근성 고려 === */

/* 모션 감소 설정을 선호하는 사용자를 위한 처리 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .animate-spin {
    animation: none;
  }
  
  .animate-pulse {
    animation: none;
  }
  
  .animate-bounce {
    animation: none;
  }
}
```

## 5. 반응형 디자인

### 5.1. responsive.css

```css
/**
 * 반응형 디자인 유틸리티
 */

/* === 미디어 쿼리 브레이크포인트 === */

/* 모바일 우선 접근법 */

/* Extra Small devices (phones, 576px and down) */
@media (max-width: 575.98px) {
  .container {
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }
  
  /* 텍스트 크기 조정 */
  h1 { font-size: var(--font-size-2xl); }
  h2 { font-size: var(--font-size-xl); }
  h3 { font-size: var(--font-size-lg); }
  
  /* 간격 조정 */
  .spacing-responsive {
    padding: var(--spacing-2);
    margin-bottom: var(--spacing-3);
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
  
  /* 태블릿용 레이아웃 */
  .grid-md-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-6);
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
  
  /* 데스크탑용 레이아웃 */
  .grid-lg-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-8);
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

/* XXL devices (larger desktops, 1400px and up) */
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}

/* === 디스플레이 유틸리티 (반응형) === */

/* 모바일에서 숨김 */
@media (max-width: 767.98px) {
  .d-none-mobile { display: none !important; }
}

/* 태블릿에서 숨김 */
@media (min-width: 768px) and (max-width: 991.98px) {
  .d-none-tablet { display: none !important; }
}

/* 데스크탑에서 숨김 */
@media (min-width: 992px) {
  .d-none-desktop { display: none !important; }
}

/* 모바일에서만 표시 */
@media (min-width: 768px) {
  .d-mobile-only { display: none !important; }
}

/* 태블릿에서만 표시 */
@media (max-width: 767.98px), (min-width: 992px) {
  .d-tablet-only { display: none !important; }
}

/* 데스크탑에서만 표시 */
@media (max-width: 991.98px) {
  .d-desktop-only { display: none !important; }
}

/* === 레이아웃 유틸리티 === */

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

.container-fluid {
  width: 100%;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

/* 그리드 시스템 */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: calc(var(--spacing-3) * -1);
  margin-right: calc(var(--spacing-3) * -1);
}

.col {
  flex: 1;
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-3);
}

/* === 플렉스 유틸리티 === */

.flex-mobile-column {
  @media (max-width: 767.98px) {
    flex-direction: column !important;
  }
}

.flex-tablet-row {
  @media (min-width: 768px) {
    flex-direction: row !important;
  }
}

/* === 간격 유틸리티 (반응형) === */

@media (max-width: 767.98px) {
  .p-mobile-2 { padding: var(--spacing-2) !important; }
  .p-mobile-3 { padding: var(--spacing-3) !important; }
  .p-mobile-4 { padding: var(--spacing-4) !important; }
  
  .m-mobile-2 { margin: var(--spacing-2) !important; }
  .m-mobile-3 { margin: var(--spacing-3) !important; }
  .m-mobile-4 { margin: var(--spacing-4) !important; }
}

@media (min-width: 768px) {
  .p-tablet-4 { padding: var(--spacing-4) !important; }
  .p-tablet-6 { padding: var(--spacing-6) !important; }
  .p-tablet-8 { padding: var(--spacing-8) !important; }
  
  .m-tablet-4 { margin: var(--spacing-4) !important; }
  .m-tablet-6 { margin: var(--spacing-6) !important; }
  .m-tablet-8 { margin: var(--spacing-8) !important; }
}

/* === 타이포그래피 (반응형) === */

.responsive-text {
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .responsive-text {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 992px) {
  .responsive-text {
    font-size: var(--font-size-lg);
  }
}

/* === 터치 인터페이스 최적화 === */

@media (hover: none) and (pointer: coarse) {
  /* 터치 디바이스에서 호버 효과 제거 */
  .btn:hover {
    transform: none;
  }
  
  /* 터치 타겟 최소 크기 보장 */
  .btn,
  .form-control,
  .checkbox,
  .toggle {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* 터치 친화적 간격 */
  .touch-friendly {
    padding: var(--spacing-4);
    margin: var(--spacing-2);
  }
}
```

## 6. 구현 체크리스트

### 6.1. 기본 설정
- [ ] CSS 변수 (variables.css) 구현
- [ ] 기본 스타일 (base.css) 구현
- [ ] 타이포그래피 (typography.css) 구현
- [ ] 애니메이션 (animations.css) 구현

### 6.2. 컴포넌트 스타일
- [ ] 버튼 스타일 구현
- [ ] 입력 필드 스타일 구현
- [ ] 카드/패널 스타일 구현
- [ ] 네비게이션 스타일 구현

### 6.3. 반응형 디자인
- [ ] 미디어 쿼리 설정
- [ ] 그리드 시스템 구현
- [ ] 터치 인터페이스 최적화
- [ ] 접근성 고려사항 구현

### 6.4. 테마 시스템
- [ ] 다크/라이트 테마 토글
- [ ] 색상 커스터마이제이션
- [ ] 사용자 설정 저장

## 7. 다음 단계

스타일링 구현이 완료되면 다음 문서로 진행하세요:

1. **07_Testing_Setup_Guide.md** - 테스팅 환경 설정
2. **08_Deployment_Guide.md** - 배포 가이드

## 8. 스타일 디버깅 팁

### 8.1. 개발자 도구 활용
- CSS 변수 검사 및 실시간 수정
- 애니메이션 디버깅
- 반응형 테스트

### 8.2. 성능 최적화
- CSS 번들 크기 모니터링
- 사용하지 않는 스타일 제거
- 크리티컬 CSS 인라인화

### 8.3. 브라우저 호환성
- Autoprefixer 설정 확인
- 기능 감지 (@supports) 활용
- 폴백 스타일 제공
