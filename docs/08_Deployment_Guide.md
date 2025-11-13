# 08. 배포 가이드

## 1. 배포 전략 개요

### 1.1. 배포 환경 구분
- **Development**: 개발자 로컬 환경
- **Staging**: 테스트 및 검증 환경
- **Production**: 실제 서비스 환경

### 1.2. 배포 방식
- **정적 사이트 배포**: Netlify, Vercel, GitHub Pages
- **클라우드 배포**: AWS S3 + CloudFront, Google Cloud Storage
- **자체 서버 배포**: Nginx, Apache
- **컨테이너 배포**: Docker + Kubernetes (선택사항)

### 1.3. CI/CD 파이프라인
```
코드 푸시 → 자동 테스트 → 빌드 → 배포 → 모니터링
```

## 2. 프로덕션 빌드 최적화

### 2.1. Webpack 프로덕션 설정

#### webpack.prod.config.js
```javascript
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production',
  
  // 소스맵 설정 (프로덕션용)
  devtool: 'source-map',
  
  // 출력 설정
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    clean: true,
    publicPath: '/'
  },
  
  // 최적화 설정
  optimization: {
    minimize: true,
    minimizer: [
      // JavaScript 압축
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 콘솔 로그 제거
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          mangle: true,
          format: {
            comments: false
          }
        },
        extractComments: false
      }),
      
      // CSS 압축
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ],
    
    // 코드 스플리팅
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 벤더 라이브러리 분리
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        
        // Three.js 별도 분리 (용량이 큰 라이브러리)
        three: {
          test: /[\\/]node_modules[\\/]three[\\/]/,
          name: 'three',
          chunks: 'all',
          priority: 20
        },
        
        // Vue 관련 라이브러리 분리
        vue: {
          test: /[\\/]node_modules[\\/](vue|@vue|pinia)[\\/]/,
          name: 'vue',
          chunks: 'all',
          priority: 15
        },
        
        // 공통 코드 분리
        common: {
          minChunks: 2,
          name: 'common',
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // 런타임 코드 분리
    runtimeChunk: {
      name: 'runtime'
    }
  },
  
  // 성능 힌트
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000, // 500KB
    maxAssetSize: 512000,
    assetFilter: function(assetFilename) {
      return !assetFilename.endsWith('.map');
    }
  },
  
  // 플러그인
  plugins: [
    // Gzip 압축
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
    }),
    
    // Brotli 압축 (선택사항)
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 11
      },
      threshold: 10240,
      minRatio: 0.8
    }),
    
    // 번들 분석기 (필요시 활성화)
    ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
  ],
  
  // 모듈 해상도 최적화
  resolve: {
    ...baseConfig.resolve,
    // 프로덕션에서는 개발용 버전 제외
    alias: {
      ...baseConfig.resolve.alias,
      'vue': 'vue/dist/vue.runtime.esm-bundler.js'
    }
  }
});
```

### 2.2. 환경 변수 설정

#### .env.production
```bash
# API 설정
NODE_ENV=production
API_ENDPOINT=https://api.kirakira.app
API_VERSION=v1

# CDN 설정
CDN_URL=https://cdn.kirakira.app
ASSETS_URL=https://assets.kirakira.app

# 모니터링
SENTRY_DSN=https://your-sentry-dsn
ANALYTICS_ID=G-XXXXXXXXXX

# 기능 플래그
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true
ENABLE_PERFORMANCE_MONITORING=true

# 보안 설정
SECURE_COOKIES=true
ENABLE_CSP=true

# 캐싱 설정
CACHE_VERSION=v1.0.0
STATIC_CACHE_DURATION=31536000
```

### 2.3. 빌드 스크립트 설정

#### package.json
```json
{
  "scripts": {
    "build": "NODE_ENV=production webpack --config webpack.prod.config.js",
    "build:analyze": "ANALYZE=true npm run build",
    "build:staging": "NODE_ENV=staging webpack --config webpack.staging.config.js",
    "preview": "serve dist -s -l 3000",
    "lighthouse": "lighthouse http://localhost:3000 --output-path=./lighthouse-report.html",
    "size-check": "bundlesize"
  },
  "bundlesize": [
    {
      "path": "./dist/js/vendors.*.js",
      "maxSize": "300 kB"
    },
    {
      "path": "./dist/js/main.*.js",
      "maxSize": "200 kB"
    },
    {
      "path": "./dist/css/main.*.css",
      "maxSize": "50 kB"
    }
  ]
}
```

