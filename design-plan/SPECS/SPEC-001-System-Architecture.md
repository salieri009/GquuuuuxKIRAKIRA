# SPEC-001: System Architecture

## Overview
Technical architecture specification for the Kirakira Gundam Effects project.

---

## 1. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Build Tool | Vite | 5.x |
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| 3D Rendering | Three.js | Latest |
| Animation | Framer Motion | 11.x |
| Styling | Tailwind CSS + CSS Variables | 3.x |
| Testing | Vitest | Latest |

---

## 2. Project Structure

```
frontend/
├── src/
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
│   ├── contexts/              # React Context providers
│   │   └── UIContext.tsx
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
│   ├── store/                 # State management
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
├── UIProvider (Context)
│   └── AppContent
│       ├── ErrorBoundary
│       │   ├── Header
│       │   ├── InfoPanel
│       │   ├── HelpPanel
│       │   ├── PresetManager
│       │   ├── ToastContainer
│       │   └── Main
│       │       ├── EffectLibrary (Sidebar)
│       │       └── Content Area
│       │           ├── EffectCanvas
│       │           └── EffectControls
│       └── PerformanceMonitor (DEV only)
```

### 3.2 Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `App` | Root provider setup |
| `UIProvider` | Global UI state management |
| `Header` | Navigation, branding |
| `EffectLibrary` | Effect selection list |
| `EffectCanvas` | Three.js renderer wrapper |
| `EffectControls` | Parameter adjustment UI |
| `InfoPanel` | Effect information display |

---

## 4. State Management

### 4.1 UI Context

```typescript
interface UIState {
  isLibraryVisible: boolean;
  isControlsVisible: boolean;
  isInfoPanelOpen: boolean;
  isHelpPanelOpen: boolean;
  isMobile: boolean;
  selectedEffect: string | null;
  effectParams: Record<string, EffectParam>;
  toasts: Toast[];
}
```

### 4.2 Actions

| Action | Payload | Description |
|--------|---------|-------------|
| `TOGGLE_LIBRARY` | none | Toggle sidebar visibility |
| `TOGGLE_CONTROLS` | none | Toggle controls panel |
| `SELECT_EFFECT` | effectId | Set active effect |
| `UPDATE_PARAM` | { key, value } | Update effect parameter |
| `ADD_TOAST` | Toast | Show notification |
| `REMOVE_TOAST` | toastId | Dismiss notification |

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
│  UIContext      │ → Centralized state
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐  ┌──────────────┐
│Canvas │  │  Controls    │
│(Three)│←→│  (React)     │
└───────┘  └──────────────┘
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
