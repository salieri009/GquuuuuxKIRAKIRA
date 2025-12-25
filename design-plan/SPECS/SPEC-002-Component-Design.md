# SPEC-002: Component Design

## Overview
Detailed component specifications with props, events, and implementation patterns.

---

## 1. Component Categories

| Category | Path | Purpose |
|----------|------|---------|
| Common | `components/common/` | Shared, reusable components |
| Effects | `components/effects/` | Effect-specific UI |
| Layout | `components/layout/` | Page structure |
| UI | `components/ui/` | Base UI primitives |

---

## 2. Core Components

### 2.1 EffectCanvas

Three.js rendering container and manager.

```typescript
interface EffectCanvasProps {
  effectId?: string;
  params?: Record<string, any>;
  onReady?: () => void;
  onError?: (error: Error) => void;
}
```

**Responsibilities:**
- Initialize Three.js scene, camera, renderer
- Load and manage effect modules
- Handle window resize
- Provide orbital camera controls
- Manage animation loop

**Key Methods:**
```typescript
// Internal methods
initScene(): void;
loadEffect(effectId: string): Promise<void>;
updateParams(params: Record<string, any>): void;
animate(): void;
dispose(): void;
```

---

### 2.2 EffectLibrary

Sidebar component for effect selection.

```typescript
interface EffectLibraryProps {
  effects: Effect[];
  selectedId?: string;
  onSelect: (effectId: string) => void;
  onClose?: () => void;  // Mobile only
}
```

**Child Components:**
- `EffectCard` - Individual effect display
- Search/filter input
- Category tabs (optional)

---

### 2.3 EffectControls

Parameter control panel.

```typescript
interface EffectControlsProps {
  params: Record<string, EffectParam>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
  onSave?: () => void;
}
```

**Renders dynamically based on param type:**

| Param Type | Control Component |
|------------|------------------|
| `slider` | RangeSlider |
| `color` | ColorPicker |
| `toggle` | Switch |
| `select` | Dropdown |

---

### 2.4 InfoPanel

Effect information side panel.

```typescript
interface InfoPanelProps {
  effect: Effect | null;
  isOpen: boolean;
  onClose: () => void;
}
```

**Displays:**
- Effect name and description
- Related Gundam series
- Technical specifications
- Lore/background information

---

### 2.5 Header

Main navigation header.

```typescript
interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
}
```

---

## 3. UI Primitives

### 3.1 NeonButton

```typescript
interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}
```

### 3.2 NeonSlider

```typescript
interface NeonSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  onChange: (value: number) => void;
}
```

### 3.3 GlassPanel

```typescript
interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}
```

### 3.4 Toast

```typescript
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onDismiss: (id: string) => void;
}
```

---

## 4. Context Providers

### 4.1 UIProvider

```typescript
interface UIContextValue {
  state: UIState;
  dispatch: Dispatch<UIAction>;
  
  // Convenience methods
  selectEffect: (id: string) => void;
  updateParam: (key: string, value: any) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  toggleLibrary: () => void;
  toggleControls: () => void;
}
```

---

## 5. Custom Hooks

### 5.1 useEffectLoader

```typescript
function useEffectLoader(): {
  loading: boolean;
  error: Error | null;
  effects: Effect[];
  loadEffect: (id: string) => Promise<EffectModule>;
};
```

### 5.2 useResponsive

```typescript
function useResponsive(): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};
```

### 5.3 useThree

```typescript
function useThree(): {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
};
```

---

## 6. Error Handling

### 6.1 ErrorBoundary

Catches React rendering errors and displays fallback UI.

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

### 6.2 Error States

| Scenario | User Feedback |
|----------|---------------|
| Effect load failure | Toast + default scene |
| WebGL not supported | Full-page error message |
| Network error | Retry button + error toast |
| Invalid parameters | Reset to defaults + warning |

---

## 7. Performance Optimizations

### 7.1 Memoization

```typescript
// Memoize expensive computations
const memoizedControls = useMemo(() => 
  generateControls(params), [params]
);

// Memoize callbacks
const handleParamChange = useCallback((key, value) => {
  dispatch({ type: 'UPDATE_PARAM', payload: { key, value } });
}, [dispatch]);

// Memoize components
const EffectCard = memo(({ effect, selected, onSelect }) => {
  // ...
});
```

### 7.2 Lazy Loading

```typescript
// Lazy load panels
const InfoPanel = lazy(() => import('./InfoPanel'));
const HelpPanel = lazy(() => import('./HelpPanel'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <InfoPanel />
</Suspense>
```
