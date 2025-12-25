# DES-001: Project Overview

## 1. Project Name
**Kirakira** - Gundam Visual Effects Interactive Showcase

## 2. Project Goal
Create an interactive 3D web experience showcasing visual effects from the Gundam franchise using Three.js. Users can explore, customize, and interact with effects like GN Particles, Minovsky Particles, and Newtype Flash.

## Justification
> **Why this document exists:** Provides a single-source-of-truth overview for all stakeholders, aligning design, development, and research efforts toward a unified product vision.

## 3. Core Features

| Feature | Description |
|---------|-------------|
| **3D Effect Viewer** | Real-time Three.js rendering with orbital camera controls |
| **Effect Library** | Browsable catalog of Gundam-themed visual effects |
| **Interactive Controls** | Real-time parameter adjustment (color, density, speed) |
| **Info Panel** | Detailed lore and specifications for each effect |
| **Preset System** | Save and share custom effect configurations |

## 4. Technology Stack

| Layer | Technology |
|-------|------------|
| Build Tool | Vite |
| Framework | React 18 + TypeScript |
| 3D Library | Three.js |
| Animation | Framer Motion |
| State Management | React Context + Custom Hooks |
| Styling | CSS Variables + Tailwind CSS |

## 5. Design Philosophy

### 5.1 Visual Direction
- **Sleek, Futuristic, Clean** - Reflecting the sci-fi aesthetic of Gundam
- **Dark Theme** - Deep blacks with neon accents for eye comfort and content focus
- **Glass Morphism** - Translucent panels with subtle blur effects
- **Micro-Animations** - Smooth transitions and hover effects throughout

### 5.2 Accessibility
- WCAG 2.1 AA compliance target
- Reduced motion support (`prefers-reduced-motion`)
- High contrast theme option
- Keyboard navigation support

## 6. Related Documents

### Research
- [RES-001-Gundam-00-Visual-Design.md](./RESEARCH/RES-001-Gundam-00-Visual-Design.md)
- [RES-002-UC-Timeline-Visual-Design.md](./RESEARCH/RES-002-UC-Timeline-Visual-Design.md)
- [RES-003-Alternative-Universe-Design.md](./RESEARCH/RES-003-Alternative-Universe-Design.md)
- [RES-004-Typography-Reference.md](./RESEARCH/RES-004-Typography-Reference.md)

### Design Specifications
- [DES-002-Color-System.md](./DESIGN/DES-002-Color-System.md)
- [DES-003-Typography-System.md](./DESIGN/DES-003-Typography-System.md)
- [DES-004-Component-Library.md](./DESIGN/DES-004-Component-Library.md)
- [DES-005-Layout-System.md](./DESIGN/DES-005-Layout-System.md)
- [DES-006-Animation-Motion.md](./DESIGN/DES-006-Animation-Motion.md)
- [DES-007-Effect-Visual-Specs.md](./DESIGN/DES-007-Effect-Visual-Specs.md)
- [DES-008-Accessibility-Guidelines.md](./DESIGN/DES-008-Accessibility-Guidelines.md)

### Technical Specifications
- [SPEC-001-System-Architecture.md](./SPECS/SPEC-001-System-Architecture.md)
- [SPEC-002-Component-Design.md](./SPECS/SPEC-002-Component-Design.md)
- [SPEC-003-API-Data-Flow.md](./SPECS/SPEC-003-API-Data-Flow.md)
- [SPEC-004-Build-Environment.md](./SPECS/SPEC-004-Build-Environment.md)
