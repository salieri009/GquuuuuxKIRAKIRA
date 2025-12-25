# DES-003: Typography System

## Overview
Complete typography specification for the Kirakira project, including font stacks, size scales, and usage guidelines aligned with Gundam aesthetic research.

## Justification
> **Why this document exists:** Defines typography hierarchy and effect-specific text styles. Ensures futuristic Gundam aesthetic through Orbitron/Exo 2 display fonts while maintaining readability with Inter for body text.

---

## 1. Font Families

### 1.1 Primary Font Stack

| Purpose | Token | Stack |
|---------|-------|-------|
| Primary (UI) | `--font-primary` | `'Inter', 'Roboto', 'Noto Sans KR', system-ui, sans-serif` |
| Display | `--font-display` | `'Orbitron', 'Exo 2', sans-serif` |
| Monospace | `--font-mono` | `'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace` |

### 1.2 Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+KR:wght@300;400;500;700&family=Orbitron:wght@400;500;700;900&display=swap" rel="stylesheet">
```

### 1.3 Font Purpose

| Font | Usage |
|------|-------|
| **Inter** | Body text, UI labels, buttons |
| **Orbitron** | Display titles, effect names, headers |
| **Exo 2** | Alternative display, subheadings |
| **JetBrains Mono** | Code, technical data, parameters |
| **Noto Sans KR** | Korean language support |

---

## 2. Font Size Scale

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| `--font-size-xs` | 0.75rem | 12px | Captions, labels |
| `--font-size-sm` | 0.875rem | 14px | Secondary text |
| `--font-size-base` | 1rem | 16px | Body text |
| `--font-size-lg` | 1.125rem | 18px | Emphasized body |
| `--font-size-xl` | 1.25rem | 20px | Small headings |
| `--font-size-2xl` | 1.5rem | 24px | H4 headings |
| `--font-size-3xl` | 1.875rem | 30px | H3 headings |
| `--font-size-4xl` | 2.25rem | 36px | H2 headings |
| `--font-size-5xl` | 3rem | 48px | H1 headings |
| `--font-size-6xl` | 3.75rem | 60px | Display titles |

---

## 3. Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-weight-thin` | 100 | Decorative only |
| `--font-weight-light` | 300 | Subtle body text |
| `--font-weight-regular` | 400 | Default body |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 600 | Subheadings |
| `--font-weight-bold` | 700 | Headings, buttons |
| `--font-weight-black` | 900 | Display titles |

---

## 4. Line Height

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-tight` | 1.25 | Headings |
| `--line-height-normal` | 1.5 | Body text |
| `--line-height-relaxed` | 1.75 | Long-form content |

---

## 5. Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--letter-spacing-tight` | -0.025em | Large display |
| `--letter-spacing-normal` | 0 | Body text |
| `--letter-spacing-wide` | 0.025em | Buttons, labels |
| `--letter-spacing-wider` | 0.05em | Section headers |
| `--letter-spacing-widest` | 0.1em | All-caps labels |

---

## 6. Typography Components

### 6.1 Heading Styles

```css
h1 {
  font-family: var(--font-display);
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-text-primary);
}

h2 {
  font-family: var(--font-display);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

h3 {
  font-family: var(--font-primary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

h4 {
  font-family: var(--font-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}
```

### 6.2 Body Styles

```css
.body-large {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

.body-base {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
}

.body-small {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--color-text-muted);
}
```

### 6.3 UI Text Styles

```css
.button-text {
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.label-text {
  font-family: var(--font-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-widest);
  color: var(--color-text-muted);
}

.link-text {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-accent);
  text-decoration: none;
}
```

---

## 7. Effect Display Typography

### 7.1 GN Particles Title

```css
.effect-title-gn {
  font-family: var(--font-display);
  font-weight: 700;
  color: #00FF88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}
```

### 7.2 Newtype Flash Title

```css
.effect-title-newtype {
  font-family: var(--font-display);
  font-weight: 500;
  background: linear-gradient(90deg, #FF00FF, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 7.3 Trans-Am Title

```css
.effect-title-trans-am {
  font-family: 'Exo 2', var(--font-display);
  font-weight: 700;
  color: #FF0044;
  animation: trans-am-pulse 1.5s infinite;
}
```

---

## 8. Responsive Typography

### 8.1 Mobile (< 768px)

```css
@media (max-width: 767px) {
  h1 { font-size: var(--font-size-4xl); }
  h2 { font-size: var(--font-size-3xl); }
  h3 { font-size: var(--font-size-2xl); }
}
```

### 8.2 Tablet (768px - 1024px)

```css
@media (min-width: 768px) and (max-width: 1023px) {
  h1 { font-size: var(--font-size-4xl); }
}
```

---

## 9. Usage Guidelines

### 9.1 Do's
- Use display font (Orbitron) for titles and effect names only
- Maintain consistent hierarchy with size and weight
- Use monospace for technical parameters and code
- Apply text shadows sparingly on effect titles

### 9.2 Don'ts
- Don't use Orbitron for body text (legibility issues)
- Avoid mixing too many font weights in one section
- Don't use all-caps for long text blocks
- Avoid line heights below 1.25 for readable text