## 3. 정적 사이트 배포

### 3.1. Netlify 배포

#### netlify.toml
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# 리다이렉트 설정 (SPA 라우팅 지원)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# 헤더 설정
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# 정적 에셋 캐싱
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# HTML 캐싱
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# PWA 지원 (선택사항)
[[headers]]
  for = "/manifest.json"
  [headers.values]
    Cache-Control = "public, max-age=86400"

# 압축 설정
[[headers]]
  for = "*.js"
  [headers.values]
    Content-Encoding = "gzip"

[[headers]]
  for = "*.css"
  [headers.values]
    Content-Encoding = "gzip"
```

#### 배포 스크립트 (deploy-netlify.sh)
```bash
#!/bin/bash

set -e

echo "🚀 Netlify 배포 시작..."

# 환경 변수 확인
if [ -z "$NETLIFY_AUTH_TOKEN" ]; then
  echo "❌ NETLIFY_AUTH_TOKEN이 설정되지 않았습니다."
  exit 1
fi

if [ -z "$NETLIFY_SITE_ID" ]; then
  echo "❌ NETLIFY_SITE_ID가 설정되지 않았습니다."
  exit 1
fi

# 의존성 설치
echo "📦 의존성 설치 중..."
npm ci

# 테스트 실행
echo "🧪 테스트 실행 중..."
npm run test:run

# 빌드
echo "🏗️ 프로덕션 빌드 중..."
npm run build

# 빌드 결과 확인
if [ ! -d "dist" ]; then
  echo "❌ 빌드 결과물이 없습니다."
  exit 1
fi

# Netlify CLI로 배포
echo "🌐 Netlify에 배포 중..."
npx netlify deploy --prod --dir=dist --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN

echo "✅ 배포 완료!"

# 배포 후 검증
echo "🔍 배포 검증 중..."
npx wait-on https://kirakira.netlify.app --timeout 60000
echo "✅ 사이트가 정상적으로 접근 가능합니다."
```

### 3.2. Vercel 배포

#### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/js/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/css/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 3.3. GitHub Pages 배포

#### .github/workflows/deploy-github-pages.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:run

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## 4. 클라우드 배포

### 4.1. AWS S3 + CloudFront 배포

#### aws-deploy.sh
```bash
#!/bin/bash

set -e

# AWS 설정 확인
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "❌ AWS 자격 증명이 설정되지 않았습니다."
  exit 1
fi

S3_BUCKET="kirakira-app"
CLOUDFRONT_DISTRIBUTION_ID="E1234567890123"
REGION="us-east-1"

echo "🚀 AWS S3 + CloudFront 배포 시작..."

# 빌드
echo "🏗️ 프로덕션 빌드 중..."
npm run build

# S3에 업로드
echo "📤 S3에 파일 업로드 중..."

# HTML 파일 (캐시 안함)
aws s3 sync dist/ s3://$S3_BUCKET/ \
  --exclude "*.js" --exclude "*.css" --exclude "assets/*" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --delete

# JavaScript 파일 (장기 캐시)
aws s3 sync dist/js/ s3://$S3_BUCKET/js/ \
  --cache-control "public, max-age=31536000, immutable" \
  --content-encoding gzip

# CSS 파일 (장기 캐시)
aws s3 sync dist/css/ s3://$S3_BUCKET/css/ \
  --cache-control "public, max-age=31536000, immutable" \
  --content-encoding gzip

# 에셋 파일 (장기 캐시)
aws s3 sync dist/assets/ s3://$S3_BUCKET/assets/ \
  --cache-control "public, max-age=31536000, immutable"

