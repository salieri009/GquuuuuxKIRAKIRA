# DES-004: Component Library

## Overview
UI component specifications for the Kirakira project, derived from `apps/web/src/styles/components.css` and React components in `apps/web/src/components/ui/`.

> **Implementation (2026-06-19):** **Premium Minimal** chrome — prefer `Button` component over `.neon-button` CSS. Glass panels are flat surfaces with 1px neutral borders.

**Source of truth:** `apps/web/src/styles/components.css`, `apps/web/src/components/ui/Button.tsx`

---

## 1. Glass Panel

Flat panel with subtle border (minimal blur).

### 1.1 Specifications

| Property | Value |
|----------|-------|
| Background | `var(--color-tertiary-bg)` |
| Border | `1px solid var(--color-border-primary)` |
| Border Radius | `var(--radius-lg)` (12px) |
| Box Shadow | `var(--shadow-glass)` |

### 1.2 States

| State | Border Color | Additional Styles |
|-------|--------------|-------------------|
| Default | `var(--color-border-primary)` | — |
| Hover (cards) | `var(--color-border-hover)` | Background `var(--color-tertiary-bg)` |

### 1.3 CSS Implementation

```css
.glass-panel {
  background: var(--color-tertiary-bg);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glass);
}
```

---

## 2. Button (`Button.tsx`)

Primary interactive control. Replaces legacy **NeonButton** in app code.

### 2.1 Variants

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| Primary | `var(--color-primary-accent)` | transparent | `var(--color-text-inverse)` |
| Secondary | `var(--color-surface)` | `var(--color-border-primary)` | `var(--color-text-primary)` |
| Ghost | transparent | transparent | `var(--color-text-secondary)` |
| Danger | transparent | `danger/40` | `var(--color-danger)` |

### 2.2 Specifications

| Property | Value |
|----------|-------|
| Font Weight | 500 (medium) |
| Font Size | `sm`–`base` by size prop |
| Text Transform | none |
| Transition | `150ms` colors only |
| Focus | `focus-visible:ring-2` accent |

### 2.3 Legacy `.neon-button`

Retained in CSS as minimal ghost fallback; **do not use in new components**.

---

## 3. Effect Card

Clickable card for effect selection.

### 3.1 Specifications

| Property | Value |
|----------|-------|
| Background | `var(--color-secondary-bg)` |
| Border | `1px solid var(--color-border-primary)` |
| Border Radius | `var(--radius-lg)` |
| Padding | per layout (`EffectLibrary`) |
| Cursor | pointer |

### 3.2 States

| State | Border | Accent |
|-------|--------|--------|
| Default | `var(--color-border-primary)` | — |
| Hover | `var(--color-border-hover)` | Background `var(--color-tertiary-bg)` |
| Selected | unchanged | **Left bar** 3px `var(--color-primary-accent)` |

### 3.3 Left Accent Bar (selected)

```css
.effect-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary-accent);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.effect-card.active::before,
.effect-card[data-selected='true']::before {
  opacity: 1;
}
```

---

## 4. Slider (`.neon-slider` / `NeonSlider.tsx`)

Custom range input with neon styling.

### 4.1 Specifications

| Element | Property | Value |
|---------|----------|-------|
| Track | Height | 4px |
| Track | Background | `var(--color-border-primary)` |
| Track (Filled) | Background | `var(--color-primary-accent)` |
| Thumb | Size | 14px × 14px |
| Thumb | Background | `var(--color-text-primary)` |
| Thumb | Border | `2px solid var(--color-primary-accent)` |
| Thumb | Shadow | `var(--shadow-sm)` |

### 4.2 Thumb States

| State | Transform | Shadow |
|-------|-----------|--------|
| Default | `scale(1)` | `var(--shadow-sm)` |
| Hover/Active | `scale(1.1)` | unchanged |

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
| Success | `var(--color-success)` | ✓ |
| Error | `var(--color-danger)` | ✗ |
| Warning | `var(--color-warning)` | ⚠ |
| Info | `var(--color-info)` | ℹ |

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
| Box Shadow | `var(--shadow-xl)` |
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
