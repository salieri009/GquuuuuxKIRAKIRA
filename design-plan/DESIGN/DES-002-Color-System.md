# DES-002: Color System

## Overview
This document defines the complete color system for the Kirakira project, derived from frontend implementation (`variables.css`) and aligned with Gundam visual design research.

## Justification
> **Why this document exists:** Centralizes all color tokens for consistent UI implementation. Bridges research conclusions to actionable CSS variables, ensuring effects match their canonical Gundam colors.

> **Implementation (2026-06-19):** Live UI tokens are defined in `apps/web/src/styles/variables.css` (**Premium Minimal**). Sections 1, 3–5, and 7 describe the **implemented chrome**. Section 2 retains **effect-specific** colors for 3D rendering (unchanged from research).

**Source of truth:** `apps/web/src/styles/variables.css`

---

## 1. Core Color Palette

### 1.1 Background Colors

| Token | Hex | RGB | HSL | Usage |
|-------|-----|-----|-----|-------|
| `--color-primary-bg` | `#0B0C0E` | rgb(11, 12, 14) | hsl(220, 9%, 5%) | Main background |
| `--color-secondary-bg` | `#111318` | rgb(17, 19, 24) | hsl(225, 14%, 8%) | Secondary areas |
| `--color-tertiary-bg` | `#181B22` | rgb(24, 27, 34) | hsl(222, 17%, 11%) | Panels, cards |
| `--color-surface` | `#1E222A` | rgb(30, 34, 42) | hsl(220, 17%, 14%) | Elevated surfaces |

### 1.2 Accent Colors

| Token | Hex | RGB | HSL | Usage |
|-------|-----|-----|-----|-------|
| `--color-primary-accent` | `#3D9A9A` | rgb(61, 154, 154) | hsl(180, 43%, 42%) | Primary actions, focus ring |
| `--color-primary-accent-hover` | `#4DAEAE` | rgb(77, 174, 174) | hsl(180, 38%, 49%) | Primary hover |
| `--color-secondary-accent` | `#6B7280` | rgb(107, 114, 128) | hsl(220, 9%, 46%) | Secondary emphasis (neutral) |
| `--color-tertiary-accent` | `#3D9A9A` | rgb(61, 154, 154) | hsl(180, 43%, 42%) | Alias of primary accent |
| `--color-warning` | `#D4A853` | rgb(212, 168, 83) | hsl(40, 58%, 58%) | Warnings |
| `--color-danger` | `#E05C5C` | rgb(224, 92, 92) | hsl(0, 65%, 62%) | Errors |
| `--color-success` | `#4CAF82` | rgb(76, 175, 130) | hsl(152, 35%, 49%) | Success states |
| `--color-info` | `#5B8DEF` | rgb(91, 141, 239) | hsl(220, 82%, 65%) | Information |

### 1.3 Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#F4F4F5` | Primary text |
| `--color-text-secondary` | `#A1A1AA` | Secondary text |
| `--color-text-muted` | `#71717A` | Muted/disabled text |
| `--color-text-disabled` | `#52525B` | Disabled state |
| `--color-text-accent` | `var(--color-primary-accent)` | Linked/accent text |
| `--color-text-inverse` | `#0B0C0E` | Text on accent backgrounds |

### 1.4 Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-border-primary` | `#2A2D34` | Default borders |
| `--color-border-secondary` | `#353943` | Secondary borders |
| `--color-border-accent` | `var(--color-primary-accent)` | Active/focus borders |
| `--color-border-hover` | `#3F434C` | Hover state |

---

## 2. Effect-Specific Colors

### 2.1 GN Particles (Gundam 00)

| State | Token | Hex | Usage |
|-------|-------|-----|-------|
| Primary | `--effect-gn-primary` | `#00FF88` | Standard particle |
| Secondary | `--effect-gn-secondary` | `#00FFAA` | Glow effect |
| Beam | `--effect-gn-beam` | `#FF69B4` | Concentrated beam |
| Trans-Am | `--effect-trans-am` | `#FF0044` | Trans-Am mode |

### 2.2 Minovsky Particles (UC)

| State | Token | Hex | Usage |
|-------|-------|-----|-------|
| Primary | `--effect-minovsky-primary` | `#00AAFF` | Particle color |
| Interference | `--effect-minovsky-interference` | `#FF6666` | Sensor disruption |

