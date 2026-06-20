# Effect Development Documentation

Index for Three.js effect module guides in Kirakira.

## Guides

| Document | Description |
|----------|-------------|
| [STANDALONE_DEVELOPMENT.md](./STANDALONE_DEVELOPMENT.md) | Develop and preview effects outside the main app |
| [LOOSE_COUPLING_ARCHITECTURE.md](./LOOSE_COUPLING_ARCHITECTURE.md) | Effect module contract and loader architecture |
| [COUPLING_ANALYSIS.md](./COUPLING_ANALYSIS.md) | Dependency and coupling analysis |

## Module layout

```ts
// apps/web/src/effects/examples/gn-particles/index.ts
export { default } from './effect';

// effect.ts — class + bindEffectModule, catalog metadata 없음
import { bindEffectModule } from '../../shared/bindEffectModule';

class GNParticleEffect implements EffectModule { /* init / update / dispose */ }

export default bindEffectModule(new GNParticleEffect());
```

- **Dispose**: GPU 리소스는 `safeDisposeEffectRoot` 사용 (`apps/web/src/effects/shared/particleUtils.ts`)
- **Module cache**: `EffectService`만 캐시 — `EffectLoader.loadEffect`는 stateless, `EffectModule` 직접 반환 (`importDefaultFromPaths` + `normalizeEffectModule` 검증)
- **Load order**: `@effects/examples/<catalog-id>/index.ts` 우선, 이후 `basePath` fallback; default export 없으면 다음 경로 시도
- **Runtime contract**: `init` / `update` / `dispose` 만 허용 (`EFFECT_LIFECYCLE_METHODS`, `animate` alias 없음)

## Source Code

- Effect modules: `apps/web/src/effects/examples/<catalog-id>/` (`index.ts` + `effect.ts`)
- Catalog metadata: `packages/catalog/effects.json` only (no `export const metadata` in modules)
- Effect loader: `apps/web/src/effects/loader.ts`
- Shared runtime helpers: `apps/web/src/effects/shared/`
- CLI: `apps/web/scripts/create-effect.ts`, `validate-effect.ts`, `dev-effect.ts`

## Commands

```bash
npm run create-effect --workspace=@kirakira/web -- <effect-name>
npm run validate-effect --workspace=@kirakira/web -- src/effects/examples/gn-particles
npm run dev:effect --workspace=@kirakira/web -- src/effects/examples/gn-particles/effect.ts
```
