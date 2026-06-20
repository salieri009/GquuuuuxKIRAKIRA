# Evaluator Rubric — Kirakira

Score each dimension 0–2 after a session or milestone. Total 12 = maximum.

## Dimensions

### 1. Correctness (0–2)

| Score | Criteria |
|-------|----------|
| 0 | Implementation does not match feature goal or breaks existing behavior |
| 1 | Partially correct; known bugs or regressions remain |
| 2 | Matches `user_visible_behavior` in feature_list; no regressions in verified paths |

**Kirakira-specific:** Effect modules use `@kirakira/effect-sdk` contract (init/update/dispose); API routes covered by supertest; UI state via Zustand stores.

### 2. Verification (0–2)

| Score | Criteria |
|-------|----------|
| 0 | No tests or checks run; evidence empty |
| 1 | Some checks run but incomplete or evidence vague |
| 2 | Full standard path run (`npm run verify`); evidence recorded in feature_list.json |

### 3. Scope Discipline (0–2)

| Score | Criteria |
|-------|----------|
| 0 | Multiple features touched; unrelated refactors |
| 1 | Mostly scoped; minor scope creep |
| 2 | Single feature_list item; minimal focused diff |

### 4. Reliability (0–2)

| Score | Criteria |
|-------|----------|
| 0 | Changes break on restart or second run |
| 1 | Works once; flaky or environment-dependent |
| 2 | Reproducible after clean `npm install` and verify path |

### 5. Maintainability (0–2)

| Score | Criteria |
|-------|----------|
| 0 | Unclear code; docs contradict implementation |
| 1 | Code OK but docs stale |
| 2 | Code follows project conventions; docs updated when needed |

### 6. Handoff Readiness (0–2)

| Score | Criteria |
|-------|----------|
| 0 | Next session cannot continue without human context |
| 1 | Progress log partial; ambiguous next step |
| 2 | claude-progress.md + feature_list enable cold-start continuation |

## Conclusion

| Total | Decision |
|-------|----------|
| 10–12 | **Accept** |
| 6–9 | **Revise** |
| 0–5 | **Block** |

## Calibration Notes

Agents tend to self-approve. Compare scores against human judgment for 3–5 sprints and tighten criteria where scores diverge.

Record calibration changes here:

| Date | Change | Effect |
|------|--------|--------|
| 2026-06-19 | Initial rubric created for Kirakira harness | baseline |
| 2026-06-19 | Added api supertest + effect-sdk to Kirakira-specific criteria | aligns with arch milestones |
