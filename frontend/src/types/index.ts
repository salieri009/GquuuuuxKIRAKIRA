/**
 * 공통 타입 정의
 */

// === 기본 타입들 ===
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// === Effect 관련 타입들 ===
export interface EffectParameter {
  type: 'slider' | 'color' | 'toggle' | 'select';
  value: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface Effect {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  relatedGundam: string[];
  category: 'particles' | 'energy' | 'weapons' | 'environment';
  defaultParams: Record<string, EffectParameter>;
}

export interface EffectState {
  effects: Effect[];
  selectedEffect: Effect | null;
  currentParams: Record<string, EffectParameter>;
  status: LoadingStatus;
  error: string | null;
  lastFetchTime: number;
}

// === UI 관련 타입들 ===
export interface UIState {
  isInfoPanelVisible: boolean;
  isLibraryVisible: boolean;
  isControlsVisible: boolean;
  isFullscreen: boolean;
  isMobile: boolean;
  theme: 'dark' | 'light' | 'high-contrast';
  prefersReducedMotion: boolean;
  glowEffects: boolean;
  backgroundParticles: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration: number;
  visible: boolean;
}

export interface ModalState {
  visible: boolean;
  component: string | null;
  props: Record<string, any>;
}

// === Preset 관련 타입들 ===
export interface Preset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  globalParams: Record<string, any>;
  effectOverrides?: Record<string, Record<string, any>>;
}

// === Three.js 관련 타입들 ===
export interface EffectObjects {
  [key: string]: any; // Three.js 객체들
}

export interface EffectModule {
  init: (scene: any, params: Record<string, any>) => Promise<EffectObjects>;
  animate: (objects: EffectObjects, params: Record<string, any>, deltaTime: number) => void;
  dispose: (scene: any, objects: EffectObjects) => void;
  metadata?: {
    name: string;
    description: string;
    category: string;
    performance: 'low' | 'medium' | 'high';
  };
}

// === 성능 관련 타입들 ===
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

// === 컴포넌트 Props 타입들 ===
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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

// === 에러 관련 타입들 ===
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  component?: string;
}

// === 설정 관련 타입들 ===
export interface AppSettings {
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
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

// === 유틸리티 타입들 ===
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// === 이벤트 핸들러 타입들 ===
export type EventHandler<T = void> = (event: React.SyntheticEvent) => T;
export type ChangeHandler<T> = (value: T) => void;
export type ClickHandler = EventHandler<void>;

// === API 관련 타입들 ===
export interface ApiClient {
  get<T = any>(url: string, params?: Record<string, any>): Promise<T>;
  post<T = any>(url: string, data?: any): Promise<T>;
  put<T = any>(url: string, data?: any): Promise<T>;
  delete<T = any>(url: string): Promise<T>;
}

export interface CacheManager {
  get<T = any>(key: string): T | null;
  set<T = any>(key: string, data: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  cleanup(): void;
}
