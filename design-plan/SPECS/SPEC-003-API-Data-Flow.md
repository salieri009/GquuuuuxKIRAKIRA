# SPEC-003: API and Data Flow

## Overview
Data structures, effect loading system, and service layer specifications.

---

## 1. Effect Data Model

### 1.1 Effect Definition

```typescript
interface Effect {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  relatedGundam: string[];
  defaultParams: Record<string, EffectParam>;
}
```

### 1.2 Effect Parameter

```typescript
interface EffectParam {
  type: 'slider' | 'color' | 'toggle' | 'select';
  value: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}
```

### 1.3 Effect Module

```typescript
interface EffectModule {
  id: string;
  init: (scene: THREE.Scene, params: Record<string, any>) => void;
  update: (delta: number, params: Record<string, any>) => void;
  dispose: () => void;
  getDefaultParams?: () => Record<string, EffectParam>;
}
```

---

## 2. Static Data (effects.json)

```json
[
  {
    "id": "gn-particles",
    "name": "GN Particles",
    "description": "GN Drive particle effect from Gundam 00",
    "thumbnail": "https://example.com/gn-thumb.jpg",
    "relatedGundam": ["Gundam Exia", "Gundam 00"],
    "defaultParams": {
      "count": { "type": "slider", "value": 1000, "min": 100, "max": 3000, "step": 100 },
      "speed": { "type": "slider", "value": 0.5, "min": 0.1, "max": 2.0, "step": 0.1 },
      "color": { "type": "color", "value": "#00FF88" },
      "size": { "type": "slider", "value": 0.02, "min": 0.01, "max": 0.1, "step": 0.01 }
    }
  }
]
```

---

## 3. Effect Service

### 3.1 Service Interface

```typescript
class EffectService {
  static basePath: string;
  
  static setBasePath(path: string): void;
  static getEffects(): Promise<Effect[]>;
  static getEffect(id: string): Promise<Effect>;
  static loadEffectModule(id: string): Promise<EffectModule>;
}
```

### 3.2 Implementation

```typescript
class EffectService {
  private static basePath = '/effects';
  private static effectCache: Map<string, EffectModule> = new Map();
  
  static setBasePath(path: string): void {
    this.basePath = path;
  }
  
  static async getEffects(): Promise<Effect[]> {
    const response = await fetch('/data/effects.json');
    return response.json();
  }
  
  static async loadEffectModule(id: string): Promise<EffectModule> {
    if (this.effectCache.has(id)) {
      return this.effectCache.get(id)!;
    }
    
    const module = await import(`${this.basePath}/${id}.js`);
    this.effectCache.set(id, module.default);
    return module.default;
  }
}
```

---

## 4. State Management Flow

### 4.1 Action Types

```typescript
type UIAction =
  | { type: 'SET_EFFECTS'; payload: Effect[] }
  | { type: 'SELECT_EFFECT'; payload: string }
  | { type: 'UPDATE_PARAM'; payload: { key: string; value: any } }
  | { type: 'RESET_PARAMS' }
  | { type: 'TOGGLE_LIBRARY' }
  | { type: 'TOGGLE_CONTROLS' }
  | { type: 'TOGGLE_INFO_PANEL' }
  | { type: 'TOGGLE_HELP_PANEL' }
  | { type: 'SET_MOBILE'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };
```

### 4.2 Reducer

```typescript
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SELECT_EFFECT':
      return {
        ...state,
        selectedEffect: action.payload,
        effectParams: getDefaultParams(action.payload)
      };
    
    case 'UPDATE_PARAM':
      return {
        ...state,
        effectParams: {
          ...state.effectParams,
          [action.payload.key]: {
            ...state.effectParams[action.payload.key],
            value: action.payload.value
          }
        }
      };
    
    // ... other cases
  }
}
```

---

## 5. Data Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                       │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    COMPONENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │EffectLibrary│  │EffectCanvas │  │EffectControls│     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌────────────────────────────────────────────────────────────┐
│                    CONTEXT LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     UIContext                         │  │
│  │   state: { selectedEffect, effectParams, ... }       │  │
│  │   dispatch: (action) => void                         │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   EffectService                       │  │
│  │   getEffects() → Effect[]                            │  │
│  │   loadEffectModule(id) → EffectModule                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────────────────────────┐   │
│  │ effects.json │  │ /effects/*.js (dynamic modules) │   │
│  └──────────────┘  └──────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## 6. Effect Loading Sequence

```
1. App Mount
   └─ useEffectLoader hook
       └─ EffectService.getEffects()
           └─ Fetch effects.json
               └─ Parse and store in state

2. User Selects Effect
   └─ dispatch({ type: 'SELECT_EFFECT', payload: id })
       └─ State update triggers EffectCanvas re-render
           └─ EffectService.loadEffectModule(id)
               └─ Dynamic import effect module
                   └─ module.init(scene, params)
                       └─ Start animation loop

3. User Changes Parameter
   └─ dispatch({ type: 'UPDATE_PARAM', payload: { key, value } })
       └─ EffectCanvas receives new params via context
           └─ module.update(delta, newParams)
```

---

## 7. Preset System

### 7.1 Preset Data Model

```typescript
interface Preset {
  id: string;
  name: string;
  effectId: string;
  params: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

### 7.2 Storage

Presets are stored in localStorage:

```typescript
const STORAGE_KEY = 'kirakira-presets';

function savePreset(preset: Preset): void {
  const presets = getPresets();
  presets.push(preset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

function getPresets(): Preset[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}
```

---

## 8. Error Handling

### 8.1 Service Errors

```typescript
class EffectLoadError extends Error {
  constructor(effectId: string, cause?: Error) {
    super(`Failed to load effect: ${effectId}`);
    this.name = 'EffectLoadError';
    this.cause = cause;
  }
}

class EffectNotFoundError extends Error {
  constructor(effectId: string) {
    super(`Effect not found: ${effectId}`);
    this.name = 'EffectNotFoundError';
  }
}
```

### 8.2 Recovery Strategy

| Error Type | Recovery Action |
|------------|-----------------|
| Network Error | Show retry button, use cached data |
| Module Error | Load fallback effect, show toast |
| Parameter Error | Reset to defaults, log warning |
