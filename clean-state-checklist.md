# Clean State Checklist — Kirakira

Run before ending every agent session.

## Build & Verify

- [ ] `npm run dev` — web app starts without errors
- [ ] `npm run verify` — passes from repository root (type-check, lint, tests, builds)

## Harness Files

- [ ] `claude-progress.md` — Session Record added with verification output
- [ ] `feature_list.json` — statuses match reality; no false `passing`
- [ ] Only one feature marked `in_progress` (or zero if session complete)
- [ ] `evidence` field filled for any feature marked `passing` this session

## Codebase Health

- [ ] No half-finished work left unrecorded in progress log
- [ ] `apps/web/src/contexts/` — should be absent
- [ ] No debug-only changes left in committed paths
- [ ] `ARCHITECTURE.md` updated if package boundaries changed this session

## Handoff

- [ ] Next session can continue from `claude-progress.md` without manual explanation
- [ ] `session-handoff.md` updated if session was long or crosses phases