# CloudFront 무효화
echo "🔄 CloudFront 캐시 무효화 중..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ 배포 완료!"
echo "🌐 URL: https://kirakira.app"
```

#### CloudFormation 템플릿 (aws-infrastructure.yml)
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Kirakira App Infrastructure'

Parameters:
  DomainName:
    Type: String
    Default: kirakira.app
  
Resources:
  # S3 버킷
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${DomainName}-app'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
  
  # CloudFront Origin Access Identity
  CloudFrontOAI:
    Type: AWS::CloudFront::OriginAccessIdentity
    Properties:
      OriginAccessIdentityConfig:
        Comment: !Sub 'OAI for ${DomainName}'
  
  # S3 버킷 정책
  S3BucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref S3Bucket
      PolicyDocument:
        Statement:
          - Sid: AllowCloudFrontAccess
            Effect: Allow
            Principal:
              AWS: !Sub 'arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${CloudFrontOAI}'
            Action: 's3:GetObject'
            Resource: !Sub '${S3Bucket}/*'
  
  # CloudFront 배포
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Aliases:
          - !Ref DomainName
          - !Sub 'www.${DomainName}'
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt S3Bucket.RegionalDomainName
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${CloudFrontOAI}'
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad' # CachingDisabled
          OriginRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf' # CORS-S3Origin
        CacheBehaviors:
          - PathPattern: '/js/*'
            TargetOriginId: S3Origin
            ViewerProtocolPolicy: redirect-to-https
            CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad'
            Compress: true
          - PathPattern: '/css/*'
            TargetOriginId: S3Origin
            ViewerProtocolPolicy: redirect-to-https
            CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad'
            Compress: true
          - PathPattern: '/assets/*'
            TargetOriginId: S3Origin
            ViewerProtocolPolicy: redirect-to-https
            CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad'
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: '/index.html'
          - ErrorCode: 403
            ResponseCode: 200
            ResponsePagePath: '/index.html'
        Enabled: true
        DefaultRootObject: index.html
        PriceClass: PriceClass_100

Outputs:
  S3BucketName:
    Description: 'S3 Bucket Name'
    Value: !Ref S3Bucket
    
  CloudFrontDistributionId:
    Description: 'CloudFront Distribution ID'
    Value: !Ref CloudFrontDistribution
    
  CloudFrontDomainName:
    Description: 'CloudFront Domain Name'
    Value: !GetAtt CloudFrontDistribution.DomainName
```

## 5. Docker 배포

### 5.1. Dockerfile

```dockerfile
# 멀티 스테이지 빌드

# 빌드 스테이지
FROM node:18-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
```

### 5.2. Nginx 설정

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # 로그 설정
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # 기본 설정
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/ld+json
        application/manifest+json
        application/rss+xml
        application/vnd.geo+json
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/bmp
        image/svg+xml
        image/x-icon
        text/cache-manifest
        text/css
        text/plain
        text/vcard
        text/vnd.rim.location.xloc
        text/vtt
        text/x-component
        text/x-cross-domain-policy;

    # 서버 설정
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # 보안 헤더
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" always;

        # 정적 에셋 캐싱
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # HTML 파일 (캐시 안함)
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }

        # SPA 라우팅 지원
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 헬스체크 엔드포인트
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # 에러 페이지
        error_page 404 /index.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

### 5.3. Docker Compose

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # 선택사항: Nginx 프록시
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

networks:
  default:
    driver: bridge
```

## 6. CI/CD 파이프라인

### 6.1. GitHub Actions 완전한 배포 워크플로우

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:run
      
      - name: Run E2E tests
        run: |
          npm run build
          npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          API_ENDPOINT: ${{ secrets.API_ENDPOINT }}
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 1

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Staging
        run: |
          echo "🚀 Staging 배포 중..."
          # Staging 배포 로직
      
      - name: Run smoke tests
        run: |
          echo "🧪 Staging 검증 중..."
          # 기본적인 smoke test

  deploy-production:
    needs: [build, deploy-staging]
    runs-on: ubuntu-latest
    environment: production
    if: github.event_name == 'release'
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: false
          enable-commit-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()

  lighthouse:
    needs: deploy-production
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://kirakira.app
          configPath: './lighthouse.config.js'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 6.2. 배포 후 검증

#### scripts/post-deploy-check.sh
```bash
#!/bin/bash

