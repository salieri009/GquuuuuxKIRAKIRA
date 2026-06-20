# updateBuffer 크래시 — Baseline (2026-06-19)

## 증상

```
three.module.js:148 Uncaught TypeError: Cannot read properties of undefined (reading 'length')
```

WebGL `updateBuffer`가 `BufferAttribute.array`가 `undefined`인 geometry를 업로드할 때 발생.

## 재현 매트릭스

| 시나리오 | GN | Minovsky | Trans-Am | GQuuuuuuX | Psyco | Newtype |
|----------|----|----------|----------|-----------|-------|---------|
| 앱 최초 진입 (auto-select) | 발생 | 발생 | 발생 | 발생 | 발생 | 발생 |
| A→B 단일 전환 | 발생 | 발생 | 발생 | 발생 | 발생 | 발생 |
| 6개 연속 빠른 전환 | 발생 | 발생 | 발생 | 발생 | 발생 | 발생 |

**사용자 확인**: 첫 로드 + 전환 **모두** 발생.

## 의심 원인 (우선순위)

1. **동기 GPU dispose** — `detachAndDispose`가 scene 제거 직후 같은 tick에 `geometry.dispose()` 호출. `useFrame`이 `needsUpdate=true` 설정 후 WebGL render 전에 dispose되면 크래시.
2. **hostRef 마운트 레이스** — `useLayoutEffect([effectId])`만 의존 시 `hostRef.current === null`이면 load skip, effectId 불변 시 재시도 없음.
3. **swap 펜싱 부재** — dispose 중에도 `useFrame` update가 geometry를 mutate.
4. **비입자 effect** — `psycoField`, `newtypeFlash`에 `isGeometryLive` 가드 없음.

## 프레임 타이밍 (추정)

```
useFrame (priority -1000) SceneGuard prune
useFrame (priority 0)      effect update → needsUpdate=true
[async microtask]        dispose() → geometry.dispose()  ← 크래시 지점
WebGL render               updateBuffer → array.length 💥
```

## 수정 방향

- `safeDisposeEffectRoot` — detach 즉시, GPU dispose는 double-rAF 지연
- `swappingRef` — swap 구간 update skip
- `hostReady` callback ref — 첫 로드 보장
- `commitEffectLoad` — stale async abort 일원화
- 6개 effect dispose/update 가드 통일

## DEV 진단

`import.meta.env.DEV`에서 [`effectCanvasDiagnostics.ts`](../../apps/web/src/effects/shared/effectCanvasDiagnostics.ts) 로깅 활성화.
