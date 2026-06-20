# Kirakira — Agent Instructions

Interactive 3D Gundam Effects Viewer. Read this file at the start of every session before writing code.

**Architecture overview:** [ARCHITECTURE.md](ARCHITECTURE.md)

## Coding style (Ponytail)

Minimal/YAGNI agent rules from [ponytail](https://github.com/DietrichGebert/ponytail) are enabled via `.cursor/rules/`. Kirakira monorepo boundaries in `.cursor/rules/kirakira-monorepo.mdc` override ponytail when they conflict. See [docs/agents/PONYTAIL.md](docs/agents/PONYTAIL.md).

Cursor commands: `/ponytail-review` (diff), `/ponytail-audit` (repo).

## Session Start Workflow

1. Read `claude-progress.md` — Current Verified State
2. Read `feature_list.json` — pick highest-priority unfinished item
3. Read `quality-document.md` — weakest domains
4. Run verification: `.\init.ps1` or `./init.sh`

## Session End Workflow

1. Run `clean-state-checklist.md` — confirm verify passes
2. Update `claude-progress.md` — add Session Record with verification output
3. Update `feature_list.json` — set status + evidence for completed work
4. Long sessions: fill `session-handoff.md`
5. Milestones: score session in `evaluator-rubric.md`

## Harness Files

| File | Purpose |
|------|---------|
| [claude-progress.md](claude-progress.md) | Progress log — read first each session |
| [feature_list.json](feature_list.json) | Feature tracker with verification steps |
| [session-handoff.md](session-handoff.md) | Concise handoff between sessions |
| [clean-state-checklist.md](clean-state-checklist.md) | Pre-close checklist |
| [evaluator-rubric.md](evaluator-rubric.md) | Session quality scorecard |
| [quality-document.md](quality-document.md) | Codebase health snapshot |

## Monorepo Layout

| Package | Path | Purpose |
|---------|------|---------|
| `@kirakira/contracts` | `packages/contracts/` | Shared DTOs (Effect, ApiResponse) |
| `@kirakira/catalog` | `packages/catalog/` | `effects.json` catalog |
| `@kirakira/effect-sdk` | `packages/effect-sdk/` | Three.js runtime contract (EffectModule) |
| `@kirakira/web` | `apps/web/` | React + Vite SPA |
| `@kirakira/api` | `apps/api/` | Express REST API |

## Commands (from repository root)

```bash
npm install              # all workspaces
npm run dev              # web → http://localhost:5173
npm run dev:api          # api → http://localhost:3001
npm run verify           # full CI-equivalent check
```

Web-only (from `apps/web/`):

```bash
npm run lint
npm run test -- --run
npm run type-check
npm run build
```

## Architecture Rules

- **Catalog data** lives in `packages/catalog/effects.json` only
- **Shared types** in `@kirakira/contracts` — no duplicate DTOs in api/web
- **Effect runtime contract** in `@kirakira/effect-sdk` — `EffectModule` (Three.js init/update/dispose)
- **Effect modules** live in `apps/web/src/effects/examples/<catalog-id>/` — `index.ts` (thin export) + `effect.ts` (implementation). **No `export const metadata`** — catalog DTO only in `packages/catalog/effects.json`
- **Catalog DTO** in `@kirakira/contracts` — `Effect`, `EffectParameter` (not to be confused with `EffectModule`)
- **UI state**: `useUIStore` | **Effect state**: `useEffectStore` (Zustand only)
- **Web fetches catalog** via `/api/effects` (Vite proxies to API in dev), falls back to `@kirakira/catalog`
- One `in_progress` feature in `feature_list.json` at a time

## Reference Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Monorepo boundaries & data flow |
| [design-plan/SPECS/SPEC-001-System-Architecture.md](design-plan/SPECS/SPEC-001-System-Architecture.md) | Component hierarchy |
| [docs/effects/LOOSE_COUPLING_ARCHITECTURE.md](docs/effects/LOOSE_COUPLING_ARCHITECTURE.md) | Effect module contract |

## Definition of Done

1. `npm run verify` passes from repo root
2. Evidence in `feature_list.json`
3. Session record in `claude-progress.md`
4. `ARCHITECTURE.md` updated if boundaries changed

## Prohibited

- Duplicate `Effect` / `ApiResponse` types outside `@kirakira/contracts`
- Reading `effects.json` from `apps/web/src/data/` (use `@kirakira/catalog`)
- React Context for global state
- Multiple `in_progress` features