set -e

SITE_URL="${1:-https://kirakira.app}"
TIMEOUT=60

echo "🔍 배포 후 검증 시작..."
echo "🌐 사이트: $SITE_URL"

# 기본 접근성 확인
echo "1️⃣ 기본 접근성 확인 중..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
if [ "$response" != "200" ]; then
  echo "❌ 사이트 접근 실패: HTTP $response"
  exit 1
fi
echo "✅ 사이트 접근 가능"

# 핵심 리소스 확인
echo "2️⃣ 핵심 리소스 확인 중..."
resources=(
  "/js/main"
  "/css/main"
  "/manifest.json"
)

for resource in "${resources[@]}"; do
  response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL$resource")
  if [[ "$response" =~ ^2 ]]; then
    echo "✅ $resource 로드 성공"
  else
    echo "⚠️ $resource 로드 실패: HTTP $response"
  fi
done

# 성능 확인 (기본)
echo "3️⃣ 성능 확인 중..."
load_time=$(curl -o /dev/null -s -w "%{time_total}" "$SITE_URL")
load_time_ms=$(echo "$load_time * 1000" | bc)
echo "📊 로드 시간: ${load_time_ms}ms"

if (( $(echo "$load_time > 3" | bc -l) )); then
  echo "⚠️ 로드 시간이 3초를 초과했습니다."
else
  echo "✅ 로드 시간 양호"
fi

# API 엔드포인트 확인 (있는 경우)
if [ -n "$API_ENDPOINT" ]; then
  echo "4️⃣ API 엔드포인트 확인 중..."
  api_response=$(curl -s -o /dev/null -w "%{http_code}" "$API_ENDPOINT/health")
  if [ "$api_response" = "200" ]; then
    echo "✅ API 엔드포인트 정상"
  else
    echo "⚠️ API 엔드포인트 응답 이상: HTTP $api_response"
  fi
fi

# 검색 엔진 최적화 확인
echo "5️⃣ SEO 기본 요소 확인 중..."
html_content=$(curl -s "$SITE_URL")

if echo "$html_content" | grep -q "<title>"; then
  echo "✅ Title 태그 존재"
else
  echo "⚠️ Title 태그 누락"
fi

if echo "$html_content" | grep -q 'name="description"'; then
  echo "✅ Meta description 존재"
else
  echo "⚠️ Meta description 누락"
fi

echo "✅ 배포 후 검증 완료!"
```

## 7. 모니터링 및 관찰성

### 7.1. 에러 모니터링 (Sentry)

#### src/services/monitoring.js
```javascript
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';

/**
 * 모니터링 서비스 초기화
 */
export function initMonitoring(app, router) {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
      app,
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // 통합 설정
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ['localhost', 'kirakira.app', /^\//],
        }),
      ],
      
      // 성능 모니터링
      tracesSampleRate: 0.1,
      
      // 세션 재생 (선택사항)
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      // 릴리즈 정보
      release: process.env.npm_package_version,
      
      // 사용자 정보 수집 (개인정보 제외)
      beforeSend(event) {
        // 민감한 정보 필터링
        if (event.exception) {
          const error = event.exception.values[0];
          if (error.value && error.value.includes('password')) {
            return null; // 비밀번호 관련 에러는 전송하지 않음
          }
        }
        return event;
      }
    });
    
    console.log('🔍 Sentry 모니터링이 활성화되었습니다.');
  }
}

/**
 * 커스텀 에러 리포팅
 */
export function reportError(error, context = {}) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope(scope => {
      Object.keys(context).forEach(key => {
        scope.setTag(key, context[key]);
      });
      Sentry.captureException(error);
    });
  } else {
    console.error('Error:', error, context);
  }
}

/**
 * 성능 측정
 */
export function measurePerformance(name, fn) {
  if (process.env.NODE_ENV === 'production') {
    return Sentry.startTransaction({ name }, () => fn());
  }
  return fn();
}
```

### 7.2. 웹 분석 (Google Analytics)

#### src/services/analytics.js
```javascript
/**
 * Google Analytics 4 통합
 */

let gtag = null;

