/**
 * Frontend-only types. Domain DTOs live in @kirakira/contracts.
 */

import type {
  Effect,
  EffectParameter,
  LoadingStatus,
} from "@kirakira/contracts";

export type {
  LoadingStatus,
  EffectParameter,
  Effect,
  EffectObjects,
  ApiResponse,
} from "@kirakira/contracts";

export interface EffectState {
  effects: Effect[];
  selectedEffect: Effect | null;
  currentParams: Record<string, EffectParameter>;
  status: LoadingStatus;
  error: string | null;
  lastFetchTime: number;
}

// === UI ===
export interface UIState {
  isInfoPanelVisible: boolean;
  isLibraryVisible: boolean;
  isControlsVisible: boolean;
  isFullscreen: boolean;
  isMobile: boolean;
  theme: "dark" | "light" | "high-contrast";
  prefersReducedMotion: boolean;
  glowEffects: boolean;
  backgroundParticles: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration: number;
  visible: boolean;
}

export interface ModalState {
  visible: boolean;
  component: string | null;
  props: Record<string, unknown>;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  globalParams: Record<string, unknown>;
  effectOverrides?: Record<string, Record<string, unknown>>;
}

export interface PerformanceInfo {
  frameTime: number;
  effectCount: number;
  memoryUsage: {
    totalObjects: number;
    totalTriangles: number;
    estimatedMB: number;
  };
  lastUpdate: number;
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "glass" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface PanelProps {
  title?: string;
  visible?: boolean;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  component?: string;
}

export interface AppSettings {
  graphics: {
    quality: "low" | "medium" | "high" | "ultra";
    enableGlow: boolean;
    enableParticles: boolean;
    maxParticles: number;
    renderScale: number;
  };
  audio: {
    enabled: boolean;
    volume: number;
    effects: boolean;
  };
  controls: {
    sensitivity: number;
    invertY: boolean;
    touchEnabled: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalField<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type EventHandler<T = void> = (event: React.SyntheticEvent) => T;
export type ChangeHandler<T> = (value: T) => void;
export type ClickHandler = EventHandler<void>;

export interface ApiClient {
  get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T>;
  post<T = unknown>(url: string, data?: unknown): Promise<T>;
  put<T = unknown>(url: string, data?: unknown): Promise<T>;
  delete<T = unknown>(url: string): Promise<T>;
}

export interface CacheManager {
  get<T = unknown>(key: string): T | null;
  set<T = unknown>(key: string, data: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  cleanup(): void;
}
