# 디렉토리 구조 리뷰

**리뷰 일자**: 2026년  
**리뷰어**: 30년차 Software Engineer  
**프로젝트**: Kirakira - Interactive 3D Gundam Effects Viewer

---

## 📋 전체 구조 개요

```
GundamKiraKIra/                    # npm workspaces 모노레포
├── packages/
│   ├── contracts/                 # @kirakira/contracts — 공유 DTO
│   ├── catalog/                   # @kirakira/catalog — effects.json
│   └── effect-sdk/                # @kirakira/effect-sdk — Three.js 런타임 계약
├── apps/
│   ├── web/                       # @kirakira/web — React + Vite SPA
│   │   ├── scripts/               # 효과 개발 도구 (TypeScript)
│   │   └── src/                   # 웹 앱 소스
│   └── api/                       # @kirakira/api — Express REST API
├── docs/                          # 프로젝트 문서
├── design-plan/                   # 제품·디자인 스펙
├── package.json                   # 루트 워크스페이스 스크립트
└── ARCHITECTURE.md                # 패키지 경계·의존성 규칙
```

---

## ✅ 잘 구성된 부분

### 1. **명확한 계층 구조** (`apps/web/src`)

```
apps/web/src/
├── components/          # UI 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── effects/        # 효과 관련 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── ui/             # 기본 UI 컴포넌트
├── hooks/              # Custom Hooks
├── services/           # 비즈니스 로직 서비스 (EffectService, apiClient)
├── store/              # 상태 관리 (Zustand: useUIStore, useEffectStore)
├── utils/              # 유틸리티 함수
├── effects/            # Three.js 효과 로더·예제 (계약은 @kirakira/effect-sdk)
└── types/              # 프론트 전용 타입 (@kirakira/contracts 재export)
```

**평가**: ✅ **우수**
- 관심사의 분리가 명확함
- Zustand 단일 경로 (React Context 제거됨)
- 공유 타입·카탈로그는 `packages/`로 분리

### 2. **공유 패키지 구조** (`packages/`)

```
packages/
├── contracts/src/       # Effect, ApiResponse 등 DTO
├── catalog/
│   └── effects.json     # 카탈로그 단일 소스
└── effect-sdk/src/      # EffectModule, BaseEffect (Three.js 런타임 계약)
```

**평가**: ✅ **우수**
- API·웹·외부 효과 개발자가 동일 계약 공유
- `effect-sdk`와 `contracts` 역할 분리 (런타임 vs 카탈로그 DTO)
- 카탈로그 데이터 중복 없음

### 3. **효과 모듈 구조** (`apps/web/src/effects`)

```
apps/web/src/effects/
├── examples/                    # catalog-id 디렉터리 (gn-particles/, …)
│   ├── gn-particles/
│   │   ├── index.ts             # thin export { init, update, dispose }
│   │   └── effect.ts            # 구현 (metadata export 없음)
│   └── template.ts              # 레거시 단일 파일 템플릿
├── shared/                      # particleUtils, effectLifecycle, diagnostics
├── effectLifecycle.ts
├── loader.ts                    # @effects/examples/<catalog-id>/index.ts 우선
├── types-standalone.d.ts
└── README.md
```

**평가**: ✅ **우수**
- 런타임 타입은 `@kirakira/effect-sdk`에 위임
- 로더·예제만 웹 앱에 유지
- 확장 가능한 플러그인 구조

### 4. **테스트 구조**

```
apps/web/src/
├── utils/
│   ├── validation.ts
│   └── validation.test.ts    # 같은 디렉토리
├── services/
│   ├── effectService.ts
│   └── effectService.test.ts
└── test/
    └── setup.ts               # 공통 설정
```

**평가**: ✅ **우수**
- 테스트 파일이 소스 파일과 같은 위치 (Colocation)
- 테스트 설정이 중앙화됨
- 유지보수가 쉬움

### 5. **스크립트 구조**

```
apps/web/scripts/
├── create-effect.ts     # 효과 생성 도구
├── validate-effect.ts   # 효과 검증 도구
└── dev-effect.ts        # 개발 서버
```

**평가**: ✅ **우수**
- 개발자 경험 향상
- 자동화 도구 제공
- 명확한 네이밍

---

## ⚠️ 개선 권장 사항

### 1. **문서 위치 통합**

**현재 상태**:
- `docs/effects/` - 상세 개발 가이드
- `apps/web/src/effects/README.md` - 간단한 설명

**권장 사항**: ✅ **현재 구조 유지**
- 소스 코드 내부의 README는 간단한 설명만
- 상세 문서는 `docs/` 디렉토리에 통합
- 이미 잘 구성되어 있음

### 2. **타입 정의 위치**

**현재 상태**:
```
packages/
├── contracts/src/     # 카탈로그 DTO (Effect, EffectParameter)
└── effect-sdk/src/    # 런타임 계약 (EffectModule, EffectObjects)

apps/web/src/
└── types/index.ts     # 프론트 전용 타입, contracts 재export
```

**평가**: ✅ **적절함**
- 런타임 계약과 카탈로그 DTO가 패키지로 분리됨
- `apps/web`에 중복 DTO 없음

