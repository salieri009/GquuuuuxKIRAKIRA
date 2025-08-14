# 09. 테스트 & 품질 가드 (QA)

## 1. 린트/포맷

- ESLint + @vue/eslint-config-prettier + Prettier
- 커밋 전 훅: lint-staged + husky (`.vue`, `.js`, `.json`, `.css`)

## 2. 타입 안정성 (선택)

- TypeScript 도입 시 `vue-tsc`로 타입 체크

## 3. 유닛 테스트

- Vitest 또는 Jest (Vue Test Utils)
- 대상: stores(pinia), services(api), utils

## 4. E2E 테스트 (선택)

- Cypress: 주요 사용자 플로우(효과 선택, 파라미터 변경, 정보 패널 토글)

## 5. 성능/품질 자동 점검

- Lighthouse CI (선택) 또는 수동 리포트
- Webpack Bundle Analyzer로 번들 사이즈 모니터링

## 6. 최소 체크리스트 (PR 기준)

- [ ] 빌드 성공 (production)
- [ ] ESLint/Prettier 통과
- [ ] 유닛 테스트 통과 (필수 로직)
- [ ] 번들 사이즈 리그레션 없음
- [ ] 접근성 기본 기준 통과
