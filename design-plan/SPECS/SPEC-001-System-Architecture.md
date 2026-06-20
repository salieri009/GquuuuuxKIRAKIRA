# SPEC-001: System Architecture

## Overview
Technical architecture specification for the Kirakira Gundam Effects project.

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Build Tool | Vite | 7.x |
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| 3D Rendering | Three.js | 0.158+ |
| Animation | Framer Motion | 10.x |
| State Management | Zustand | 4.x |
| Styling | Tailwind CSS + CSS Variables | 3.x |
| Testing | Vitest | 3.x |

---

## 2. Project Structure

See [ARCHITECTURE.md](../../ARCHITECTURE.md) for the full monorepo map.

```
kirakira/
├── packages/
│   ├── contracts/     @kirakira/contracts   Shared DTOs
│   └── catalog/       @kirakira/catalog     effects.json
├── apps/
│   ├── web/           @kirakira/web         React + Vite SPA
│   └── api/           @kirakira/api         Express REST API
```

### Web app (`apps/web/src/`)

```
apps/web/src/
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Entry point
│   ├── vite-env.d.ts          # Vite type declarations
│   │
│   ├── components/            # UI Components
│   │   ├── common/            # Shared components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── HelpPanel.tsx
│   │   │   ├── InfoPanel.tsx
│   │   │   └── PresetManager.tsx
│   │   ├── effects/           # Effect-specific components
│   │   │   ├── EffectCanvas.tsx
│   │   │   ├── EffectControls.tsx
│   │   │   └── EffectLibrary.tsx
│   │   ├── layout/            # Layout components
│   │   │   └── Header.tsx
│   │   └── ui/                # Base UI components
│   │       ├── PerformanceMonitor.tsx
│   │       └── ToastContainer.tsx
│   │
│   ├── store/                 # Zustand state management
│   │   ├── effectStore.ts     # Effect selection, params, loading
│   │   └── uiStore.ts         # UI panels, theme, toasts, modals
│   │
│   ├── data/                  # Static data
│   │   └── effects.json
│   │
│   ├── effects/               # Three.js effect modules
│   │   ├── loader.ts          # Effect dynamic loader
│   │   ├── types.ts           # Effect type definitions
│   │   ├── base/              # Base effect classes
│   │   └── examples/          # Example effects
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useEffectLoader.ts
│   │   └── useResponsive.ts
│   │
│   ├── services/              # API and external services
│   │   └── effectService.ts
│   │
│   ├── styles/                # Global styles
│   │   ├── base.css
│   │   ├── components.css
│   │   ├── typography.css
│   │   └── variables.css
│   │
│   ├── types/                 # TypeScript type definitions
│   │
│   └── utils/                 # Utility functions
│
├── public/                    # Static assets
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 3. Component Architecture

### 3.1 Component Hierarchy

```
App
└── AppContent
    ├── initializeUI() / cleanupUI() via useUIStore (on mount)
    ├── ErrorBoundary
    │   ├── Header
    │   ├── InfoPanel
    │   ├── HelpPanel
    │   ├── PresetManager
    │   ├── ToastContainer
    │   └── Main
    │       ├── EffectLibrary (Sidebar)
    │       └── Content Area
    │           ├── EffectCanvas
    │           └── EffectControls
    └── PerformanceMonitor (DEV only)
```

### 3.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `App` | Root component; calls `useUIStore.initializeUI()` on mount |
| `useUIStore` | Global UI state (panels, theme, toasts, modals) |
| `useEffectStore` | Effect catalog, selection, parameters, load status |
| `Header` | Navigation, branding |
| `EffectLibrary` | Effect selection list |
| `EffectCanvas` | Three.js renderer wrapper |
| `EffectControls` | Parameter adjustment UI |
| `InfoPanel` | Effect information display |

---

## 4. State Management

State is managed with **Zustand** stores. Do not use React Context for application state.

### 4.1 UI Store (`useUIStore`)

```typescript
interface UIState {
  isInfoPanelVisible: boolean;
  isLibraryVisible: boolean;
  isControlsVisible: boolean;
  isFullscreen: boolean;
  isMobile: boolean;
  theme: 'dark' | 'light' | 'high-contrast';
  prefersReducedMotion: boolean;
  glowEffects: boolean;
  backgroundParticles: boolean;
}
```

Key actions: `toggleInfoPanel`, `toggleLibrary`, `toggleControls`, `closeAllPanels`, `detectMobile`, `initializeUI`, `cleanupUI`, `showToast`, `openModal`.

### 4.2 Effect Store (`useEffectStore`)

Manages effect catalog loading, selected effect, current parameters, and load progress/error state.

Key actions: `fetchEffects`, `selectEffect`, `updateParam`, `resetParams`.

---

## 5. Effect System

### 5.1 Effect Module Interface

```typescript
interface EffectModule {
  id: string;
  name: string;
  description: string;
  defaultParams: Record<string, EffectParam>;
  init: (scene: THREE.Scene, params: Record<string, any>) => void;
  update: (delta: number, params: Record<string, any>) => void;
  dispose: () => void;
}
```

### 5.2 Effect Loader

Effects are loaded dynamically using the effect loader:

```typescript
import { EffectService } from './services/effectService';

// Configure base path
EffectService.setBasePath('/effects');

// Load effect module
const module = await EffectService.loadEffect('gn-particles');
```

---

## 6. Data Flow

```
┌─────────────────┐
│   effects.json  │ → Static effect definitions
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ EffectService   │ → Load/parse effect modules
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useEffectStore │ → Effect selection, params
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌──────────────┐
│Canvas │  │  Controls    │
│(Three)│←→│  (React)     │
└───────┘  └──────────────┘
         ▲
         │
┌────────┴────────┐
│   useUIStore    │ → Panels, theme, toasts
└─────────────────┘
```

---

## 7. Build Configuration

### 7.1 Vite Config

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          framer: ['framer-motion']
        }
      }
    }
  }
});
```

### 7.2 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_EFFECTS_PATH` | `/effects` | Effect modules base path |
| `VITE_API_URL` | - | Optional API endpoint |

---

## 8. Performance Requirements

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Frame Rate | 60 FPS |
| Bundle Size (gzipped) | < 500KB |
| Effect Load Time | < 500ms |
