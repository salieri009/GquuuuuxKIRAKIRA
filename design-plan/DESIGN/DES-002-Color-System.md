# DES-002: Color System

## Overview
This document defines the complete color system for the Kirakira project, derived from frontend implementation (`variables.css`) and aligned with Gundam visual design research.

## Justification
> **Why this document exists:** Centralizes all color tokens for consistent UI implementation. Bridges research conclusions to actionable CSS variables, ensuring effects match their canonical Gundam colors.

---

## 1. Core Color Palette

### 1.1 Background Colors

| Token | Hex | RGB | HSL | Usage |
|-------|-----|-----|-----|-------|
| `--color-primary-bg` | `#0A0A0A` | rgb(10, 10, 10) | hsl(0, 0%, 4%) | Main background |
| `--color-secondary-bg` | `#121212` | rgb(18, 18, 18) | hsl(0, 0%, 7%) | Secondary areas |
| `--color-tertiary-bg` | `#1E1E1E` | rgb(30, 30, 30) | hsl(0, 0%, 12%) | Panels, cards |
| `--color-surface` | `#2A2A2A` | rgb(42, 42, 42) | hsl(0, 0%, 16%) | Elevated surfaces |

### 1.2 Accent Colors

| Token | Hex | RGB | HSL | Usage |
|-------|-----|-----|-----|-------|
| `--color-primary-accent` | `#00FFFF` | rgb(0, 255, 255) | hsl(180, 100%, 50%) | Primary actions, links |
| `--color-secondary-accent` | `#FF00FF` | rgb(255, 0, 255) | hsl(300, 100%, 50%) | Secondary emphasis |
| `--color-tertiary-accent` | `#00FF88` | rgb(0, 255, 136) | hsl(152, 100%, 50%) | GN Particles, success |
| `--color-warning` | `#FFD700` | rgb(255, 215, 0) | hsl(51, 100%, 50%) | Newtype, warnings |
| `--color-danger` | `#FF4444` | rgb(255, 68, 68) | hsl(0, 100%, 63%) | Errors, Psycho Field |
| `--color-success` | `#00FF88` | rgb(0, 255, 136) | hsl(152, 100%, 50%) | Success states |
| `--color-info` | `#00A8FF` | rgb(0, 168, 255) | hsl(200, 100%, 50%) | Information |

### 1.3 Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#FFFFFF` | Primary text |
| `--color-text-secondary` | `#E0E0E0` | Secondary text |
| `--color-text-muted` | `#999999` | Muted/disabled text |
| `--color-text-disabled` | `#555555` | Disabled state |
| `--color-text-accent` | `#00FFFF` | Linked/accent text |
| `--color-text-inverse` | `#000000` | Text on light bg |

### 1.4 Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-border-primary` | `#333333` | Default borders |
| `--color-border-secondary` | `#444444` | Secondary borders |
| `--color-border-accent` | `#00FFFF` | Active/focus borders |
| `--color-border-hover` | `#555555` | Hover state |

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

## 3. Glass Morphism

| Token | Value | Usage |
|-------|-------|-------|
| `--color-glass-bg` | `rgba(0, 255, 255, 0.08)` | Glass panel background |
| `--color-glass-secondary` | `rgba(255, 0, 255, 0.06)` | Secondary glass |
| `--color-panel-bg` | `rgba(18, 18, 18, 0.95)` | Solid panels |
| `--color-modal-backdrop` | `rgba(0, 0, 0, 0.8)` | Modal overlay |
| `--glass-blur` | `16px` | Backdrop blur amount |
| `--glass-border-opacity` | `0.2` | Border transparency |

---

## 4. Gradients

### 4.1 Accent Gradients

```css
--gradient-primary: linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%);
--gradient-secondary: linear-gradient(135deg, #FF00FF 0%, #00FF88 100%);
--gradient-tertiary: linear-gradient(135deg, #00FF88 0%, #00FFFF 100%);
--gradient-warning: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
--gradient-danger: linear-gradient(135deg, #FF4444 0%, #CC0000 100%);
```

### 4.2 Surface Gradients

```css
--gradient-panel: linear-gradient(145deg, rgba(18, 18, 18, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%);
--gradient-glass: linear-gradient(145deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.05) 100%);
--gradient-overlay: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
```

---

## 5. Shadows & Glows

### 5.1 Neon Glows

| Token | Value |
|-------|-------|
| `--shadow-neon-cyan` | `0 0 20px rgba(0, 255, 255, 0.4)` |
| `--shadow-neon-cyan-strong` | `0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.3)` |
| `--shadow-neon-magenta` | `0 0 20px rgba(255, 0, 255, 0.4)` |
| `--shadow-neon-magenta-strong` | `0 0 30px rgba(255, 0, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.3)` |
| `--shadow-neon-green` | `0 0 20px rgba(0, 255, 136, 0.4)` |

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
| `--shadow-glass` | `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)` |
| `--shadow-panel` | `0 4px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(0, 255, 255, 0.1)` |

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
- Apply neon glows sparingly for emphasis
- Use gradients for interactive elements

### 7.2 Don'ts
- Don't mix multiple neon colors in close proximity
- Avoid pure white (#FFFFFF) for large text areas
- Don't use accent colors for body text
- Avoid transparency below 0.1 for glass effects
