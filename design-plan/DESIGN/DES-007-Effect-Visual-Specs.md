# DES-007: Effect Visual Specifications

## Overview
Detailed visual specifications for each 3D effect in the Kirakira project, including colors, parameters, and implementation notes.

---

## 1. GN Particles

**Source:** Mobile Suit Gundam 00  
**Related Mobile Suits:** Gundam Exia, 00 Gundam, 00 Qan[T]

### 1.1 Visual Properties

| Property | Default | Min | Max | Step |
|----------|---------|-----|-----|------|
| Particle Count | 1000 | 100 | 3000 | 100 |
| Speed | 0.5 | 0.1 | 2.0 | 0.1 |
| Size | 0.02 | 0.01 | 0.1 | 0.01 |

### 1.2 Color

| Property | Value |
|----------|-------|
| Primary Color | `#00FF88` |
| Glow Color | `rgba(0, 255, 136, 0.6)` |
| Glow Radius | 15-30px blur |

### 1.3 Behavior

- Upward floating motion with sine wave drift
- Fade in from 0 opacity, fade out before despawn
- Size variation: 0.8x to 1.2x of base size
- Soft point sprite rendering

### 1.4 CSS Variables

```css
--gn-color: #00FF88;
--gn-glow: 0 0 20px rgba(0, 255, 136, 0.6);
--gn-speed: 0.5;
```

---

## 2. Minovsky Particles

**Source:** Universal Century Timeline  
**Related Mobile Suits:** RX-78-2, Nu Gundam, Unicorn Gundam

### 2.1 Visual Properties

| Property | Default | Min | Max | Step |
|----------|---------|-----|-----|------|
| Density | 0.3 | 0.1 | 1.0 | 0.1 |
| Turbulence | 0.5 | 0.1 | 2.0 | 0.1 |
| Opacity | 0.7 | 0.1 | 1.0 | 0.1 |

### 2.2 Color

| Property | Value |
|----------|-------|
| Primary Color | `#00AAFF` |
| Interference | `rgba(255, 102, 102, 0.3)` |
| Fog Effect | `rgba(0, 170, 255, 0.1)` |

### 2.3 Behavior

- Brownian motion with random direction changes
- Sensor interference visual noise overlay
- Lower visibility = higher particle density
- Volumetric fog-like rendering

### 2.4 CSS Variables

```css
--minovsky-color: #00AAFF;
--minovsky-interference: rgba(255, 102, 102, 0.3);
--minovsky-density: 0.3;
```

---

## 3. Newtype Flash

**Source:** Universal Century Timeline  
**Related Mobile Suits:** All Newtype-piloted units

### 3.1 Visual Properties

| Property | Default | Min | Max | Step |
|----------|---------|-----|-----|------|
| Intensity | 0.8 | 0.1 | 2.0 | 0.1 |
| Ripple Count | 3 | 1 | 10 | 1 |
| Frequency | 1.0 | 0.1 | 3.0 | 0.1 |

### 3.2 Color

| Property | Value |
|----------|-------|
| Primary | `#FF00FF` |
| Secondary | `#00FFFF` |
| Tertiary | `#FFD700` |
| Rainbow Mode | Gradient spectrum |

### 3.3 Behavior

- Radial ripple expansion from center
- Multiple concentric rings
- Rainbow gradient option for full awakening
- Burst → Fade animation cycle

### 3.4 CSS Variables

```css
--newtype-primary: #FF00FF;
--newtype-secondary: #00FFFF;
--newtype-glow: 0 0 40px rgba(255, 0, 255, 0.6);
```

---

## 4. Psycho Field

**Source:** Universal Century Timeline  
**Related Mobile Suits:** Nu Gundam, Sazabi, Psycho Gundam

### 4.1 Visual Properties

| Property | Default | Min | Max | Step |
|----------|---------|-----|-----|------|
| Field Strength | 1.2 | 0.5 | 3.0 | 0.1 |
| Geometry Sides | 6 | 3 | 12 | 1 |
| Rotation Speed | 0.5 | 0.0 | 2.0 | 0.1 |

### 4.2 Color

| Property | Value |
|----------|-------|
| Active | `#FF4444` |
| Overload | `#FF6600` |
| Dormant | `#660000` |
| Resonance | `#FFB6C1` |

### 4.3 Behavior

- Geometric polygon barrier formation
- Slow rotation in 3D space
- Pulse effect on intensity changes
- Energy crack lines on overload

### 4.4 CSS Variables

```css
--psycho-active: #FF4444;
--psycho-overload: #FF6600;
--psycho-glow: 0 0 30px rgba(255, 68, 68, 0.6);
```

---

## 5. Trans-Am

**Source:** Mobile Suit Gundam 00  
**Related Mobile Suits:** Exia, 00 Raiser, 00 Qan[T]

### 5.1 Visual Properties

| Property | Default | Min | Max | Step |
|----------|---------|-----|-----|------|
| Power | 2.0 | 1.0 | 5.0 | 0.2 |
| Heat | 0.8 | 0.3 | 1.5 | 0.1 |
| Afterglow | 1.5 | 0.5 | 3.0 | 0.1 |

### 5.2 Color

| Property | Value |
|----------|-------|
| Primary | `#FF0044` |
| Afterimage | `#FF1493` |
| Burst Core | `#FFFFFF` |
| Particles | `#FF69B4` |

### 5.3 Behavior

- Intense red particle emission
- Afterimage trails on movement
- Global scene tint shift to red
- Increased particle velocity and count

### 5.4 CSS Variables

```css
--trans-am-primary: #FF0044;
--trans-am-afterimage: #FF1493;
--trans-am-glow: 0 0 40px rgba(255, 0, 68, 0.7);
```

---

## 6. Parameter Control Mapping

### 6.1 Control Types

| Type | UI Element | Example |
|------|------------|---------|
| `slider` | Neon Slider | Speed, Density |
| `color` | Color Picker | Primary Color |
| `toggle` | Switch Button | Show/Hide |
| `select` | Dropdown | Geometry Type |

### 6.2 Parameter Schema

```typescript
interface EffectParam {
  type: 'slider' | 'color' | 'toggle' | 'select';
  value: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}
```

---

## 7. Three.js Implementation Notes

### 7.1 Particle Systems

- Use `THREE.Points` with `THREE.BufferGeometry`
- Custom shaders for glow and soft particles
- Instanced rendering for high particle counts

### 7.2 Post-Processing

- Bloom pass for glow effects
- Color grading for Trans-Am tint
- Motion blur for afterimages

### 7.3 Performance Targets

| Metric | Target |
|--------|--------|
| Frame Rate | 60 FPS |
| Max Particles | 5000 |
| Draw Calls | < 20 |
