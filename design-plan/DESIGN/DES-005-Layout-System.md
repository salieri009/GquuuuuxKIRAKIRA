# DES-005: Layout System

## Overview
Spacing, container, and grid specifications for the Kirakira project.

---

## 1. Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--spacing-0` | 0 | 0px | Reset |
| `--spacing-1` | 0.25rem | 4px | Tight spacing |
| `--spacing-2` | 0.5rem | 8px | Small gaps |
| `--spacing-3` | 0.75rem | 12px | Compact padding |
| `--spacing-4` | 1rem | 16px | Default spacing |
| `--spacing-5` | 1.25rem | 20px | Medium padding |
| `--spacing-6` | 1.5rem | 24px | Card padding |
| `--spacing-8` | 2rem | 32px | Section spacing |
| `--spacing-10` | 2.5rem | 40px | Large gaps |
| `--spacing-12` | 3rem | 48px | Panel padding |
| `--spacing-16` | 4rem | 64px | Section breaks |
| `--spacing-20` | 5rem | 80px | Major sections |
| `--spacing-24` | 6rem | 96px | Hero spacing |
| `--spacing-32` | 8rem | 128px | Page margins |

---

## 2. Container Sizes

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--container-xs` | 20rem | 320px | Small modals |
| `--container-sm` | 24rem | 384px | Side panels |
| `--container-md` | 28rem | 448px | Dialogs |
| `--container-lg` | 32rem | 512px | Wide panels |
| `--container-xl` | 36rem | 576px | Content |
| `--container-2xl` | 42rem | 672px | Articles |
| `--container-3xl` | 48rem | 768px | Readable width |
| `--container-4xl` | 56rem | 896px | Wide content |
| `--container-5xl` | 64rem | 1024px | App max width |
| `--container-6xl` | 72rem | 1152px | Large screens |
| `--container-7xl` | 80rem | 1280px | Full width |

---

## 3. Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `--breakpoint-sm` | 640px | Mobile landscape |
| `--breakpoint-md` | 768px | Tablet |
| `--breakpoint-lg` | 1024px | Desktop |
| `--breakpoint-xl` | 1280px | Large desktop |
| `--breakpoint-2xl` | 1536px | Wide screens |

### 3.1 Media Query Usage

```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## 4. Component Dimensions

### 4.1 Header

| Property | Value |
|----------|-------|
| Height (Desktop) | `var(--header-height)` = 64px |
| Height (Mobile) | `var(--header-height-sm)` = 56px |
| Z-Index | `var(--z-sticky)` = 200 |

### 4.2 Sidebar

| Property | Value |
|----------|-------|
| Width (Expanded) | `var(--sidebar-width)` = 320px |
| Width (Collapsed) | `var(--sidebar-width-collapsed)` = 64px |

### 4.3 Panel

| Property | Value |
|----------|-------|
| Width (Default) | `var(--panel-width)` = 384px |
| Width (Compact) | `var(--panel-width-sm)` = 320px |

---

## 5. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-auto` | auto | Default stacking |
| `--z-0` | 0 | Base layer |
| `--z-10` | 10 | Slightly elevated |
| `--z-20` | 20 | Cards |
| `--z-30` | 30 | Overlapping elements |
| `--z-40` | 40 | Active states |
| `--z-50` | 50 | Raised content |
| `--z-dropdown` | 100 | Dropdown menus |
| `--z-sticky` | 200 | Sticky headers |
| `--z-fixed` | 300 | Fixed elements |
| `--z-modal-backdrop` | 400 | Modal backdrop |
| `--z-modal` | 500 | Modal content |
| `--z-popover` | 600 | Popovers |
| `--z-tooltip` | 700 | Tooltips |
| `--z-toast` | 800 | Notifications |
| `--z-max` | 9999 | Top priority |

---

## 6. Main Layout Structure

### 6.1 Desktop Layout

```
┌─────────────────────────────────────────────────┐
│ HEADER (64px height)                            │
├─────────────┬───────────────────────────────────┤
│             │                                   │
│  SIDEBAR    │        MAIN CONTENT               │
│  (320px)    │        (flex-1)                   │
│             │                                   │
│             ├───────────────────────────────────┤
│             │        CONTROLS PANEL             │
│             │        (auto height)              │
└─────────────┴───────────────────────────────────┘
```

### 6.2 Flex Layout Classes

```css
.layout-main {
  display: flex;
  height: calc(100vh - var(--header-height));
  gap: var(--spacing-4);
  padding: var(--spacing-4);
}

.layout-sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
}

.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.layout-canvas {
  flex: 1;
  min-height: 0;
}
```

---

## 7. Responsive Behavior

### 7.1 Mobile (< 768px)

- Sidebar becomes drawer (slides from left)
- Controls become bottom sheet
- Full-width canvas

### 7.2 Tablet (768px - 1024px)

- Collapsed sidebar option
- Stacked controls below canvas

### 7.3 Desktop (> 1024px)

- Full layout with sidebar
- Side-by-side controls

---

## 8. Grid System

### 8.1 Effect Library Grid

```css
.effect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-4);
}
```

### 8.2 Control Grid

```css
.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-6);
}
```
