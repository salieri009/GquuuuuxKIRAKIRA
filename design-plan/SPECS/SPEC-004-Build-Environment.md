# SPEC-004: Build and Development Environment

## Overview
Development setup, build configuration, and deployment specifications.

---

## 1. Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x+ | Runtime |
| npm | 9.x+ | Package manager |
| Git | 2.x+ | Version control |

---

## 2. Quick Start

```bash
# Clone repository
git clone <repository-url>
cd GundamKiraKIra/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:5173
```

---

## 3. Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |
| `npm run test:ui` | Run tests with UI |

---

## 4. Vite Configuration

### 4.1 Base Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  
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
  },
  
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

### 4.2 Development Server

- Hot Module Replacement (HMR) enabled
- Auto-opens browser on `localhost:5173`
- CORS enabled for development

---

## 5. TypeScript Configuration

### 5.1 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 6. ESLint Configuration

```javascript
// eslint.config.js
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
];
```

---

## 7. Testing Configuration

### 7.1 Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### 7.2 Test File Structure

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx
└── test/
    └── setup.ts
```

---

## 8. Environment Variables

### 8.1 Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_EFFECTS_PATH` | `/effects` | Base path for effect modules |
| `VITE_API_URL` | - | Optional API endpoint |
| `VITE_DEBUG` | `false` | Enable debug mode |

### 8.2 Usage

```typescript
// Access in code
const effectsPath = import.meta.env.VITE_EFFECTS_PATH || '/effects';
const isDebug = import.meta.env.VITE_DEBUG === 'true';
const isDev = import.meta.env.DEV;
```

### 8.3 Environment Files

```
.env                # Default
.env.local          # Local overrides (gitignored)
.env.development    # Dev-specific
.env.production     # Production-specific
```

---

## 9. Production Build

### 9.1 Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── vendor-[hash].js     # React, React-DOM
│   ├── three-[hash].js      # Three.js
│   ├── framer-[hash].js     # Framer Motion
│   └── index-[hash].css     # Styles
└── effects/                  # Effect modules
```

### 9.2 Bundle Size Targets

| Bundle | Max Size (gzipped) |
|--------|-------------------|
| Main | 100KB |
| Vendor | 150KB |
| Three.js | 200KB |
| Framer | 50KB |
| Total | < 500KB |

---

## 10. Deployment

### 10.1 Static Hosting

The production build can be deployed to any static hosting:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### 10.2 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 10.3 Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 11. IDE Setup

### 11.1 VS Code Extensions

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

### 11.2 Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```
