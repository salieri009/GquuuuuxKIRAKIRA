# 01. 개발환경 설정 가이드

## 1. 프로젝트 초기화

### 1.1. 기본 의존성 설치

```bash
# 프로젝트 폴더 생성 및 초기화
mkdir kirakira
cd kirakira
npm init -y

# 핵심 의존성 설치
npm install vue@^3.3.0 vue-router@^4.2.0 pinia@^2.1.0 three@^0.154.0

# 빌드 도구
npm install --save-dev webpack@^5.88.0 webpack-cli@^5.1.0 webpack-dev-server@^4.15.0

# Vue 관련 빌드 도구
npm install --save-dev vue-loader@^17.2.0 @vue/compiler-sfc@^3.3.0

# CSS 관련
npm install --save-dev css-loader@^6.8.0 style-loader@^3.3.0 postcss@^8.4.0 postcss-loader@^7.3.0 autoprefixer@^10.4.0

# HTML 플러그인
npm install --save-dev html-webpack-plugin@^5.5.0

# 기타 유틸리티
npm install --save-dev serve@^14.2.0
```

### 1.2. package.json 스크립트 설정

```json
{
  "name": "kirakira",
  "version": "1.0.0",
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "preview": "serve dist -s"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "three": "^0.154.0"
  },
  "devDependencies": {
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0",
    "vue-loader": "^17.2.0",
    "@vue/compiler-sfc": "^3.3.0",
    "css-loader": "^6.8.0",
    "style-loader": "^3.3.0",
    "postcss": "^8.4.0",
    "postcss-loader": "^7.3.0",
    "autoprefixer": "^10.4.0",
    "html-webpack-plugin": "^5.5.0",
    "serve": "^14.2.0"
  }
}
```

## 2. Webpack 설정

### 2.1. webpack.config.js

```javascript
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  entry: './src/main.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json']
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      title: 'Kirakira - Gundam Effects'
    }),
    new DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],

  devServer: {
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 8080,
    host: 'localhost'
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### 2.2. PostCSS 설정 (postcss.config.js)

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
};
```

## 3. 프로젝트 구조 생성

### 3.1. 폴더 구조 생성 스크립트

```bash
# 프로젝트 루트에서 실행
mkdir -p src/{assets,components/{layout,effects,library,common,ui},constants,effects,layouts,mock,router,services,store,styles,types,utils,views}
mkdir -p public
touch index.html
```

### 3.2. 필수 파일 생성

#### index.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kirakira - Gundam Effects</title>
  <meta name="description" content="건담 시리즈 시각 효과를 Three.js로 구현한 인터랙티브 웹사이트">
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

#### src/main.js
```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// 전역 스타일 import
import './styles/variables.css';
import './styles/base.css';
import './styles/typography.css';

const app = createApp(App);

// 전역 에러 핸들러
app.config.errorHandler = (err, instance, info) => {
  console.error('전역 에러:', err);
  console.error('에러 정보:', info);
  // TODO: 추후 APM 연동 시 에러 리포팅
};

app.use(createPinia());
app.use(router);
app.mount('#app');
```

#### src/App.vue
```vue
<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}
</style>
```

## 4. 개발 환경 검증

### 4.1. 개발 서버 실행 테스트

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:8080 접속하여 확인
```

### 4.2. 빌드 테스트

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run preview
```

## 5. 환경 설정 체크리스트

- [ ] Node.js 16+ 설치 확인
- [ ] npm 의존성 설치 완료
- [ ] Webpack 설정 파일 작성
- [ ] 프로젝트 폴더 구조 생성
- [ ] 기본 Vue 앱 구조 생성
- [ ] 개발 서버 정상 실행 확인
- [ ] 빌드 프로세스 정상 동작 확인
- [ ] Hot Module Replacement (HMR) 동작 확인

## 6. 다음 단계

환경 설정이 완료되면 다음 문서들을 순서대로 진행하세요:

1. **02_Component_Implementation_Guide.md** - 핵심 컴포넌트 구현
2. **03_State_Management_Guide.md** - Pinia 스토어 구현
3. **04_3D_Effect_System_Guide.md** - Three.js 효과 시스템 구현

## 7. 트러블슈팅

### 7.1. 일반적인 문제들

#### Webpack 빌드 오류
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

#### Vue SFC 컴파일 오류
- `@vue/compiler-sfc` 버전이 Vue 버전과 호환되는지 확인
- `vue-loader` 설정이 올바른지 확인

#### 경로 별칭 인식 안됨
- `webpack.config.js`의 `resolve.alias` 설정 확인
- VSCode 사용 시 `jsconfig.json` 추가 고려

#### 개발 서버 접속 불가
- 포트 충돌 확인 (기본 8080)
- 방화벽 설정 확인
- `webpack-dev-server` 설정의 `host`와 `port` 확인
