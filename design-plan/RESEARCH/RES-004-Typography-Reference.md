# RES-004: Gundam Typography Reference

## Overview
This document provides typography specifications used across Gundam franchise, including logo fonts, in-universe display fonts, and interface typography. All fonts are categorized by series and usage.

## Justification
> **Why this document exists:** Typography is critical to the Gundam aesthetic. This research identifies official fonts (Serpentine for logos, A-Mun Celestial for Celestial Being) and provides web-safe fallback stacks, ensuring consistent visual identity.

---

## 1. Logo Typography

### 1.1 Primary Gundam Logo Font

| Property | Value |
|----------|-------|
| **Font Name** | Serpentine |
| **Style** | Bold, italicized |
| **Usage** | "GUNDAM" wordmark across most series |
| **Fallback** | Impact, Arial Black |

**CSS Implementation:**
```css
.gundam-logo {
  font-family: 'Serpentine', Impact, 'Arial Black', sans-serif;
  font-weight: bold;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 1.2 Series-Specific Logo Variants

| Series | Font Style | Characteristics |
|--------|------------|-----------------|
| UC Timeline | Serpentine Bold | Classic, angular |
| Gundam 00 | Custom geometric | Modern, clean |
| SEED | Serpentine with flourish | Dynamic, anime-style |
| Wing | Condensed serif | Military, formal |
| IBO | Industrial sans-serif | Heavy, mechanical |

---

## 2. Celestial Being Typography (Gundam 00)

### 2.1 A-Mun Celestial

Fan-recreated font based on Celestial Being organization displays.

| Property | Value |
|----------|-------|
| **Font Name** | A-Mun Celestial |
| **Type** | Decorative / Display |
| **Usage** | Organization logos, headers |
| **Source** | FontStruct / DeviantArt community |

**Characteristics:**
- Angular, geometric letterforms
- Futuristic aesthetic
- Limited character set
- Best used for titles only

**Fallback Stack:**
```css
.celestial-being {
  font-family: 'Orbitron', 'Exo 2', 'Rajdhani', sans-serif;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

### 2.2 Synapse (Cockpit Displays)

| Property | Value |
|----------|-------|
| **Font Name** | Synapse |
| **Designer** | Maniackers Design |
| **Usage** | Cockpit UI, system displays |
| **Style** | Monospace, digital |

**CSS Implementation:**
```css
.cockpit-display {
  font-family: 'Synapse', 'Share Tech Mono', 'Roboto Mono', monospace;
  font-weight: 400;
  letter-spacing: 0.05em;
}
```

---

## 3. Universal Century Typography

### 3.1 Military Stencil Style

UC timeline often uses military-inspired typography.

| Usage | Recommended Font | Fallback |
|-------|------------------|----------|
| Unit Markings | Stencil | Impact |
| Faction IDs | Bank Gothic | Century Gothic |
| Technical Labels | OCR-A | Courier New |

**CSS Implementation:**
```css
.uc-military {
  font-family: 'Stencil', 'Army', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.uc-technical {
  font-family: 'OCR-A', 'Share Tech Mono', monospace;
  font-weight: 400;
  letter-spacing: 0.1em;
}
```

### 3.2 Anaheim Electronics Style

Corporate/technical documentation style.

| Property | Value |
|----------|-------|
| **Display Font** | Eurostile Extended |
| **Body Font** | Helvetica |
| **Technical** | OCR-A |

---

## 4. Cosmic Era Typography (SEED)

### 4.1 ZAFT Interface

| Element | Font Style | Hex Color |
|---------|------------|-----------|
| Headers | Geometric sans | `#00FFFF` |
| Body | Clean sans-serif | `#FFFFFF` |
| Data | Monospace | `#00FF88` |

**Fallback Stack:**
```css
.zaft-interface {
  font-family: 'Rajdhani', 'Exo 2', sans-serif;
  font-weight: 600;
  letter-spacing: 0.05em;
}
```

### 4.2 Earth Alliance Interface

| Element | Font Style |
|---------|------------|
| Headers | Bold condensed |
| Body | Standard sans-serif |
| Warnings | Heavy, uppercase |

---

## 5. Post Disaster Typography (IBO)

### 5.1 Gjallarhorn Interface

Industrial, military aesthetic.

| Property | Value |
|----------|-------|
| **Display** | Industry, DIN Condensed |
| **Body** | Roboto |
| **Technical** | Roboto Mono |

**CSS Implementation:**
```css
.ibo-interface {
  font-family: 'Industry', 'DIN Condensed', 'Oswald', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

### 5.2 Tekkadan Interface

More rugged, makeshift aesthetic.

| Property | Value |
|----------|-------|
| **Primary** | Bold industrial sans |
| **Warning Labels** | Stencil style |
| **Color** | `#FF8800` (orange accent) |

---

## 6. Recommended Web Font Stack

### 6.1 Primary (Kirakira Project)

Based on analysis of Gundam aesthetics and web compatibility:

```css
:root {
  /* Display/Titles - Futuristic feel */
  --font-display: 'Orbitron', 'Exo 2', 'Rajdhani', sans-serif;
  
  /* Primary Body - Clean, readable */
  --font-primary: 'Inter', 'Roboto', 'Noto Sans', system-ui, sans-serif;
  
  /* Monospace - Technical data */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace;
  
  /* Japanese Support */
  --font-jp: 'Noto Sans JP', 'Yu Gothic', 'Meiryo', sans-serif;
  
  /* Korean Support */
  --font-kr: 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}
```

### 6.2 Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@400;500;700;900&family=Noto+Sans+JP:wght@300;400;500;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
```

---

## 7. Typography Scale

### 7.1 Recommended Size Scale

| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 0.75rem (12px) | Captions, labels |
| `--text-sm` | 0.875rem (14px) | Secondary text |
| `--text-base` | 1rem (16px) | Body text |
| `--text-lg` | 1.125rem (18px) | Emphasized body |
| `--text-xl` | 1.25rem (20px) | Small headings |
| `--text-2xl` | 1.5rem (24px) | H4 headings |
| `--text-3xl` | 1.875rem (30px) | H3 headings |
| `--text-4xl` | 2.25rem (36px) | H2 headings |
| `--text-5xl` | 3rem (48px) | H1 headings |
| `--text-6xl` | 3.75rem (60px) | Display titles |

### 7.2 Weight Scale

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-thin` | 100 | Decorative |
| `--font-light` | 300 | Body, subtle |
| `--font-regular` | 400 | Default body |
| `--font-medium` | 500 | Emphasized |
| `--font-semibold` | 600 | Subheadings |
| `--font-bold` | 700 | Headings |
| `--font-black` | 900 | Display |

---

## 8. Effect-Specific Typography

### 8.1 GN Particle Display

| Property | Value |
|----------|-------|
| Font | Orbitron |
| Weight | 700 |
| Color | `#00FF88` |
| Effect | Subtle glow |

```css
.gn-display {
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  color: #00FF88;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}
```

### 8.2 Newtype Flash Display

| Property | Value |
|----------|-------|
| Font | Orbitron |
| Weight | 500 |
| Color | `#FF00FF` |
| Effect | Rainbow gradient option |

```css
.newtype-display {
  font-family: 'Orbitron', sans-serif;
  font-weight: 500;
  background: linear-gradient(90deg, #FF00FF, #00FFFF, #FF00FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 8.3 Trans-Am Display

| Property | Value |
|----------|-------|
| Font | Exo 2 |
| Weight | 700 |
| Color | `#FF0044` |
| Effect | Pulsing glow |

```css
.trans-am-display {
  font-family: 'Exo 2', sans-serif;
  font-weight: 700;
  color: #FF0044;
  animation: trans-am-text-pulse 1.5s infinite;
}

@keyframes trans-am-text-pulse {
  0%, 100% { text-shadow: 0 0 10px rgba(255, 0, 68, 0.5); }
  50% { text-shadow: 0 0 20px rgba(255, 0, 68, 0.8), 0 0 40px rgba(255, 0, 68, 0.4); }
}
```

---

## References
- MechaTalk Forum - Gundam Font Identification
- FontStruct Community - A-Mun Celestial
- Maniackers Design - Synapse Font
- Google Fonts - Open Source Alternatives
