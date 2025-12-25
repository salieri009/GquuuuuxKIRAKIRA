# RES-001: Universal Century Visual Effects Research

## Overview
Comprehensive visual design research for Universal Century (宇宙世紀/UC) timeline effects implemented in the Kirakira project. The UC timeline spans from UC 0001 to UC 0223 and includes the original Mobile Suit Gundam and its direct sequels.

## Justification
> **Why this document exists:** The Universal Century is the foundational timeline of the Gundam franchise, containing the most iconic visual effects (Minovsky particles, Newtype Flash, Psycho-Frame). This research ensures accurate color reproduction and animation timing based on official source material, enabling developers to implement effects that resonate with franchise authenticity.

---

## Table of Contents
1. [Minovsky Particle System](#1-minovsky-particle-system)
2. [Newtype Flash Phenomenon](#2-newtype-flash-phenomenon)
3. [Psycho-Frame Technology](#3-psycho-frame-technology)
4. [Related Mobile Suits](#4-related-mobile-suits)
5. [Animation Reference](#5-animation-reference)

---

## 1. Minovsky Particle System

### 1.1 Lore & Background

**First Appearance:** Mobile Suit Gundam (1979)  
**Inventor:** Dr. Y.T. Minovsky (UC 0065)  
**Discovery Location:** Side 3 (Principality of Zeon)

Minovsky Particles are elementary particles discovered in UC 0065 that revolutionized warfare and technology in the Universal Century. They interfere with electromagnetic radiation, making radar and long-range communications unreliable—forcing mobile suit combat into visual range.

### 1.2 Visual Characteristics

| Property | Value | Notes |
|----------|-------|-------|
| **Primary Color** | `#00AAFF` | Light azure blue |
| **Secondary Color** | `#0088DD` | Deeper blue for density |
| **Interference Tint** | `#FF6666` | Reddish distortion on sensors |
| **Opacity Range** | 0.05 - 0.40 | Subtle atmospheric effect |
| **Visibility** | Near-invisible | Only seen on sensors or high density |

### 1.3 Color Palette

```css
/* Minovsky Particle Colors */
--minovsky-primary: #00AAFF;
--minovsky-secondary: #0088DD;
--minovsky-interference: rgba(255, 102, 102, 0.3);
--minovsky-fog: rgba(0, 170, 255, 0.08);
--minovsky-glow: 0 0 15px rgba(0, 170, 255, 0.4);
```

### 1.4 Visual Effects

**Minovsky Effect (Sensor Disruption):**
- Radar displays show static/noise
- Infrared sensors become unreliable
- Communications cut intermittently
- Visible light appears slightly "fogged"

**I-Field (Concentrated Particles):**
- Visible barrier when beam weapons contact
- Hexagonal honeycomb pattern
- Color: Bright cyan `#00FFFF`

### 1.5 Animation Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Density | 0.3 | 0.1-1.0 | Particle concentration |
| Turbulence | 0.5 | 0.1-2.0 | Random motion intensity |
| Color | `#00AAFF` | - | Base particle color |
| Opacity | 0.7 | 0.1-1.0 | Transparency level |

### 1.6 Series Appearances

| Series | Year | Notable Usage |
|--------|------|---------------|
| Mobile Suit Gundam | 1979 | First introduction |
| Zeta Gundam | 1985 | I-Field barriers |
| Char's Counterattack | 1988 | Axis shock scene |
| Gundam Unicorn | 2010 | Enhanced visuals |
| Gundam NT | 2018 | Psycho-Field interaction |

---

## 2. Newtype Flash Phenomenon

### 2.1 Lore & Background

**First Appearance:** Mobile Suit Gundam (1979)  
**Associated Characters:** Amuro Ray, Lalah Sune, Char Aznable, Kamille Bidan

Newtypes are evolved humans with heightened spatial awareness and empathic abilities. The "Newtype Flash" is a visual representation of their awakening or psychic connection with others.

### 2.2 Visual Characteristics

| Element | Primary Color | Secondary | Notes |
|---------|---------------|-----------|-------|
| **Core Flash** | `#FF00FF` | `#FF66FF` | Magenta center burst |
| **Ripple Edge** | `#00FFFF` | `#66FFFF` | Cyan expanding rings |
| **Warning Flash** | `#FFD700` | `#FFAA00` | Gold for danger sense |
| **Full Awakening** | Rainbow gradient | - | Spectrum shift |

### 2.3 Color Palette

```css
/* Newtype Flash Colors */
--newtype-primary: #FF00FF;
--newtype-secondary: #00FFFF;
--newtype-warning: #FFD700;
--newtype-glow: 0 0 40px rgba(255, 0, 255, 0.6);
--newtype-glow-strong: 0 0 60px rgba(255, 0, 255, 0.8), 0 0 100px rgba(0, 255, 255, 0.4);

/* Rainbow Awakening Gradient */
--newtype-rainbow: linear-gradient(
  90deg,
  #FF0000 0%,
  #FF8000 14%,
  #FFFF00 28%,
  #00FF00 42%,
  #00FFFF 57%,
  #0000FF 71%,
  #FF00FF 85%,
  #FF0080 100%
);
```

### 2.4 Flash Types

**Type 1: Recognition Flash**
- Occurs when Newtypes sense each other
- Quick burst, single ripple
- Duration: 0.3s
- Color: Magenta `#FF00FF`

**Type 2: Danger Sense**
- Warning of incoming threat
- Pulsing with urgency
- Duration: 0.5s repeating
- Color: Gold `#FFD700`

**Type 3: Full Awakening**
- Major character development moment
- Multiple expanding ripples
- Rainbow spectrum
- Duration: 2-3s

**Type 4: Connection Flash**
- Psychic link between Newtypes
- Dual-point origin
- Connecting beam/stream
- Color: Cyan-Magenta gradient

### 2.5 Animation Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Intensity | 0.8 | 0.1-2.0 | Brightness multiplier |
| Ripples | 3 | 1-10 | Concentric ring count |
| Color | `#FF00FF` | - | Base flash color |
| Frequency | 1.0 | 0.1-3.0 | Pulse rate |

### 2.6 Animation Keyframes

```css
@keyframes newtype-flash {
  0% {
    transform: scale(0.5);
    opacity: 1;
    box-shadow: 0 0 20px #FF00FF;
  }
  50% {
    transform: scale(2);
    opacity: 0.7;
    box-shadow: 0 0 60px #FF00FF, 0 0 100px #00FFFF;
  }
  100% {
    transform: scale(3);
    opacity: 0;
    box-shadow: 0 0 100px transparent;
  }
}

@keyframes newtype-ripple {
  0% {
    transform: scale(0);
    opacity: 1;
    border-width: 4px;
  }
  100% {
    transform: scale(4);
    opacity: 0;
    border-width: 1px;
  }
}
```

---

## 3. Psycho-Frame Technology

### 3.1 Lore & Background

**First Appearance:** Char's Counterattack (1988)  
**Developer:** Anaheim Electronics  
**Full Deployment:** Gundam Unicorn (2010)

Psycho-Frame is a technology that incorporates microscopic Psycommu receptors directly into the mobile suit's armor frame. It amplifies the pilot's brainwaves, allowing unprecedented control and, at high resonance levels, seemingly supernatural effects.

### 3.2 Visual States

| State | Color | Hex Code | Description |
|-------|-------|----------|-------------|
| Dormant | Dark Red | `#660000` | Unpowered, hidden |
| Active | Bright Red | `#FF4444` | Standard operation |
| Overload | Orange-Red | `#FF6600` | High stress/damage |
| Resonance | Pink | `#FFB6C1` | Multiple psycho-frames |
| Awakened | Green | `#00FF88` | Unicorn Full Armor |

### 3.3 Color Palette

```css
/* Psycho-Frame Colors */
--psycho-dormant: #660000;
--psycho-active: #FF4444;
--psycho-overload: #FF6600;
--psycho-resonance: #FFB6C1;
--psycho-awakened: #00FF88;

/* Glow Effects */
--psycho-glow: 0 0 20px rgba(255, 68, 68, 0.6);
--psycho-glow-strong: 0 0 40px rgba(255, 68, 68, 0.8), 0 0 80px rgba(255, 68, 68, 0.4);
--psycho-glow-green: 0 0 30px rgba(0, 255, 136, 0.7);
```

### 3.4 NT-D Mode (Unicorn Gundam)

**Newtype Destroyer Mode Transformation:**

| Part | Unicorn Mode | Destroy Mode |
|------|--------------|--------------|
| Armor | White `#FFFFFF` | Split/Exposed |
| Psycho-Frame | Hidden | Red `#FF0044` |
| V-Fin | Gold `#FFD700` | Gold (split open) |
| Camera | Green `#00FF00` | Orange `#FF6600` |

**Awakened Mode (Green Psycho-Frame):**

| Part | Color | Hex |
|------|-------|-----|
| Psycho-Frame | Emerald | `#00FF88` |
| Glow | Light Green | `#88FFBB` |
| Particles | Green sparkle | `#00FF66` |

### 3.5 Animation Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Field Strength | 1.2 | 0.5-3.0 | Energy intensity |
| Geometry | 6 | 3-12 | Polygon sides |
| Color | `#FF4444` | - | Base field color |
| Rotation | 0.5 | 0.0-2.0 | Spin speed |

### 3.6 Visual Effects

**Psycho-Field Barrier:**
- Geometric barrier formation
- Hexagonal or polygonal pattern
- Visible energy crackling
- Protects against physical and beam attacks

**Axis Shock Effect (CCA):**
- Massive psycho-field expansion
- Green aurora-like particles
- Reality distortion visual

---

## 4. Related Mobile Suits

### 4.1 RX-78-2 Gundam (First Gundam)

| Part | Color | Hex Code |
|------|-------|----------|
| Torso/Limbs | White | `#FFFFFF` |
| Chest Vents | Red | `#CC0000` |
| Lower Torso | Blue | `#0055AA` |
| V-Fin | Yellow | `#FFD700` |
| Camera | Green | `#00FF00` |

### 4.2 RX-93 ν Gundam (Nu Gundam)

| Part | Color | Hex Code |
|------|-------|----------|
| Primary | Off-White | `#F8F8F8` |
| Secondary | Dark Navy | `#1A1A4E` |
| Accents | Yellow | `#FFD700` |
| Fin Funnels | Navy | `#0A0A3E` |
| Psycho-Frame | Green (hidden) | `#00FF88` |

### 4.3 RX-0 Unicorn Gundam

| Mode | Armor | Frame | V-Fin |
|------|-------|-------|-------|
| Unicorn | `#FFFFFF` | `#2A2A2A` | `#FFD700` |
| Destroy | `#FFFFFF` | `#FF4444` | `#FFD700` |
| Awakened | `#FFFFFF` | `#00FF88` | `#FFD700` |

### 4.4 MSN-04 Sazabi

| Part | Color | Hex Code |
|------|-------|----------|
| Primary | Crimson Red | `#CC0000` |
| Secondary | Dark Red | `#990000` |
| Thrusters | Yellow | `#FFD700` |
| Camera | Green | `#00FF00` |

### 4.5 MRX-010 Psycho Gundam Mk-II

| Part | Color | Hex Code |
|------|-------|----------|
| Primary | Black | `#1A1A1A` |
| Secondary | Maroon | `#660033` |
| Psycho-Frame | Red (visible) | `#FF4444` |

---

## 5. Animation Reference

### 5.1 Timing Guidelines

| Effect | Duration | Easing |
|--------|----------|--------|
| Minovsky Drift | 2-4s loop | ease-in-out |
| Newtype Flash | 0.3s + 1s fade | ease-out |
| Psycho-Frame Pulse | 2s loop | ease-in-out |
| NT-D Transformation | 3s | ease-in-out |
| Full Awakening | 3-5s | linear with peaks |

### 5.2 Sound Design Notes

| Effect | Sound Character |
|--------|-----------------|
| Minovsky | Low hum, static crackle |
| Newtype Flash | High-pitched chime, ethereal |
| Psycho-Frame | Deep resonance, mechanical hum |

---

## References
- Mobile Suit Gundam (1979-1980) - Yoshiyuki Tomino
- Mobile Suit Zeta Gundam (1985-1986)
- Char's Counterattack (1988) - Film
- Mobile Suit Gundam Unicorn (2010-2014) - OVA
- Gundam NT (Narrative) (2018) - Film
- Official Gundam Mechanics & World documentation