### 3. **스타일 파일 구조**

**현재 상태**:
```
apps/web/src/styles/
├── variables.css       # CSS 변수
├── base.css            # 기본 스타일
├── typography.css      # 타이포그래피
└── components.css      # 컴포넌트 스타일
```

**평가**: ✅ **우수**
- 관심사별로 분리
- 재사용 가능한 구조
- Tailwind CSS와 잘 통합

### 4. **Context vs Store** — ✅ Resolved (2026-06-19)

State management unified to **Zustand** (`useUIStore`, `useEffectStore`). The `contexts/` directory has been removed.

---

## 🎯 디렉토리별 상세 평가

### `components/` - ⭐⭐⭐⭐⭐ (5/5)

**구조**:
```
apps/web/src/components/
├── common/        # 공통 컴포넌트 (ErrorBoundary, HelpPanel 등)
├── effects/       # 효과 관련 컴포넌트
├── layout/        # 레이아웃 컴포넌트
└── ui/            # 기본 UI 컴포넌트
```

**평가**:
- ✅ 명확한 카테고리 분리
- ✅ 재사용 가능한 구조
- ✅ 관심사 분리 우수

**개선 제안**: 없음 (현재 구조가 이상적)

### `services/` - ⭐⭐⭐⭐⭐ (5/5)

**구조**:
```
apps/web/src/services/
├── effectService.ts
└── effectService.test.ts
```

**평가**:
- ✅ 비즈니스 로직이 서비스 레이어로 분리
- ✅ 테스트 가능한 구조
- ✅ 의존성 주입 가능

**개선 제안**: 없음

### `store/` - ⭐⭐⭐⭐⭐ (5/5)

**구조**:
```
apps/web/src/store/
├── effectStore.ts
└── uiStore.ts
```

**평가**:
- ✅ Zustand 사용으로 간결함
- ✅ 타입 안정성 확보
- ✅ Context 제거, 단일 상태 경로

**개선 제안**: 없음

### `utils/` - ⭐⭐⭐⭐⭐ (5/5)

**구조**:
```
apps/web/src/utils/
├── errorHandler.ts
├── errorHandler.test.ts
├── validation.ts
├── validation.test.ts
├── networkStatus.ts
└── index.ts
```

**평가**:
- ✅ 유틸리티가 잘 분리됨
- ✅ 테스트 커버리지 우수
- ✅ 재사용 가능한 구조

**개선 제안**: 없음

### `effects/` - ⭐⭐⭐⭐⭐ (5/5)

**구조**:
```
apps/web/src/effects/
├── examples/              # <catalog-id>/index.ts + effect.ts
├── shared/                # dispose·diagnostics 공유
├── effectLifecycle.ts
├── loader.ts
├── types-standalone.d.ts
└── README.md

packages/effect-sdk/       # EffectModule (공유)
packages/catalog/          # effects.json — 유일한 카탈로그 메타데이터
```

**평가**:
- ✅ 모듈화가 우수
- ✅ 런타임 계약이 effect-sdk로 분리
- ✅ 확장 가능한 플러그인 구조

**개선 제안**: 없음

---

## 📊 종합 평가

| 항목 | 점수 | 평가 |
|------|------|------|
| **구조 명확성** | 9/10 | ⭐⭐⭐⭐⭐ |
| **확장성** | 9/10 | ⭐⭐⭐⭐⭐ |
| **유지보수성** | 9/10 | ⭐⭐⭐⭐⭐ |
| **테스트 가능성** | 10/10 | ⭐⭐⭐⭐⭐ |
| **개발자 경험** | 9/10 | ⭐⭐⭐⭐⭐ |

**전체 평균**: **9.2/10** ⭐⭐⭐⭐⭐

---

## 🎯 최종 권장 사항

### 즉시 개선 (High Priority)

1. ~~**Context와 Store 통합**~~ — ✅ 완료 (Zustand 단일 경로)

### 단기 개선 (Medium Priority)

2. **문서 통합**
   - 모든 개발 가이드를 `docs/` 디렉토리로 통합
   - 소스 코드 내부 README는 최소한만 유지

### 장기 개선 (Low Priority)

3. **모니터링 및 로깅**
   - 에러 리포팅 서비스 통합
   - 성능 모니터링 강화

---

## ✅ 결론

**전반적으로 매우 우수한 디렉토리 구조입니다.**

- ✅ 관심사의 분리가 명확함
- ✅ 확장 가능한 구조
- ✅ 테스트 가능한 설계
- ✅ 개발자 경험이 좋음

**특히 인상적인 부분**:
1. `packages/` + `apps/` 모노레포 경계
2. `@kirakira/effect-sdk` 런타임 계약 분리
3. 테스트 파일의 Colocation
4. 스크립트 도구의 자동화

**30년차 엔지니어 관점에서**: 이 구조는 **프로덕션 레벨의 품질**을 갖추고 있으며, 패키지 의존성으로 경계가 강제됩니다. 소규모 팀부터 대규모 팀까지 적용 가능한 구조입니다.

---

**리뷰 완료일**: 2026년  
**다음 리뷰 예정**: 주요 아키텍처 변경 후
