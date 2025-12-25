# RES-002: Anno Domini (Gundam 00) Visual Effects Research

## Overview
Comprehensive visual design research for Anno Domini (西暦/A.D.) timeline effects from Mobile Suit Gundam 00. This alternate timeline features GN Technology as its core visual identity, distinct from the Universal Century's Minovsky technology.

## Justification
> **Why this document exists:** Gundam 00's GN Particle system and Trans-Am represent the most visually distinctive effects in this project. This research provides exact hex codes and animation specifications derived from official anime production guides, ensuring the signature green-to-red transformation is accurately implemented.

---

## Table of Contents
1. [GN Particle System](#1-gn-particle-system)
2. [Trans-Am System](#2-trans-am-system)
3. [GN Field & Defensive Systems](#3-gn-field--defensive-systems)
4. [Quantum System](#4-quantum-system)
5. [Related Mobile Suits](#5-related-mobile-suits)
6. [Animation Reference](#6-animation-reference)

---

## 1. GN Particle System

### 1.1 Lore & Background

**First Appearance:** Mobile Suit Gundam 00 Season 1 (2007)  
**Origin:** Developed by Celestial Being founder Aeolia Schenberg  
**Power Source:** GN Drive (Solar Furnace)

GN Particles are exotic particles produced by the GN Drive, a revolutionary power source that operates on unknown physical principles. These particles provide propulsion, can be used as weapons, and create distinctive visual effects that mark Celestial Being's mobile suits.

### 1.2 Particle Types by GN Drive

| Drive Type | Particle Color | Hex Code | Characteristics |
|------------|----------------|----------|-----------------|
| **Original GN Drive** | Green | `#00FF88` | Non-toxic, semi-permanent |
| **GN Drive Τ (Tau) Early** | Red | `#FF0000` | Toxic, beam-focused |
| **GN Drive Τ (Tau) Late** | Orange | `#FF8C00` | Non-toxic, standardized |
| **Alvatore Custom** | Gold | `#FFD700` | Cosmetic modification |
| **ELS Hybrid** | Purple | `#8B008B` | Alien assimilation |
| **Twin Drive (00)** | Intense Green | `#00FFAA` | Synchronized output |

### 1.3 Color Palette

```css
/* GN Particle Colors */
--gn-original: #00FF88;
--gn-original-glow: #00FFAA;
--gn-beam: #FF69B4;
--gn-tau-red: #FF0000;
--gn-tau-orange: #FF8C00;
--gn-gold: #FFD700;
--gn-els: #8B008B;
--gn-twin-drive: #00FFAA;

/* Glow Effects */
--gn-glow: 0 0 20px rgba(0, 255, 136, 0.6);
--gn-glow-strong: 0 0 30px rgba(0, 255, 136, 0.8), 0 0 60px rgba(0, 255, 136, 0.4);
```

### 1.4 Visual Characteristics

**Particle Appearance:**
- Individual specks of light
- Gentle upward float trajectory
- Soft point-sprite rendering
- Variable size (0.5-3px visual)
- Fade-in and fade-out lifecycle

**Particle Behavior:**
- Drift with slight sine wave motion
- Cluster around GN Drive location
- Increase density during thrust/combat
- Trail behind mobile suit in motion

### 1.5 Animation Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Count | 1000 | 100-3000 | Particle quantity |
| Speed | 0.5 | 0.1-2.0 | Float velocity |
| Color | `#00FF88` | - | Base particle color |
| Size | 0.02 | 0.01-0.1 | Particle size |

### 1.6 GN Beam Weapons

| Weapon Type | Beam Color | Hex Code |
|-------------|------------|----------|
| GN Rifle | Pink | `#FF69B4` |
| GN Sword (Beam Mode) | Cyan | `#00FFFF` |
| GN Cannon | Bright Pink | `#FF88AA` |
| GN Mega Launcher | White-Pink | `#FFCCDD` |

---

## 2. Trans-Am System

### 2.1 Lore & Background

**First Appearance:** Gundam 00 Episode 23 (2008)  
**Activation Requirement:** Original GN Drive only (later Tau compatible)  
**Effect Duration:** ~3 minutes (varies by unit)

Trans-Am releases all compressed GN Particles stored within the GN Drive, boosting the mobile suit's performance by 300% for a limited time. This causes a dramatic visual transformation from green particles to red.

### 2.2 Color Transformation

| Component | Normal State | Trans-Am State |
|-----------|--------------|----------------|
| GN Particles | Green `#00FF88` | Pink-Red `#FF1493` |
| White Armor | White `#FFFFFF` | Pink Tint `#FF69B4` |
| Blue Armor | Blue `#0066CC` | Burgundy `#8B0000` |
| Yellow Parts | Yellow `#FFD700` | Orange `#FF6600` |
| Overall Glow | Green Aura | Red Aura `#FF0044` |

### 2.3 Color Palette

```css
/* Trans-Am Colors */
--trans-am-primary: #FF0044;
--trans-am-secondary: #FF1493;
--trans-am-afterimage: #FF69B4;
--trans-am-core: #FFFFFF;
--trans-am-burst: #FF0088;

/* Glow Effects */
--trans-am-glow: 0 0 30px rgba(255, 0, 68, 0.6);
--trans-am-glow-strong: 0 0 40px rgba(255, 0, 68, 0.8), 0 0 80px rgba(255, 0, 68, 0.4);

/* Armor Tint Filter */
--trans-am-tint: sepia(1) saturate(5) hue-rotate(-50deg);
```

### 2.4 Trans-Am Stages

**Stage 1: Activation (0-0.5s)**
- Bright flash from GN Drives
- Color shift begins at core
- Particles transition green→pink
- Intensity: 150%

**Stage 2: Active (0.5s-3min)**
- Full red/pink particle emission
- Constant afterimage trails
- Pulsing glow effect
- Speed and power increased

**Stage 3: Burst Mode (Optional)**
- Trans-Am Burst (00 Raiser)
- Even more intense particle release
- Near-white center glow
- Maximum power output

**Stage 4: Deactivation (0-2s)**
- Particle color fades back to green
- Glow diminishes
- Performance returns to normal
- Brief vulnerability window

### 2.5 Animation Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Power | 2.0 | 1.0-5.0 | Output multiplier |
| Heat | 0.8 | 0.3-1.5 | Visual intensity |
| Color | `#FF0044` | - | Primary glow color |
| Afterglow | 1.5 | 0.5-3.0 | Trail persistence |

### 2.6 Animation Keyframes

```css
@keyframes trans-am-activate {
  0% {
    filter: hue-rotate(0deg) brightness(1);
    box-shadow: 0 0 10px #00FF88;
  }
  30% {
    filter: hue-rotate(-80deg) brightness(1.3);
    box-shadow: 0 0 30px #FF8800;
  }
  100% {
    filter: hue-rotate(-120deg) brightness(1.2);
    box-shadow: 0 0 40px #FF0044, 0 0 80px rgba(255, 0, 68, 0.5);
  }
}

@keyframes trans-am-pulse {
  0%, 100% {
    filter: brightness(1.1);
    box-shadow: 0 0 30px rgba(255, 0, 68, 0.6);
  }
  50% {
    filter: brightness(1.4);
    box-shadow: 0 0 50px rgba(255, 0, 68, 0.9), 0 0 100px rgba(255, 0, 68, 0.4);
  }
}

@keyframes trans-am-afterimage {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateX(-10px);
  }
}
```

---

## 3. GN Field & Defensive Systems

### 3.1 GN Field Types

| Type | Color | Pattern | Usage |
|------|-------|---------|-------|
| Standard GN Field | Green `#00FF88` | Hexagonal | Beam defense |
| Trans-Am GN Field | Red `#FF0044` | Solid | Enhanced defense |
| GN Shield Bits | Green trails | Point defense | Zabanya |

### 3.2 Visual Characteristics

```css
/* GN Field Colors */
--gn-field-standard: rgba(0, 255, 136, 0.4);
--gn-field-trans-am: rgba(255, 0, 68, 0.5);
--gn-field-border: rgba(0, 255, 255, 0.8);
```

**Field Appearance:**
- Translucent barrier
- Hexagonal grid pattern
- Ripple on impact
- Slight shimmer animation

---

## 4. Quantum System

### 4.1 Lore & Background

**First Appearance:** Gundam 00: A Wakening of the Trailblazer (2010)  
**Unique to:** 00 Qan[T]  
**Function:** Enables Quantum Teleportation and ELS communication

### 4.2 Visual Characteristics

| Element | Color | Hex Code |
|---------|-------|----------|
| Quantum Burst | Cyan | `#00FFFF` |
| Teleport Flash | White-Cyan | `#AAFFFF` |
| Quantum Field | Light Blue | `#88DDFF` |
| ELS Communication | Rainbow | Gradient |

### 4.3 Color Palette

```css
/* Quantum System Colors */
--quantum-primary: #00FFFF;
--quantum-burst: #AAFFFF;
--quantum-field: rgba(136, 221, 255, 0.5);
--quantum-glow: 0 0 40px rgba(0, 255, 255, 0.6), 0 0 80px rgba(0, 255, 255, 0.3);
```

---

## 5. Related Mobile Suits

### 5.1 GN-001 Gundam Exia

**Season 1 Protagonist Unit**

| Part | Color | Hex Code |
|------|-------|----------|
| Primary Armor | White | `#F5F5F5` |
| Secondary | Blue | `#0066CC` |
| Accent | Red | `#CC0000` |
| GN Condenser | Green (glow) | `#00FF88` |
| Eyes/Camera | Yellow | `#FFDD00` |
| Frame | Dark Gray | `#333333` |

**GN Sword Modes:**
- Blade Mode: Physical steel
- Beam Mode: Cyan `#00FFFF`

### 5.2 GN-0000+GNR-010 00 Raiser

**Season 2 Combined Unit**

| Part | Color | Hex Code |
|------|-------|----------|
| Primary Armor | White | `#FFFFFF` |
| Secondary | Blue | `#0055AA` |
| Accent | Red | `#DD0000` |
| Chest Orb | Green (glow) | `#00FF88` |
| O Raiser | Red/White | `#CC0000` / `#FFFFFF` |
| Twin Drive Glow | Intense Green | `#00FFAA` |

**Trans-Am Raiser:**
- All colors shift to red/pink spectrum
- Twin Drive creates double particle output
- Trans-Am Burst: White center explosion

### 5.3 GNT-0000 00 Qan[T]

**Movie Protagonist Unit**

| Part | Color | Hex Code |
|------|-------|----------|
| Primary Armor | White | `#FFFFFF` |
| Secondary | Light Blue | `#4499DD` |
| Accent | Green | `#00FF88` |
| Quantum System | Cyan | `#00FFFF` |
| GN Sword V | Blue/Cyan | `#0088CC` |

**Quantum Burst Mode:**
- Cyan particle expansion
- Rainbow shimmer during ELS dialogue
- Hexagonal quantum field

### 5.4 GN-002 Gundam Dynames / GN-006 Cherudim

| Part | Dynames | Cherudim |
|------|---------|----------|
| Primary | White `#F5F5F5` | White `#FFFFFF` |
| Secondary | Green `#00AA44` | Orange `#FF6600` |
| Accent | Orange `#FF8800` | Green `#00FF88` |
| Sniper Scope | Green `#00FF00` | Green `#00FF00` |

### 5.5 GNX Series (GN-X, Ahead, etc.)

**Mass Production Units**

| Generation | Particle Color | Hex |
|------------|----------------|-----|
| GN-X (S1) | Red | `#FF0000` |
| Ahead (S2) | Orange | `#FF8C00` |
| GN-XIV | Orange | `#FF8800` |

---

## 6. Animation Reference

### 6.1 Timing Guidelines

| Effect | Duration | Easing |
|--------|----------|--------|
| GN Particle Float | 2-4s | ease-in-out |
| Trans-Am Activation | 0.5s | ease-out |
| Trans-Am Sustained | 1.5s loop | linear |
| Trans-Am Burst | 0.3s flash | ease-out |
| GN Field Formation | 0.2s | ease-out |
| Quantum Burst | 0.5s | ease-out |

### 6.2 Particle Behavior

**Standard GN Emission:**
```javascript
{
  direction: 'upward',
  spread: 30, // degrees
  speed: 0.5,
  lifetime: 2000, // ms
  fadeIn: 200,
  fadeOut: 500
}
```

**Trans-Am Emission:**
```javascript
{
  direction: 'radial',
  spread: 360,
  speed: 1.5,
  lifetime: 1000,
  trail: true,
  trailLength: 5
}
```

### 6.3 Sound Design Notes

| Effect | Sound Character |
|--------|-----------------|
| GN Particles | Soft hum, "whoosh" |
| Trans-Am | Power-up whoosh, deep bass |
| Trans-Am Burst | Explosive "crack" |
| GN Field | Barrier shimmer |

---

## References
- Mobile Suit Gundam 00 Season 1 (2007-2008)
- Mobile Suit Gundam 00 Season 2 (2008-2009)
- Mobile Suit Gundam 00: A Wakening of the Trailblazer (2010)
- Gundam 00 Mechanics documentation
- Model Kit Color Guides (Bandai)
