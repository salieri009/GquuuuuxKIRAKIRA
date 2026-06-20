/**
 * Shared effect domain types (web + api)
 */

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type EffectParameterType = 'slider' | 'color' | 'toggle' | 'select';

export interface EffectParameter {
  type: EffectParameterType;
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
  category?: 'particles' | 'energy' | 'weapons' | 'environment';
  defaultParams: Record<string, EffectParameter>;
}

export interface EffectObjects {
  [key: string]: unknown;
}

export interface EffectModuleMetadata {
  name: string;
  description: string;
  version?: string;
  category?: string;
  tags?: string[];
  performance?: 'low' | 'medium' | 'high';
}