### 2.3 Newtype Flash (UC)

| State | Token | Hex | Usage |
|-------|-------|-----|-------|
| Primary | `--effect-newtype-primary` | `#FF00FF` | Flash center |
| Secondary | `--effect-newtype-secondary` | `#00FFFF` | Ripple edge |
| Warning | `--effect-newtype-warning` | `#FFD700` | Alert variant |

### 2.4 Psycho Field (UC)

| State | Token | Hex | Usage |
|-------|-------|-----|-------|
| Active | `--effect-psycho-active` | `#FF4444` | Active field |
| Overload | `--effect-psycho-overload` | `#FF6600` | Overload state |

---

## 3. Glass & Panel Surfaces

| Token | Value | Usage |
|-------|-------|-------|
| `--color-glass-bg` | `rgba(255, 255, 255, 0.04)` | Subtle glass tint |
| `--color-glass-secondary` | `rgba(255, 255, 255, 0.02)` | Secondary glass |
| `--color-panel-bg` | `rgba(17, 19, 24, 0.92)` | Header/panel background |
| `--color-modal-backdrop` | `rgba(0, 0, 0, 0.72)` | Modal overlay |

---

## 4. Gradients

### 4.1 Accent Gradients

```css
--gradient-primary: linear-gradient(135deg, #3D9A9A 0%, #2D7A7A 100%);
--gradient-secondary: linear-gradient(135deg, #1E222A 0%, #111318 100%);
--gradient-tertiary: linear-gradient(135deg, #3D9A9A 0%, #5B8DEF 100%);
--gradient-warning: linear-gradient(135deg, #D4A853 0%, #B8923F 100%);
--gradient-danger: linear-gradient(135deg, #E05C5C 0%, #C04444 100%);
```

### 4.2 Surface Gradients

```css
--gradient-panel: linear-gradient(180deg, #181B22 0%, #111318 100%);
--gradient-glass: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
--gradient-overlay: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.75) 100%);
```

---

## 5. Shadows

### 5.1 Legacy neon token aliases (neutral in UI)

| Token | Value (implemented) |
|-------|---------------------|
| `--shadow-neon-cyan` | `0 0 0 1px rgba(61, 154, 154, 0.25)` |
| `--shadow-neon-cyan-strong` | `0 4px 14px rgba(0, 0, 0, 0.35)` |
| `--shadow-neon-magenta` | `var(--shadow-md)` |
| `--shadow-neon-magenta-strong` | `var(--shadow-lg)` |
| `--shadow-neon-green` | `var(--shadow-md)` |

### 5.2 Standard Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.3)` | Subtle elevation |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.4)` | Cards, buttons |
| `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.5)` | Modals, dropdowns |
| `--shadow-xl` | `0 16px 48px rgba(0, 0, 0, 0.6)` | Large overlays |

### 5.3 Component Shadows

| Token | Value |
|-------|-------|
| `--shadow-glass` | `0 1px 0 rgba(255, 255, 255, 0.04) inset, var(--shadow-sm)` |
| `--shadow-panel` | `var(--shadow-md)` |

---

## 6. Theme Variants

### 6.1 High Contrast Theme

```css
[data-theme="high-contrast"] {
  --color-primary-bg: #000000;
  --color-text-primary: #FFFFFF;
  --color-border-primary: #FFFFFF;
  --color-primary-accent: #FFFFFF;
}
```

### 6.2 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  --effect-glow-duration: 0.01ms;
  --effect-pulse-duration: 0.01ms;
}
```

### 6.3 High Contrast Preference

```css
@media (prefers-contrast: high) {
  --color-border-primary: #FFFFFF;
  --color-text-muted: #CCCCCC;
}
```

---

## 7. Usage Guidelines

### 7.1 Do's
- Use semantic color tokens, not raw hex values
- Maintain 4.5:1 contrast ratio for text
- Use a **single UI accent** (`#3D9A9A`) for chrome; reserve bright effect colors for the 3D canvas (Section 2)
- Prefer flat borders and neutral shadows over glow

### 7.2 Don'ts
- Don't apply cyan/magenta neon gradients to chrome (legacy research palette)
- Avoid pure white (#FFFFFF) for large text areas
- Don't use accent colors for body text
- Don't enable `glowEffects` by default in UI (`uiStore` default: `false`)
