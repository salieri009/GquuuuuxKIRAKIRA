# DES-004: Component Library

## Overview
UI component specifications for the Kirakira project, derived from `components.css` and React component implementations.

---

## 1. Glass Panel

Translucent panel with blur effect and neon border.

### 1.1 Specifications

| Property | Value |
|----------|-------|
| Background | `var(--gradient-glass)` |
| Backdrop Filter | `blur(10px)` |
| Border | `1px solid rgba(0, 255, 255, 0.2)` |
| Border Radius | `var(--radius-lg)` (12px) |
| Box Shadow | `var(--shadow-glass)` |

### 1.2 States

| State | Border Color | Additional Styles |
|-------|--------------|-------------------|
| Default | `rgba(0, 255, 255, 0.2)` | - |
| Hover | `rgba(0, 255, 255, 0.4)` | `+ var(--shadow-neon-cyan)` |
| Active | `var(--color-primary-accent)` | Solid cyan border |

### 1.3 CSS Implementation

```css
.glass-panel {
  background: var(--gradient-glass);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glass);
  transition: all var(--transition-normal);
}

.glass-panel:hover {
  border-color: rgba(0, 255, 255, 0.4);
  box-shadow: var(--shadow-glass), var(--shadow-neon-cyan);
}
```

---

## 2. Neon Button

Interactive button with neon glow effect.

### 2.1 Variants

| Variant | Border | Text | Hover Background |
|---------|--------|------|------------------|
| Primary | `#00FFFF` | `#00FFFF` | `#00FFFF` |
| Secondary | `#FF00FF` | `#FF00FF` | `#FF00FF` |
| Ghost | `#00FFFF` | `#00FFFF` | Transparent |

### 2.2 Specifications

| Property | Value |
|----------|-------|
| Padding | `0.75rem 1.5rem` |
| Border | `2px solid` |
| Border Radius | `var(--radius-md)` (8px) |
| Font Weight | 700 |
| Font Size | `var(--font-size-sm)` |
| Text Transform | uppercase |
| Letter Spacing | 0.1em |

### 2.3 Hover Animation

```css
.neon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent);
  transition: left var(--transition-slow);
}

.neon-button:hover::before {
  left: 100%;
}
```

---

## 3. Effect Card

Clickable card for effect selection.

### 3.1 Specifications

| Property | Value |
|----------|-------|
| Background | `var(--gradient-panel)` |
| Border | `1px solid rgba(0, 255, 255, 0.1)` |
| Border Radius | `var(--radius-lg)` |
| Padding | `var(--spacing-6)` (24px) |
| Cursor | pointer |

### 3.2 States

| State | Transform | Border | Shadow |
|-------|-----------|--------|--------|
| Default | none | `rgba(0, 255, 255, 0.1)` | `var(--shadow-panel)` |
| Hover | `translateY(-2px)` | `rgba(0, 255, 255, 0.3)` | `+ var(--shadow-neon-cyan)` |
| Active | none | `var(--color-primary-accent)` | `var(--shadow-neon-cyan)` |

### 3.3 Top Accent Line

```css
.effect-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.effect-card:hover::before,
.effect-card.active::before {
  transform: scaleX(1);
}
```

---

## 4. Neon Slider

Custom range input with neon styling.

### 4.1 Specifications

| Element | Property | Value |
|---------|----------|-------|
| Track | Height | 4px |
| Track | Background | `var(--color-secondary-bg)` |
| Track (Filled) | Background | `var(--gradient-primary)` |
| Thumb | Size | 16px × 16px |
| Thumb | Background | `var(--color-primary-accent)` |
| Thumb | Shadow | `var(--shadow-neon-cyan)` |

### 4.2 Thumb States

| State | Transform | Shadow |
|-------|-----------|--------|
| Default | `scale(1)` | `var(--shadow-neon-cyan)` |
| Hover/Active | `scale(1.2)` | Enhanced glow |

---

## 5. Loading Spinner

Rotating spinner for loading states.

### 5.1 Specifications

| Property | Value |
|----------|-------|
| Size | 40px × 40px |
| Border | 3px solid |
| Border Color | `var(--color-secondary-bg)` (track), `var(--color-primary-accent)` (indicator) |
| Animation | `spin 1s linear infinite` |

### 5.2 Animation

```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 6. Toast Notification

Notification popup with auto-dismiss.

### 6.1 Variants

| Type | Border Color | Icon |
|------|--------------|------|
| Success | `#00FF88` | ✓ |
| Error | `#FF4444` | ✗ |
| Warning | `#FFD700` | ⚠ |
| Info | `#00FFFF` | ℹ |

### 6.2 Specifications

| Property | Value |
|----------|-------|
| Background | `var(--color-panel-bg)` |
| Border Left | 4px solid [type color] |
| Border Radius | `var(--radius-md)` |
| Padding | `1rem 1.5rem` |
| Max Width | 400px |
| Z-Index | `var(--z-toast)` (800) |

---

## 7. Modal/Panel Overlay

Backdrop for modals and side panels.

### 7.1 Specifications

| Property | Value |
|----------|-------|
| Background | `var(--color-modal-backdrop)` |
| Position | Fixed, inset 0 |
| Z-Index | `var(--z-modal-backdrop)` (400) |

### 7.2 Content Container

| Property | Value |
|----------|-------|
| Background | `var(--gradient-panel)` |
| Border | `1px solid var(--color-border-accent)` |
| Border Radius | `var(--radius-xl)` |
| Box Shadow | `var(--shadow-xl)`, `var(--shadow-neon-cyan)` |
| Z-Index | `var(--z-modal)` (500) |

---

## 8. Component Sizing

### 8.1 Standard Sizes

| Size | Padding | Font Size |
|------|---------|-----------|
| Small | `0.5rem 1rem` | `var(--font-size-sm)` |
| Medium | `0.75rem 1.5rem` | `var(--font-size-base)` |
| Large | `1rem 2rem` | `var(--font-size-lg)` |

### 8.2 Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Pills, avatars |

---

## 9. Accessibility Requirements

- All interactive components must have `:focus-visible` styles
- Minimum touch target size: 44px × 44px
- Color contrast ratio: 4.5:1 for text
- Keyboard navigation support required
- `prefers-reduced-motion` must disable animations