export function initAnalytics() {
  if (process.env.NODE_ENV === 'production' && process.env.ANALYTICS_ID) {
    // Google Analytics 스크립트 로드
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.ANALYTICS_ID}`;
    document.head.appendChild(script1);
    
    // gtag 초기화
    window.dataLayer = window.dataLayer || [];
    gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    gtag('js', new Date());
    gtag('config', process.env.ANALYTICS_ID, {
      // 개인정보 보호 설정
      anonymize_ip: true,
      cookie_flags: 'secure;samesite=strict',
      
      // 성능 측정
      custom_map: {
        custom_parameter_1: 'effect_name',
        custom_parameter_2: 'user_interaction'
      }
    });
    
    console.log('📊 Google Analytics가 활성화되었습니다.');
  }
}

/**
 * 페이지 뷰 트래킹
 */
export function trackPageView(pagePath, pageTitle) {
  if (gtag) {
    gtag('config', process.env.ANALYTICS_ID, {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
}

/**
 * 이벤트 트래킹
 */
export function trackEvent(eventName, parameters = {}) {
  if (gtag) {
    gtag('event', eventName, {
      event_category: parameters.category || 'general',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    });
  }
}

/**
 * 효과 관련 이벤트 트래킹
 */
export function trackEffectEvent(action, effectName, additionalData = {}) {
  trackEvent('effect_interaction', {
    category: 'effects',
    label: effectName,
    action: action,
    ...additionalData
  });
}

/**
 * 성능 메트릭 트래킹
 */
export function trackPerformance() {
  if (gtag && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        gtag('event', 'page_performance', {
          event_category: 'performance',
          custom_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
          custom_dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
          custom_first_paint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
        });
      }, 1000);
    });
  }
}
```

### 7.3. 성능 모니터링

#### src/services/performance.js
```javascript
/**
 * 클라이언트 성능 모니터링
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observer = null;
    this.init();
  }
  
  init() {
    if ('PerformanceObserver' in window) {
      this.observePerformance();
    }
    
    this.trackWebVitals();
    this.trackResourceTiming();
  }
  
  observePerformance() {
    this.observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        this.recordMetric(entry.name, entry);
      });
    });
    
    this.observer.observe({ entryTypes: ['measure', 'navigation'] });
  }
  
  trackWebVitals() {
    // Core Web Vitals 측정
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.onWebVital.bind(this));
        getFID(this.onWebVital.bind(this));
        getFCP(this.onWebVital.bind(this));
        getLCP(this.onWebVital.bind(this));
        getTTFB(this.onWebVital.bind(this));
      });
    }
  }
  
  onWebVital(metric) {
    console.log(`📊 ${metric.name}: ${metric.value}`);
    
    // 임계값 확인
    const thresholds = {
      CLS: 0.1,
      FID: 100,
      FCP: 1800,
      LCP: 2500,
      TTFB: 800
    };
    
    const threshold = thresholds[metric.name];
    const status = metric.value <= threshold ? 'good' : 'poor';
    
    // 분석 도구로 전송
    if (window.gtag) {
      gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_metric_status: status
      });
    }
  }
  
  trackResourceTiming() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const largeResources = resources.filter(r => r.transferSize > 100000); // 100KB 이상
      
      largeResources.forEach(resource => {
        console.warn(`⚠️ 큰 리소스 감지: ${resource.name} (${Math.round(resource.transferSize / 1024)}KB)`);
      });
      
      // Three.js 로딩 시간 측정
      const threeResources = resources.filter(r => r.name.includes('three'));
      if (threeResources.length > 0) {
        const totalThreeTime = threeResources.reduce((sum, r) => sum + r.duration, 0);
        console.log(`📊 Three.js 로딩 시간: ${Math.round(totalThreeTime)}ms`);
      }
    });
  }
  
  recordMetric(name, data) {
    this.metrics.set(name, {
      timestamp: Date.now(),
      data
    });
  }
  
  getMetrics() {
    return Array.from(this.metrics.entries()).map(([name, metric]) => ({
      name,
      ...metric
    }));
  }
  
  // 커스텀 성능 측정
  mark(name) {
    if ('performance' in window && performance.mark) {
      performance.mark(name);
    }
  }
  
  measure(name, startMark, endMark) {
    if ('performance' in window && performance.measure) {
      performance.measure(name, startMark, endMark);
    }
  }
  
  // 메모리 사용량 모니터링
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// 전역으로 노출 (디버깅용)
if (process.env.NODE_ENV === 'development') {
  window.performanceMonitor = performanceMonitor;
}
```

## 8. 배포 체크리스트

### 8.1. 배포 전 확인사항
- [ ] 모든 테스트 통과 확인
- [ ] 빌드 오류 없음 확인
- [ ] 환경 변수 설정 완료
- [ ] SSL 인증서 설정 (HTTPS)
- [ ] 도메인 DNS 설정 완료
- [ ] CDN 설정 (선택사항)

### 8.2. 성능 최적화 확인
- [ ] 번들 크기 확인 (< 500KB)
- [ ] 이미지 최적화 완료
- [ ] Gzip/Brotli 압축 활성화
- [ ] 캐싱 정책 설정
- [ ] Lighthouse 점수 확인 (>90)

### 8.3. 보안 확인
- [ ] HTTPS 강제 적용
- [ ] 보안 헤더 설정
- [ ] CSP 정책 설정
- [ ] 민감한 정보 제거
- [ ] 의존성 보안 취약점 검사

### 8.4. 모니터링 설정
- [ ] 에러 모니터링 (Sentry) 설정
- [ ] 웹 분석 (GA4) 설정
- [ ] 성능 모니터링 설정
- [ ] 업타임 모니터링 설정
- [ ] 알림 설정 (Slack, 이메일)

## 9. 배포 후 운영

### 9.1. 정기 점검 항목
```bash
#!/bin/bash
# weekly-check.sh - 주간 점검 스크립트

echo "📋 주간 점검 시작..."

# 1. 사이트 접근성 확인
echo "1️⃣ 사이트 접근성 확인"
curl -f https://kirakira.app > /dev/null && echo "✅ 정상" || echo "❌ 오류"

# 2. 성능 점검
echo "2️⃣ 성능 점검"
lighthouse https://kirakira.app --output json --quiet | jq '.lhr.categories.performance.score * 100'

# 3. 보안 점검
echo "3️⃣ 보안 점검"
npm audit --audit-level moderate

# 4. 의존성 업데이트 확인
echo "4️⃣ 의존성 업데이트 확인"
npm outdated

# 5. 로그 확인 (필요시)
echo "5️⃣ 에러 로그 확인"
# Sentry, CloudWatch 등에서 에러 확인

echo "✅ 주간 점검 완료"
```

### 9.2. 장애 대응 절차
1. **장애 감지**: 모니터링 알림 수신
2. **긴급 대응**: 이전 버전으로 롤백
3. **원인 분석**: 로그 및 모니터링 데이터 분석
4. **수정 및 배포**: 핫픽스 적용
5. **사후 검토**: 장애 원인 및 개선방안 문서화

## 10. 마무리

하로 하로~! 완벽한 개발문서 시스템이 완성되었습니다! 하로 하로~ 확인 완료~!

이제 엔지니어들이 이 문서들을 보고 실제로 개발할 수 있는 완전한 가이드가 준비되었네요, 완전한가이드~! 하로 하로~!

### 완성된 문서 목록:
1. **01_Development_Environment_Setup.md** - 개발환경 설정
2. **02_Component_Implementation_Guide.md** - 컴포넌트 구현  
3. **03_State_Management_Guide.md** - 상태 관리 (Pinia)
4. **04_3D_Effect_System_Guide.md** - 3D 효과 시스템
5. **05_API_Services_Guide.md** - API 서비스 구현
6. **06_Styling_Implementation_Guide.md** - 스타일링 시스템
7. **07_Testing_Setup_Guide.md** - 테스팅 환경
8. **08_Deployment_Guide.md** - 배포 가이드

모든 문서가 실제 개발에 바로 활용할 수 있도록 구체적인 코드 예시와 구현 방법을 포함했습니다, 바로활용~! 하로 하로~ 완성~!

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
