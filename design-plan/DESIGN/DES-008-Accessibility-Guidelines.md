# DES-008: Accessibility Guidelines

## Overview
Accessibility requirements and implementation guidelines for the Kirakira project, targeting WCAG 2.1 AA compliance.

---

## 1. Color Contrast Requirements

### 1.1 Text Contrast Ratios

| Element | Minimum Ratio | Current Status |
|---------|---------------|----------------|
| Normal Text | 4.5:1 | ✓ #E0E0E0 on #121212 = 12.6:1 |
| Large Text (18px+) | 3:1 | ✓ Passes |
| UI Components | 3:1 | ✓ #00FFFF border on dark = 16:1 |

### 1.2 Non-Text Contrast

| Element | Ratio | Status |
|---------|-------|--------|
| Buttons | 3:1 | ✓ |
| Form Inputs | 3:1 | ✓ |
| Icons | 3:1 | ✓ |

### 1.3 Color Independence

- Never convey information through color alone
- Use icons, patterns, or text labels alongside color
- Error states: Red + "Error" text + ⚠ icon

---

## 2. Reduced Motion Support

### 2.1 CSS Implementation

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0.01ms;
    --transition-normal: 0.01ms;
    --transition-slow: 0.01ms;
    --transition-slower: 0.01ms;
    --effect-glow-duration: 0.01ms;
    --effect-pulse-duration: 0.01ms;
    --effect-float-duration: 0.01ms;
  }
  
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.2 JavaScript Detection

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable Three.js animations if needed
if (prefersReducedMotion) {
  effectRenderer.setAnimationSpeed(0);
}
```

### 2.3 User Toggle

Provide in-app toggle for motion preferences:
- Settings > Accessibility > Reduce Motion

---

## 3. Keyboard Navigation

### 3.1 Focus Order

1. Header navigation
2. Effect library sidebar
3. 3D canvas (focusable for controls)
4. Parameter controls
5. Action buttons

### 3.2 Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--color-primary-accent);
  outline-offset: 2px;
  box-shadow: var(--shadow-neon-cyan);
}

/* Hide outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 3.3 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift + Tab` | Move focus backward |
| `Enter / Space` | Activate button/link |
| `Arrow Keys` | Navigate sliders, lists |
| `Escape` | Close modal/panel |
| `?` | Open help panel |

### 3.4 Skip Link

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

---

## 4. Screen Reader Support

### 4.1 Semantic HTML

- Use proper heading hierarchy (h1 → h6)
- Use `<nav>`, `<main>`, `<aside>` landmarks
- Use `<button>` for interactive elements

### 4.2 ARIA Labels

```html
<!-- 3D Canvas -->
<canvas 
  role="img" 
  aria-label="Interactive 3D visualization of GN Particles effect"
  tabindex="0"
></canvas>

<!-- Effect Card -->
<button 
  class="effect-card" 
  aria-pressed="true"
  aria-describedby="gn-desc"
>
  <span id="gn-desc" class="sr-only">
    GN Particles from Gundam 00 series. Green glowing particles.
  </span>
</button>

<!-- Slider -->
<input 
  type="range" 
  aria-label="Particle speed"
  aria-valuemin="0.1"
  aria-valuemax="2.0"
  aria-valuenow="0.5"
/>
```

### 4.3 Live Regions

```html
<!-- Toast notifications -->
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  Effect loaded successfully
</div>

<!-- Error messages -->
<div 
  role="alert" 
  aria-live="assertive"
>
  Failed to load effect
</div>
```

---

## 5. High Contrast Theme

### 5.1 CSS Implementation

```css
[data-theme="high-contrast"] {
  --color-primary-bg: #000000;
  --color-secondary-bg: #000000;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #FFFFFF;
  --color-border-primary: #FFFFFF;
  --color-border-accent: #FFFFFF;
  --color-primary-accent: #FFFF00;
}
```

### 5.2 System Preference Detection

```css
@media (prefers-contrast: high) {
  :root {
    --color-border-primary: #FFFFFF;
    --color-text-muted: #CCCCCC;
  }
}
```

---

## 6. Touch Target Sizes

### 6.1 Minimum Sizes

| Element | Minimum Size |
|---------|--------------|
| Buttons | 44px × 44px |
| Links | 44px × 44px (tap area) |
| Sliders | 44px height |
| Checkboxes | 44px × 44px |

### 6.2 Spacing

- Minimum 8px between touch targets
- Prefer 16px for comfortable interaction

---

## 7. Error Prevention

### 7.1 Form Validation

- Show errors inline near the field
- Use clear error messages
- Persist user input on error

### 7.2 Confirmations

- Confirm destructive actions
- Provide undo option where possible
- Auto-save user presets

---

## 8. Testing Checklist

### 8.1 Automated Tests

- [ ] axe-core accessibility audit
- [ ] Lighthouse accessibility score > 90
- [ ] Color contrast checker

### 8.2 Manual Tests

- [ ] Keyboard-only navigation
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Zoom to 200% test
- [ ] High contrast mode test
- [ ] Reduced motion test

### 8.3 User Testing

- [ ] Test with users who rely on assistive technology
- [ ] Gather feedback on effect descriptions
