<div align="center">

![Kirakira Header](https://capsule-render.vercel.app/api?type=waving&color=0:00FFFF,100:FF00FF&height=200&section=header&text=Kirakira&fontSize=80&fontColor=ffffff&fontAlignY=35&desc=Interactive%203D%20Gundam%20Effects%20Viewer&descAlignY=65&descSize=24&animation=fadeIn)

**Technical Sophistication Meets User-Friendly Design**

Language: [🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | [🇯🇵 日本語](README.ja.md)

---

## 📋 Project Information

**Project**: Kirakira - Interactive 3D Gundam Effects Viewer  
**Type**: Web Application  
**Technology**: React 18 + TypeScript + Three.js + Vite

</div>

---

## 🚀 Overview

A modern web application that brings iconic visual effects from the Gundam series to life using Three.js. Experience GN Particles, Newtype Flash, Minovsky Particles, and more in an interactive 3D environment.

---

## ✨ Key Features

- **🎭 3D Effect Viewer**: Real-time rendering of legendary Gundam visual effects
- **🎮 Interactive Controls**: Adjust parameters in real-time and observe changes
- **📱 Responsive Design**: Optimized experience on desktop and mobile
- **🎨 Futuristic UI**: Sleek, clean design inspired by Gundam aesthetics
- **⚡ High Performance**: Optimized rendering with Vite code splitting
- **🌙 Dark Theme**: Eye-friendly dark theme with neon accents
- **♿ Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

---

## 🎯 Project Objectives

- ✅ Implement interactive 3D effects using Three.js
- ✅ Demonstrate React 18 + TypeScript proficiency
- ✅ Apply layered SPA architecture with Zustand state management
- ✅ Create intuitive and modern user interface
- ✅ Ensure accessibility compliance
- ✅ Optimize for performance and user experience

---

## 🏃 Quick Start

### Prerequisites

- **Node.js** 16+ installed
- **npm** 9+ or **yarn** 1.22+ installed
- **Internet connection** for dependencies

### Installation & Setup

1. **Clone the Repository**  
```bash
git clone <repository-url>
cd GundamKiraKIra
```

2. **Install Dependencies**  
```bash
npm install
```

3. **Run Development Server**  
```bash
npm run dev          # web → http://localhost:5173
npm run dev:api      # api → http://localhost:3001 (optional)
```

4. **Access the Application**  
```
http://localhost:5173
```

### Build & Preview

```bash
npm run build --workspace=@kirakira/web
npm run preview --workspace=@kirakira/web
```

---

## 📁 Project Structure

```
GundamKiraKIra/
├── packages/
│   ├── contracts/            # @kirakira/contracts — shared DTOs
│   └── catalog/              # @kirakira/catalog — effects.json
├── apps/
│   ├── web/                  # @kirakira/web — React + Vite SPA
│   │   └── src/
│   │       ├── components/   # React components
│   │       ├── store/        # Zustand (uiStore, effectStore)
│   │       ├── effects/      # Three.js effect modules
│   │       ├── hooks/        # Custom React hooks
│   │       └── services/     # EffectService, apiClient
│   └── api/                  # @kirakira/api — Express REST API
├── ARCHITECTURE.md           # Monorepo architecture
├── AGENTS.md                 # Agent session instructions
├── design-plan/              # Design specifications
└── docs/                     # Development guides
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18**: Functional components with hooks
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics and WebGL rendering
- **Framer Motion**: Smooth animations
- **Vite**: Fast development and build tool

### Styling

- **CSS3**: Custom properties, modern styling
- **PostCSS**: CSS processing and optimization
- **Responsive Design**: Mobile-first approach

### Development Tools

- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Zustand**: Global UI and effect state
- **Vitest**: Unit testing

---

## 🎨 Implemented Effects

### 🌌 GN Particles
- **Series**: Gundam 00
- **Description**: High-energy particles emitted from GN Drives
- **Related Units**: Exia, 00 Gundam, Qan[T]

### ⚡ Newtype Flash
- **Series**: Universal Century
- **Description**: Intense golden flash during Newtype awakening
- **Related Units**: Nu Gundam, Unicorn Gundam

### 🔮 Minovsky Particles
- **Series**: Universal Century
- **Description**: Electromagnetic interference from Minovsky particles
- **Related Units**: All Mobile Suits

---

## 📚 Documentation

| Language | Documentation | Description |
| -------- | ------------- | ----------- |
| 🇰🇷 | [한국어](README.ko.md) | 한국어 전체 문서 |
| 🇺🇸 | [English](README.md) | Full documentation in English |
| 🇯🇵 | [日本語](README.ja.md) | 日本語完全ドキュメント |

### Design Specifications (`design-plan/`)

| Folder | Documents | Content |
|--------|-----------|----------|
| `RESEARCH/` | RES-001~004 | Visual research by timeline (UC/AD) |
| `DESIGN/` | DES-001~008 | Color system, typography, components |
| `SPECS/` | SPEC-001~004 | Architecture, API, build config |

### Technical Documentation (`design-plan/SPECS/`)

- [SPEC-001: System Architecture](design-plan/SPECS/SPEC-001-System-Architecture.md)
- [SPEC-002: Component Design](design-plan/SPECS/SPEC-002-Component-Design.md)
- [SPEC-003: API & Data Flow](design-plan/SPECS/SPEC-003-API-Data-Flow.md)
- [SPEC-004: Build Environment](design-plan/SPECS/SPEC-004-Build-Environment.md)

---

## 🎮 Usage

### Keyboard Shortcuts

- `Ctrl/Cmd + I`: Toggle info panel
- `Ctrl/Cmd + L`: Toggle library panel
- `Ctrl/Cmd + Enter`: Toggle fullscreen
- `Escape`: Close all panels

### Mouse/Touch Controls

- **Drag**: Rotate camera
- **Scroll**: Zoom in/out
- **Touch**: Mobile-optimized gestures

---

## 🧪 Testing

```bash
npm run verify                                    # full CI-equivalent check
npm run test --workspace=@kirakira/web -- --run
npm run type-check --workspace=@kirakira/web
npm run lint --workspace=@kirakira/web
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Standards

- Follow React + TypeScript conventions (see [AGENTS.md](AGENTS.md))
- Use ESLint and Prettier
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is developed for **educational purposes**. All code and documentation are intended for educational use only.

---

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:00FFFF,100:FF00FF&height=150&section=footer&text=Kirakira&fontSize=60&fontColor=ffffff&fontAlignY=50&animation=fadeIn)

<div align="center">

**Built with ❤️ for Gundam Enthusiasts**

⭐ Star this repository if you find it helpful! ⭐

</div>
