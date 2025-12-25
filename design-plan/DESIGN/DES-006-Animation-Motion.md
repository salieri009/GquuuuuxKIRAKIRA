# DES-006: Animation and Motion

## Overview
Animation specifications, timing functions, and motion guidelines for the Kirakira project.

---

## 1. Transition Timing

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 0.15s ease-out | Micro-interactions |
| `--transition-normal` | 0.3s ease-out | Standard transitions |
| `--transition-slow` | 0.5s ease-out | Page transitions |
| `--transition-slower` | 0.75s ease-out | Complex animations |

---

## 2. Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-linear` | linear | Continuous motion |
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) | Accelerating |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Decelerating |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Smooth both ends |
| `--ease-bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | Playful bounce |
| `--ease-back` | cubic-bezier(0.34, 1.56, 0.64, 1) | Subtle overshoot |

---

## 3. Effect-Specific Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--effect-glow-duration` | 2s | Neon glow pulse |
| `--effect-pulse-duration` | 1.5s | General pulse |
| `--effect-float-duration` | 3s | Floating animation |

---

## 4. Framer Motion Patterns

### 4.1 Page Enter Animation

```tsx
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const pageTransition = {
  duration: 0.5,
  delay: 0.2
};
```

### 4.2 Sidebar Slide

```tsx
const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

const sidebarTransition = {
  duration: 0.3,
  ease: [0, 0, 0.2, 1] // ease-out
};
```

### 4.3 Canvas Scale In

```tsx
const canvasVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 }
};

const canvasTransition = {
  duration: 0.5,
  delay: 0.3,
  ease: [0.4, 0, 0.2, 1]
};
```

### 4.4 Controls Slide Up

```tsx
const controlsVariants = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};

const controlsTransition = {
  duration: 0.3,
  delay: 0.4
};
```

---

## 5. CSS Keyframe Animations

### 5.1 Neon Pulse

```css
@keyframes neon-pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.neon-pulse {
  animation: neon-pulse var(--effect-pulse-duration) ease-in-out infinite;
}
```

### 5.2 Spinner Rotation

```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```

### 5.3 Glow Effect

```css
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 10px var(--color-primary-accent);
  }
  50% {
    box-shadow: 0 0 20px var(--color-primary-accent),
                0 0 40px rgba(0, 255, 255, 0.3);
  }
}
```

### 5.4 Trans-Am Pulse

```css
@keyframes trans-am-pulse {
  0%, 100% {
    filter: brightness(1);
    box-shadow: 0 0 10px rgba(255, 0, 68, 0.5);
  }
  50% {
    filter: brightness(1.3);
    box-shadow: 0 0 30px rgba(255, 0, 68, 0.8),
                0 0 60px rgba(255, 0, 68, 0.4);
  }
}
```

---

## 6. Hover Effects

### 6.1 Button Sweep Effect

```css
.button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

.button:hover::before {
  left: 100%;
}
```

### 6.2 Card Lift Effect

```css
.card {
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-neon-cyan);
}
```

### 6.3 Scale Effect

```css
.interactive-element {
  transition: transform var(--transition-fast);
}

.interactive-element:hover {
  transform: scale(1.05);
}

.interactive-element:active {
  transform: scale(0.98);
}
```

---

## 7. Toast Animations

### 7.1 Slide In

```tsx
const toastVariants = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 300, opacity: 0 }
};
```

### 7.2 Auto Dismiss

```tsx
const TOAST_DURATION = 5000; // 5 seconds
const FADE_OUT_DURATION = 300;
```

---

## 8. Accessibility: Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 8.1 Framer Motion Pattern

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const transition = prefersReducedMotion 
  ? { duration: 0 }
  : { duration: 0.3, ease: 'easeOut' };
```

---

## 9. Performance Guidelines

### 9.1 GPU-Accelerated Properties
Prefer these for smooth animations:
- `transform`
- `opacity`
- `filter`

### 9.2 Avoid Animating
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `box-shadow` (use opacity instead)

### 9.3 Will-Change

```css
.animated-element {
  will-change: transform, opacity;
}

/* Remove after animation */
.animation-complete {
  will-change: auto;
}
```
