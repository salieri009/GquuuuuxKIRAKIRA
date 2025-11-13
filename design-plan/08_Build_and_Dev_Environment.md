# 08. 빌드 & 개발 환경 (Webpack + Vue3)

## 1. 의존성

- vue@3, vue-router@4, pinia, three
- webpack, webpack-cli, webpack-dev-server
- vue-loader, @vue/compiler-sfc
- css-loader, style-loader, postcss, postcss-loader, autoprefixer (또는 sass-loader + sass)
- file-loader 또는 asset modules (이미지/폰트)
- babel-loader (필요 시)

## 2. 스크립트 (package.json)

- `dev`: webpack-dev-server (HMR, historyApiFallback)
- `build`: webpack --mode production
- `preview`: 간단 정적 서버로 `dist` 서빙 (예: serve)

## 3. Webpack 구성 스케치

- `entry`: `src/main.js`
- `output`: `dist/[name].[contenthash].js`
- `resolve.alias`: `{ '@': path.resolve(__dirname, 'src') }`
- `module.rules`:
  - `vue-loader` (SFC)
  - `babel-loader` (optional)
  - `css-loader` + `style-loader` (+ `postcss-loader`)
  - `asset/resource` (images/fonts)
- `plugins`:
  - `VueLoaderPlugin`
  - `HtmlWebpackPlugin` (템플릿: `index.html`)
  - `DefinePlugin` (`process.env.NODE_ENV`)
- `devServer`:
  - `hot: true`
  - `historyApiFallback: true`
  - `static: public`

## 4. 경로 별칭 및 import 규칙

- `@` → `src`
- Three.js와 효과 모듈은 지연 로딩 가능 (`import()`)

## 5. 코드 스플리팅 정책

- 페이지/모듈 단위의 dynamic import로 초기 번들 크기 최소화
- 효과 모듈(`src/effects/*.effect.js`)은 on-demand 로드

## 6. 브라우저 지원

- 현대 브라우저 최신 2버전
- 필요 시 Babel preset-env 적용
