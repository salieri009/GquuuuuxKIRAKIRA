# 11. 개발 로드맵 (Milestones)

## M1. 프로젝트 셋업 (Webpack + Vue)
- 패키지 설치, Webpack 기본 설정, 경로 별칭, devServer, HtmlWebpackPlugin
- 라우터/Pinia 초기 구성, 전역 스타일 베이스

## M2. 데이터 & 스토어
- `mock/effects.json` 작성, `services/api.js` 구현
- `effectStore`, `uiStore` 구현 및 Home 연결

## M3. 3D 캔버스 베이스
- `EffectCanvas.vue` 기본 Scene/Camera/Renderer/OrbitControls
- 리사이즈/픽셀 레이쇼 처리, 애니메이션 루프

## M4. 라이브러리/컨트롤/정보 패널
- `EffectList`, `EffectControls`, `InfoPanel` 구현
- 상태와 상호작용 연결, 빈/로딩/에러 상태 UI

## M5. 효과 모듈 1차
- `gnParticles.effect.js` 등 1~2개 핵심 모듈 구현
- 동적 import/해제(dispose) 플로우 완성

## M6. 품질 가드
- ESLint/Prettier/husky, 단위 테스트 기본 세트
- 번들 분석, 성능 기본 최적화

## M7. 접근성/반응형
- 키보드 내비게이션, 대비/모션 설정, 모바일 레이아웃 조정

## M8. 배포 준비
- 프로덕션 빌드, 정적 서버 리허설, 캐시 전략 검토
