# 07. 테스팅 환경 설정 가이드

## 1. 테스팅 전략 개요

### 1.1. 테스팅 피라미드
```
     /\
    /  \  E2E Tests (적음)
   /____\
  /      \  Integration Tests (중간)
 /________\
/__________\ Unit Tests (많음)
```

### 1.2. 테스트 유형별 역할
- **Unit Tests**: 개별 함수, 컴포넌트, 유틸리티 함수 테스트
- **Integration Tests**: 컴포넌트 간 상호작용, API 연동 테스트  
- **E2E Tests**: 실제 사용자 시나리오 테스트
- **Visual Tests**: UI 컴포넌트 스냅샷 테스트

### 1.3. 테스팅 도구 스택
- **Test Runner**: Vitest (빠르고 현대적)
- **Vue Testing**: @vue/test-utils
- **Mocking**: vi (Vitest 내장)
- **E2E**: Playwright (선택사항)
- **Linting**: ESLint + Prettier

## 2. 기본 테스팅 환경 설정

### 2.1. 의존성 설치

```bash
# 테스팅 프레임워크
npm install --save-dev vitest @vitest/ui

# Vue 테스팅 유틸리티
npm install --save-dev @vue/test-utils

# DOM 환境 및 유틸리티
npm install --save-dev jsdom @testing-library/jest-dom

# Three.js 테스팅 지원
npm install --save-dev jest-canvas-mock

# 커버리지 리포팅
npm install --save-dev @vitest/coverage-v8

# 선택사항: E2E 테스팅
npm install --save-dev @playwright/test
```

### 2.2. package.json 스크립트 설정

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

### 2.3. Vitest 설정 (vitest.config.js)

```javascript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  
  test: {
    // 테스트 환경 설정
    environment: 'jsdom',
    
    // 전역 설정
    globals: true,
    
    // 설정 파일
    setupFiles: ['./tests/setup.js'],
    
    // 커버리지 설정
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts',
        'src/mock/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    // 파일 패턴
    include: [
      'src/**/*.{test,spec}.{js,ts,vue}',
      'tests/**/*.{test,spec}.{js,ts}'
    ],
    
    // 타임아웃 설정
    testTimeout: 10000,
    hookTimeout: 10000
  },
  
  // 경로 별칭 (webpack.config.js와 동일하게)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  // 정적 파일 처리
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.json']
});
```

### 2.4. 테스트 설정 파일 (tests/setup.js)

```javascript
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Three.js Mock 설정
import 'jest-canvas-mock';

// WebGL Context Mock
global.WebGLRenderingContext = vi.fn(() => ({
  canvas: {
    width: 1024,
    height: 768,
    getContext: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  },
  drawArrays: vi.fn(),
  clearColor: vi.fn(),
  clear: vi.fn(),
  useProgram: vi.fn(),
  createProgram: vi.fn(),
  createShader: vi.fn(),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  getProgramParameter: vi.fn(() => true),
  getShaderParameter: vi.fn(() => true),
  enableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  uniform1f: vi.fn(),
  uniform2f: vi.fn(),
  uniform3f: vi.fn(),
  uniform4f: vi.fn(),
  uniformMatrix4fv: vi.fn()
}));

// WebGL2 Context Mock
global.WebGL2RenderingContext = global.WebGLRenderingContext;

// Canvas Mock 추가 설정
HTMLCanvasElement.prototype.getContext = vi.fn((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return new global.WebGLRenderingContext();
  }
  return null;
});

// ResizeObserver Mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// IntersectionObserver Mock
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// matchMedia Mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// requestAnimationFrame Mock
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));

// 브라우저 API Mock
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
});

// localStorage Mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// sessionStorage Mock
global.sessionStorage = localStorageMock;

// Console 경고 무시 (개발 중인 기능들)
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' && 
    (message.includes('Three.js') || 
     message.includes('WebGL') ||
     message.includes('[Vue warn]'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// 전역 테스트 헬퍼
global.testUtils = {
  // Three.js 객체 생성 헬퍼
  createMockThreeObject: () => ({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    add: vi.fn(),
    remove: vi.fn(),
    dispose: vi.fn()
  }),
  
  // 가짜 지연 함수
  delay: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // DOM 요소 생성
  createElement: (tag = 'div', attributes = {}) => {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    return element;
  }
};
```

## 3. 유닛 테스트 작성 가이드

### 3.1. Vue 컴포넌트 테스트

#### BaseButton.test.js
```javascript
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseButton from '@/components/ui/BaseButton.vue';

describe('BaseButton', () => {
  it('렌더링이 올바르게 된다', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'primary'
      },
      slots: {
        default: 'Click me'
      }
    });
    
    expect(wrapper.text()).toBe('Click me');
    expect(wrapper.classes()).toContain('btn--primary');
  });
  
  it('클릭 이벤트가 발생한다', async () => {
    const handleClick = vi.fn();
    const wrapper = mount(BaseButton, {
      props: {
        onClick: handleClick
      }
    });
    
    await wrapper.trigger('click');
    expect(handleClick).toHaveBeenCalledOnce();
  });
  
  it('disabled 상태일 때 클릭이 동작하지 않는다', async () => {
    const handleClick = vi.fn();
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true,
        onClick: handleClick
      }
    });
    
    await wrapper.trigger('click');
    expect(handleClick).not.toHaveBeenCalled();
    expect(wrapper.classes()).toContain('btn--disabled');
  });
  
  it('로딩 상태를 올바르게 표시한다', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true
      }
    });
    
    expect(wrapper.classes()).toContain('btn--loading');
    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });
  
  it('아이콘이 올바르게 표시된다', () => {
    const wrapper = mount(BaseButton, {
      props: {
        icon: 'search'
      },
      slots: {
        default: 'Search'
      }
    });
    
    expect(wrapper.find('.btn-icon').exists()).toBe(true);
    expect(wrapper.find('.btn-icon').text()).toBe('search');
  });
  
  // 접근성 테스트
  it('접근성 속성이 올바르게 설정된다', () => {
    const wrapper = mount(BaseButton, {
      props: {
        'aria-label': 'Close dialog',
        role: 'button'
      }
    });
    
    expect(wrapper.attributes('aria-label')).toBe('Close dialog');
    expect(wrapper.attributes('role')).toBe('button');
  });
  
  // 스냅샷 테스트
  it('스냅샷이 일치한다', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'primary',
        size: 'lg'
      },
      slots: {
        default: 'Primary Button'
      }
    });
    
    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

#### EffectCanvas.test.js
```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import EffectCanvas from '@/components/effects/EffectCanvas.vue';
import { useEffectStore } from '@/store/effectStore';

// Three.js 모듈 모킹
vi.mock('three', () => ({
  Scene: vi.fn(() => testUtils.createMockThreeObject()),
  PerspectiveCamera: vi.fn(() => testUtils.createMockThreeObject()),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setPixelRatio: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas')
  })),
  Color: vi.fn(() => ({ r: 0, g: 1, b: 1 }))
}));

// OrbitControls 모킹
vi.mock('three/examples/jsm/controls/OrbitControls', () => ({
  OrbitControls: vi.fn(() => ({
    enableDamping: true,
    dampingFactor: 0.05,
    update: vi.fn(),
    dispose: vi.fn()
  }))
}));

describe('EffectCanvas', () => {
  let wrapper;
  let effectStore;
  
  beforeEach(() => {
    wrapper = mount(EffectCanvas, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })]
      }
    });
    
    effectStore = useEffectStore();
  });
  
  afterEach(() => {
    wrapper?.unmount();
  });
  
  it('컴포넌트가 올바르게 마운트된다', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
  });
  
  it('로딩 상태를 올바르게 표시한다', async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });
  
  it('에러 상태를 올바르게 처리한다', async () => {
    wrapper.vm.error = '효과 로드 실패';
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.error-overlay').exists()).toBe(true);
    expect(wrapper.text()).toContain('효과 로드 실패');
  });
  
  it('다시 시도 버튼이 동작한다', async () => {
    wrapper.vm.error = '테스트 에러';
    await wrapper.vm.$nextTick();
    
    const retryButton = wrapper.find('.retry-button');
    expect(retryButton.exists()).toBe(true);
    
    const loadEffectSpy = vi.spyOn(wrapper.vm, 'loadEffect');
    await retryButton.trigger('click');
    
    expect(loadEffectSpy).toHaveBeenCalled();
  });
  
  it('선택된 효과가 변경될 때 새 효과를 로드한다', async () => {
    const loadEffectSpy = vi.spyOn(wrapper.vm, 'loadEffect');
    
    // 효과 변경 시뮬레이션
    effectStore.selectedEffect = {
      id: 'gnParticles',
      name: 'GN 입자'
    };
    
    await wrapper.vm.$nextTick();
    expect(loadEffectSpy).toHaveBeenCalledWith('gnParticles');
  });
  
  it('리사이즈 이벤트를 올바르게 처리한다', () => {
    const handleResizeSpy = vi.spyOn(wrapper.vm, 'handleResize');
    
    // 리사이즈 이벤트 발생
    window.dispatchEvent(new Event('resize'));
    
    expect(handleResizeSpy).toHaveBeenCalled();
  });
  
  it('컴포넌트 언마운트 시 리소스를 정리한다', () => {
    const cleanupSpy = vi.spyOn(wrapper.vm, 'cleanup');
    
    wrapper.unmount();
    
    expect(cleanupSpy).toHaveBeenCalled();
  });
});
```

### 3.2. 스토어 테스트

#### effectStore.test.js
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useEffectStore } from '@/store/effectStore';

// API 모킹
vi.mock('@/services/api', () => ({
  getEffects: vi.fn()
}));

describe('effectStore', () => {
  let store;
  
  beforeEach(() => {
    setActivePinia(createPinia());
    store = useEffectStore();
  });
  
  it('초기 상태가 올바르게 설정된다', () => {
    expect(store.effects).toEqual([]);
    expect(store.selectedEffect).toBeNull();
    expect(store.currentParams).toEqual({});
    expect(store.status).toBe('idle');
    expect(store.error).toBeNull();
  });
  
  it('효과를 올바르게 선택한다', () => {
    const mockEffect = {
      id: 'test-effect',
      name: 'Test Effect',
      defaultParams: {
        speed: { type: 'slider', value: 1, min: 0, max: 10 }
      }
    };
    
    store.effects = [mockEffect];
    store.selectEffect('test-effect');
    
    expect(store.selectedEffect).toEqual(mockEffect);
    expect(store.currentParams).toEqual(mockEffect.defaultParams);
  });
  
  it('존재하지 않는 효과 선택 시 경고를 출력한다', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    store.selectEffect('non-existent');
    
    expect(consoleSpy).toHaveBeenCalledWith('효과를 찾을 수 없습니다: non-existent');
    expect(store.selectedEffect).toBeNull();
    
    consoleSpy.mockRestore();
  });
  
  it('파라미터를 올바르게 업데이트한다', () => {
    store.selectedEffect = {
      id: 'test'
    };
    store.currentParams = {
      speed: { type: 'slider', value: 1, min: 0, max: 10 }
    };
    
    store.updateParam('speed', 5);
    
    expect(store.currentParams.speed.value).toBe(5);
  });
  
  it('슬라이더 파라미터 범위를 검증한다', () => {
    store.selectedEffect = { id: 'test' };
    store.currentParams = {
      speed: { type: 'slider', value: 5, min: 0, max: 10 }
    };
    
    // 최대값 초과
    store.updateParam('speed', 15);
    expect(store.currentParams.speed.value).toBe(10);
    
    // 최소값 미만
    store.updateParam('speed', -5);
    expect(store.currentParams.speed.value).toBe(0);
  });
  
  it('색상 파라미터 형식을 검증한다', () => {
    store.selectedEffect = { id: 'test' };
    store.currentParams = {
      color: { type: 'color', value: '#FF0000' }
    };
    
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    // 잘못된 색상 형식
    store.updateParam('color', 'invalid-color');
    expect(store.currentParams.color.value).toBe('#FF0000'); // 변경되지 않음
    expect(consoleSpy).toHaveBeenCalled();
    
    // 올바른 색상 형식
    store.updateParam('color', '#00FF00');
    expect(store.currentParams.color.value).toBe('#00FF00');
    
    consoleSpy.mockRestore();
  });
  
  it('파라미터를 기본값으로 리셋한다', () => {
    const mockEffect = {
      id: 'test',
      defaultParams: {
        speed: { type: 'slider', value: 1, min: 0, max: 10 },
        color: { type: 'color', value: '#FF0000' }
      }
    };
    
    store.selectedEffect = mockEffect;
    store.currentParams = {
      speed: { type: 'slider', value: 8, min: 0, max: 10 },
      color: { type: 'color', value: '#00FF00' }
    };
    
    store.resetParams();
    
    expect(store.currentParams.speed.value).toBe(1);
    expect(store.currentParams.color.value).toBe('#FF0000');
  });
  
  // Getter 테스트
  it('selectedParams getter가 올바르게 동작한다', () => {
    store.currentParams = {
      speed: { type: 'slider', value: 5 },
      color: { type: 'color', value: '#FF0000' },
      visible: { type: 'toggle', value: true }
    };
    
    const params = store.selectedParams;
    
    expect(params).toEqual({
      speed: 5,
      color: '#FF0000',
      visible: true
    });
  });
  
  it('isLoading getter가 올바르게 동작한다', () => {
    expect(store.isLoading).toBe(false);
    
    store.status = 'loading';
    expect(store.isLoading).toBe(true);
  });
  
  it('getEffectById getter가 올바르게 동작한다', () => {
    const effects = [
      { id: 'effect1', name: 'Effect 1' },
      { id: 'effect2', name: 'Effect 2' }
    ];
    
    store.effects = effects;
    
    expect(store.getEffectById('effect1')).toEqual(effects[0]);
    expect(store.getEffectById('effect2')).toEqual(effects[1]);
    expect(store.getEffectById('non-existent')).toBeUndefined();
  });
});
```

### 3.3. 유틸리티 함수 테스트

#### validators.test.js
```javascript
import { describe, it, expect } from 'vitest';
import {
  validateEffectData,
  validatePresetData,
  validateURL,
  validateFileSize
} from '@/services/validators';

describe('validators', () => {
  describe('validateEffectData', () => {
    it('유효한 효과 데이터를 검증한다', () => {
      const validData = [
        {
          id: 'test-effect',
          name: 'Test Effect',
          description: 'Test description',
          category: 'particles',
          defaultParams: {
            speed: { type: 'slider', value: 1, min: 0, max: 10 }
          }
        }
      ];
      
      expect(validateEffectData(validData)).toBe(true);
    });
    
    it('배열이 아닌 데이터를 거부한다', () => {
      const invalidData = { not: 'an array' };
      
      expect(validateEffectData(invalidData)).toBe(false);
    });
    
    it('필수 필드가 없는 효과를 거부한다', () => {
      const invalidData = [
        {
          id: 'test-effect'
          // name, description, category, defaultParams 누락
        }
      ];
      
      expect(validateEffectData(invalidData)).toBe(false);
    });
    
    it('잘못된 ID 형식을 거부한다', () => {
      const invalidData = [
        {
          id: '123invalid', // 숫자로 시작
          name: 'Test',
          description: 'Test',
          category: 'particles',
          defaultParams: {}
        }
      ];
      
      expect(validateEffectData(invalidData)).toBe(false);
    });
    
    it('잘못된 파라미터 타입을 거부한다', () => {
      const invalidData = [
        {
          id: 'test-effect',
          name: 'Test',
          description: 'Test',
          category: 'particles',
          defaultParams: {
            speed: { type: 'invalid-type', value: 1 }
          }
        }
      ];
      
      expect(validateEffectData(invalidData)).toBe(false);
    });
  });
  
  describe('validateURL', () => {
    it('유효한 URL을 검증한다', () => {
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://localhost:3000')).toBe(true);
      expect(validateURL('ftp://files.example.com')).toBe(true);
    });
    
    it('유효하지 않은 URL을 거부한다', () => {
      expect(validateURL('not-a-url')).toBe(false);
      expect(validateURL('://invalid')).toBe(false);
      expect(validateURL('')).toBe(false);
    });
  });
  
  describe('validateFileSize', () => {
    it('유효한 파일 크기를 검증한다', () => {
      expect(validateFileSize(1024, 2048)).toBe(true);
      expect(validateFileSize(2048, 2048)).toBe(true);
    });
    
    it('크기 제한을 초과하는 파일을 거부한다', () => {
      expect(validateFileSize(3000, 2048)).toBe(false);
    });
    
    it('음수 크기를 거부한다', () => {
      expect(validateFileSize(-100, 2048)).toBe(false);
    });
    
    it('0 크기를 거부한다', () => {
      expect(validateFileSize(0, 2048)).toBe(false);
    });
  });
});
```

### 3.4. 3D 효과 모듈 테스트

#### gnParticles.effect.test.js
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { init, animate, dispose } from '@/effects/gnParticles.effect.js';

// Three.js 모킹
vi.mock('three', () => ({
  BufferGeometry: vi.fn(() => ({
    setAttribute: vi.fn(),
    dispose: vi.fn()
  })),
  BufferAttribute: vi.fn(),
  PointsMaterial: vi.fn(() => ({
    dispose: vi.fn()
  })),
  Points: vi.fn(() => ({
    rotation: { y: 0 },
    dispose: vi.fn()
  })),
  Color: vi.fn(() => ({ r: 0, g: 1, b: 0.5 }))
}));

describe('gnParticles.effect', () => {
  let mockScene;
  let mockParams;
  
  beforeEach(() => {
    mockScene = {
      add: vi.fn(),
      remove: vi.fn()
    };
    
    mockParams = {
      particleCount: 1000,
      particleSize: 0.08,
      speed: 1.5,
      spread: 8.0,
      color: '#00FF88',
      glowIntensity: 1.2,
      flowDirection: 1.0,
      turbulence: 0.5
    };
  });
  
  it('효과를 올바르게 초기화한다', async () => {
    const result = await init(mockScene, mockParams);
    
    expect(result).toHaveProperty('effect');
    expect(mockScene.add).toHaveBeenCalled();
  });
  
  it('애니메이션이 올바르게 동작한다', async () => {
    const objects = await init(mockScene, mockParams);
    const deltaTime = 0.016; // 60fps
    
    // 애니메이션 함수 호출
    expect(() => {
      animate(objects, mockParams, deltaTime);
    }).not.toThrow();
  });
  
  it('리소스를 올바르게 정리한다', async () => {
    const objects = await init(mockScene, mockParams);
    
    dispose(mockScene, objects);
    
    expect(mockScene.remove).toHaveBeenCalled();
  });
  
  it('파라미터 변경에 반응한다', async () => {
    const objects = await init(mockScene, mockParams);
    
    const newParams = {
      ...mockParams,
      speed: 3.0,
      color: '#FF0088'
    };
    
    expect(() => {
      animate(objects, newParams, 0.016);
    }).not.toThrow();
  });
  
  it('메타데이터가 올바르게 정의되어 있다', () => {
    const { metadata } = require('@/effects/gnParticles.effect.js');
    
    expect(metadata).toHaveProperty('name');
    expect(metadata).toHaveProperty('description');
    expect(metadata).toHaveProperty('category');
    expect(metadata).toHaveProperty('tags');
    expect(metadata).toHaveProperty('performance');
  });
});
```

## 4. 통합 테스트

### 4.1. 컴포넌트 통합 테스트

#### HomePage.integration.test.js
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import HomePage from '@/views/HomePage.vue';
import { useEffectStore } from '@/store/effectStore';
import { useUIStore } from '@/store/uiStore';

// 자식 컴포넌트 모킹
vi.mock('@/components/effects/EffectCanvas.vue', () => ({
  default: {
    name: 'EffectCanvas',
    template: '<div data-testid="effect-canvas">Effect Canvas</div>',
    props: ['effectName', 'params']
  }
}));

vi.mock('@/components/library/EffectList.vue', () => ({
  default: {
    name: 'EffectList',
    template: '<div data-testid="effect-list">Effect List</div>'
  }
}));

describe('HomePage 통합 테스트', () => {
  let wrapper;
  let effectStore;
  let uiStore;
  
  beforeEach(() => {
    wrapper = mount(HomePage, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            effect: {
              effects: [
                {
                  id: 'gnParticles',
                  name: 'GN 입자',
                  defaultParams: {
                    speed: { type: 'slider', value: 1.5 }
                  }
                }
              ],
              selectedEffect: null,
              status: 'idle'
            },
            ui: {
              isLibraryVisible: false,
              isInfoPanelVisible: false
            }
          }
        })]
      }
    });
    
    effectStore = useEffectStore();
    uiStore = useUIStore();
  });
  
  it('페이지가 올바르게 렌더링된다', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-testid="effect-canvas"]').exists()).toBe(true);
  });
  
  it('효과 목록이 비어있을 때 적절한 메시지를 표시한다', () => {
    effectStore.effects = [];
    
    expect(wrapper.text()).toContain('사용 가능한 효과가 없습니다');
  });
  
  it('효과 선택 시 캔버스에 효과가 전달된다', async () => {
    const effect = effectStore.effects[0];
    effectStore.selectEffect(effect.id);
    
    await wrapper.vm.$nextTick();
    
    const canvas = wrapper.findComponent('[data-testid="effect-canvas"]');
    expect(canvas.props('effectName')).toBe(effect.id);
  });
  
  it('UI 패널 토글이 올바르게 동작한다', async () => {
    // 라이브러리 패널 토글
    uiStore.toggleLibrary();
    await wrapper.vm.$nextTick();
    
    expect(uiStore.isLibraryVisible).toBe(true);
    
    // 정보 패널 토글
    uiStore.toggleInfoPanel();
    await wrapper.vm.$nextTick();
    
    expect(uiStore.isInfoPanelVisible).toBe(true);
  });
  
  it('키보드 단축키가 동작한다', async () => {
    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true
    });
    
    // 패널을 먼저 열고
    uiStore.isLibraryVisible = true;
    await wrapper.vm.$nextTick();
    
    // ESC 키 이벤트 발생
    document.dispatchEvent(keyEvent);
    await wrapper.vm.$nextTick();
    
    expect(uiStore.isLibraryVisible).toBe(false);
  });
  
  it('로딩 상태를 올바르게 처리한다', async () => {
    effectStore.status = 'loading';
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.loading-state').exists()).toBe(true);
  });
  
  it('에러 상태를 올바르게 처리한다', async () => {
    effectStore.status = 'failed';
    effectStore.error = '네트워크 오류';
    await wrapper.vm.$nextTick();
    
    expect(wrapper.find('.error-state').exists()).toBe(true);
    expect(wrapper.text()).toContain('네트워크 오류');
  });
});
```

### 4.2. API 통합 테스트

#### api.integration.test.js
```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getEffects, getEffectDetails } from '@/services/api';
import httpClient from '@/services/httpClient';

// HTTP 클라이언트 모킹
vi.mock('@/services/httpClient');

describe('API 통합 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('getEffects', () => {
    it('효과 목록을 성공적으로 가져온다', async () => {
      const mockEffects = [
        {
          id: 'gnParticles',
          name: 'GN 입자',
          description: 'GN 드라이브 입자 효과',
          category: 'particles',
          defaultParams: {}
        }
      ];
      
      httpClient.get.mockResolvedValue({ effects: mockEffects });
      
      const result = await getEffects();
      
      expect(result).toEqual(mockEffects);
      expect(httpClient.get).toHaveBeenCalledWith('/effects', {
        category: null,
        version: '1.0'
      });
    });
    
    it('카테고리 필터링이 동작한다', async () => {
      const mockEffects = [
        { id: 'effect1', category: 'particles' },
        { id: 'effect2', category: 'energy' }
      ];
      
      httpClient.get.mockResolvedValue({ effects: mockEffects });
      
      const result = await getEffects({ category: 'particles' });
      
      expect(httpClient.get).toHaveBeenCalledWith('/effects', {
        category: 'particles',
        version: '1.0'
      });
    });
    
    it('네트워크 오류를 올바르게 처리한다', async () => {
      httpClient.get.mockRejectedValue(new Error('네트워크 오류'));
      
      await expect(getEffects()).rejects.toThrow('효과 목록을 불러올 수 없습니다');
    });
    
    it('잘못된 데이터 형식을 거부한다', async () => {
      httpClient.get.mockResolvedValue({ effects: 'not-an-array' });
      
      await expect(getEffects()).rejects.toThrow('효과 데이터 형식이 올바르지 않습니다');
    });
  });
  
  describe('getEffectDetails', () => {
    it('효과 상세 정보를 성공적으로 가져온다', async () => {
      const mockEffect = {
        id: 'gnParticles',
        name: 'GN 입자',
        description: '상세 설명',
        extendedInfo: {
          author: 'Test Author',
          version: '1.0.0'
        }
      };
      
      httpClient.get.mockResolvedValue(mockEffect);
      
      const result = await getEffectDetails('gnParticles');
      
      expect(result).toEqual(mockEffect);
      expect(httpClient.get).toHaveBeenCalledWith('/effects/gnParticles');
    });
    
    it('효과 ID가 없으면 에러를 발생시킨다', async () => {
      await expect(getEffectDetails()).rejects.toThrow('효과 ID가 필요합니다');
    });
    
    it('존재하지 않는 효과에 대해 404 에러를 처리한다', async () => {
      httpClient.get.mockRejectedValue(new Error('HTTP 404: Not Found'));
      
      await expect(getEffectDetails('non-existent')).rejects.toThrow('HTTP 404: Not Found');
    });
  });
});
```

## 5. E2E 테스트 (Playwright)

### 5.1. Playwright 설정

#### playwright.config.js
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.2. E2E 테스트 예시

#### main-flow.e2e.test.js
```javascript
import { test, expect } from '@playwright/test';

test.describe('메인 사용자 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지가 올바르게 로드된다', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/Kirakira/);
    
    // 메인 요소들 확인
    await expect(page.locator('.the-header')).toBeVisible();
    await expect(page.locator('.effect-canvas-container')).toBeVisible();
    await expect(page.locator('.the-footer')).toBeVisible();
  });

  test('효과 라이브러리를 열고 효과를 선택할 수 있다', async ({ page }) => {
    // 라이브러리 버튼 클릭
    await page.click('[aria-label="효과 라이브러리 토글"]');
    
    // 라이브러리 패널이 나타나는지 확인
    await expect(page.locator('.effect-list.visible')).toBeVisible();
    
    // 첫 번째 효과 선택
    const firstEffect = page.locator('.effect-list-item').first();
    await firstEffect.click();
    
    // 효과가 선택되었는지 확인
    await expect(firstEffect).toHaveClass(/selected/);
    
    // 캔버스에 효과가 로드되는지 확인 (로딩 스피너 확인)
    await expect(page.locator('.loading-overlay')).toBeVisible();
    
    // 로딩 완료 대기
    await expect(page.locator('.loading-overlay')).toBeHidden({ timeout: 10000 });
  });

  test('효과 컨트롤 패널에서 파라미터를 조정할 수 있다', async ({ page }) => {
    // 먼저 효과 선택
    await page.click('[aria-label="효과 라이브러리 토글"]');
    await page.locator('.effect-list-item').first().click();
    
    // 컨트롤 패널이 보이는지 확인
    await expect(page.locator('.effect-controls.visible')).toBeVisible();
    
    // 슬라이더 파라미터 조정
    const speedSlider = page.locator('input[type="range"]').first();
    await speedSlider.fill('5');
    
    // 값이 업데이트되었는지 확인
    const speedValue = page.locator('.param-value').first();
    await expect(speedValue).toContainText('5');
    
    // 색상 파라미터 변경
    const colorPicker = page.locator('input[type="color"]').first();
    await colorPicker.fill('#ff0000');
  });

  test('정보 패널을 열고 닫을 수 있다', async ({ page }) => {
    // 정보 버튼 클릭
    await page.click('[aria-label="정보 패널 토글"]');
    
    // 정보 패널이 나타나는지 확인
    await expect(page.locator('.info-panel.visible')).toBeVisible();
    
    // ESC 키로 패널 닫기
    await page.keyboard.press('Escape');
    
    // 패널이 닫혔는지 확인
    await expect(page.locator('.info-panel.visible')).toBeHidden();
  });

  test('키보드 단축키가 동작한다', async ({ page }) => {
    // Ctrl+L로 라이브러리 토글
    await page.keyboard.press('Control+l');
    await expect(page.locator('.effect-list.visible')).toBeVisible();
    
    // Ctrl+I로 정보 패널 토글
    await page.keyboard.press('Control+i');
    await expect(page.locator('.info-panel.visible')).toBeVisible();
    
    // ESC로 모든 패널 닫기
    await page.keyboard.press('Escape');
    await expect(page.locator('.effect-list.visible')).toBeHidden();
    await expect(page.locator('.info-panel.visible')).toBeHidden();
  });

  test('반응형 디자인이 올바르게 동작한다', async ({ page }) => {
    // 모바일 뷰포트로 변경
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 모바일에서 라이브러리 패널이 전체 화면을 차지하는지 확인
    await page.click('[aria-label="효과 라이브러리 토글"]');
    const libraryPanel = page.locator('.effect-list.visible');
    
    const boundingBox = await libraryPanel.boundingBox();
    expect(boundingBox.width).toBeCloseTo(375, 10);
    
    // 태블릿 뷰포트로 변경
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // 데스크탑 뷰포트로 변경
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // 레이아웃이 올바르게 조정되는지 확인
    await expect(page.locator('.the-header')).toBeVisible();
    await expect(page.locator('.effect-canvas-container')).toBeVisible();
  });

  test('오류 상황을 올바르게 처리한다', async ({ page }) => {
    // 네트워크를 오프라인으로 설정
    await page.context().setOffline(true);
    
    // 페이지 새로고침
    await page.reload();
    
    // 오류 메시지가 표시되는지 확인
    await expect(page.locator('.error-message')).toBeVisible();
    
    // 다시 시도 버튼이 있는지 확인
    await expect(page.locator('.retry-button')).toBeVisible();
    
    // 네트워크 복구
    await page.context().setOffline(false);
    
    // 다시 시도 버튼 클릭
    await page.click('.retry-button');
    
    // 정상적으로 로드되는지 확인
    await expect(page.locator('.error-message')).toBeHidden();
  });
});

test.describe('접근성 테스트', () => {
  test('키보드 네비게이션이 동작한다', async ({ page }) => {
    await page.goto('/');
    
    // Tab 키로 네비게이션
    await page.keyboard.press('Tab');
    
    // 첫 번째 포커스 가능한 요소가 포커스되었는지 확인
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // 여러 번 Tab 키를 눌러 모든 요소를 순회
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
    }
  });

  test('ARIA 속성이 올바르게 설정되어 있다', async ({ page }) => {
    await page.goto('/');
    
    // 버튼들이 적절한 aria-label을 가지는지 확인
    const libraryButton = page.locator('[aria-label="효과 라이브러리 토글"]');
    await expect(libraryButton).toBeVisible();
    
    const infoButton = page.locator('[aria-label="정보 패널 토글"]');
    await expect(infoButton).toBeVisible();
    
    // 패널들이 적절한 role을 가지는지 확인
    await libraryButton.click();
    const libraryPanel = page.locator('.effect-list[role="dialog"]');
    await expect(libraryPanel).toBeVisible();
  });
});
```

## 6. 테스트 실행 및 CI/CD 통합

### 6.1. GitHub Actions 워크플로우

#### .github/workflows/test.yml
```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:run
    
    - name: Run tests with coverage
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  e2e:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload Playwright Report
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
```

### 6.2. 테스트 스크립트

#### scripts/test.sh
```bash
#!/bin/bash

# 테스트 실행 스크립트

set -e

echo "🧪 테스트 환경 설정 중..."

# 환경 변수 설정
export NODE_ENV=test

echo "📦 의존성 확인 중..."
if [ ! -d "node_modules" ]; then
  echo "node_modules가 없습니다. npm install을 실행합니다..."
  npm install
fi

echo "🔍 린트 검사 실행 중..."
npm run lint

echo "🧪 유닛 테스트 실행 중..."
npm run test:run

echo "📊 커버리지 리포트 생성 중..."
npm run test:coverage

echo "🎭 E2E 테스트 실행 중..."
if command -v playwright &> /dev/null; then
  npm run test:e2e
else
  echo "Playwright가 설치되지 않았습니다. E2E 테스트를 건너뜁니다."
fi

echo "✅ 모든 테스트가 완료되었습니다!"

# 커버리지 임계값 확인
COVERAGE_THRESHOLD=70
COVERAGE_ACTUAL=$(node -e "
  const coverage = require('./coverage/coverage-summary.json');
  console.log(Math.round(coverage.total.lines.pct));
")

if [ "$COVERAGE_ACTUAL" -lt "$COVERAGE_THRESHOLD" ]; then
  echo "❌ 커버리지가 임계값($COVERAGE_THRESHOLD%)보다 낮습니다: $COVERAGE_ACTUAL%"
  exit 1
else
  echo "✅ 커버리지: $COVERAGE_ACTUAL% (임계값: $COVERAGE_THRESHOLD%)"
fi
```

## 7. 테스트 베스트 프랙티스

### 7.1. 테스트 작성 원칙

1. **AAA 패턴 (Arrange, Act, Assert)**
```javascript
it('사용자가 버튼을 클릭하면 카운터가 증가한다', () => {
  // Arrange
  const wrapper = mount(Counter, { props: { initialCount: 0 } });
  
  // Act
  wrapper.find('button').trigger('click');
  
  // Assert
  expect(wrapper.text()).toContain('1');
});
```

2. **명확한 테스트 이름**
```javascript
// ❌ 나쁜 예
it('버튼 테스트', () => {});

// ✅ 좋은 예  
it('disabled 상태일 때 버튼 클릭이 동작하지 않는다', () => {});
```

3. **독립적인 테스트**
```javascript
// ❌ 나쁜 예 - 테스트 간 의존성
let sharedState;
it('첫 번째 테스트', () => {
  sharedState = 'something';
});
it('두 번째 테스트', () => {
  expect(sharedState).toBe('something'); // 이전 테스트에 의존
});

// ✅ 좋은 예 - 독립적인 테스트
it('상태를 올바르게 설정한다', () => {
  const state = 'something';
  expect(state).toBe('something');
});
```

### 7.2. Mock 사용 가이드

1. **외부 의존성만 모킹**
```javascript
// ✅ API 호출 모킹
vi.mock('@/services/api', () => ({
  getEffects: vi.fn(() => Promise.resolve([]))
}));

// ❌ 테스트하려는 코드 모킹
vi.mock('@/components/Button.vue'); // 버튼을 테스트하려는데 모킹하면 안됨
```

2. **모킹 정리**
```javascript
describe('Component', () => {
  afterEach(() => {
    vi.clearAllMocks(); // 각 테스트 후 모킹 상태 정리
  });
});
```

### 7.3. 비동기 테스트

```javascript
// ✅ async/await 사용
it('비동기 데이터를 올바르게 로드한다', async () => {
  const wrapper = mount(Component);
  
  // 비동기 작업 대기
  await wrapper.vm.loadData();
  
  expect(wrapper.vm.data).toBeDefined();
});

// ✅ 타임아웃 설정
it('오래 걸리는 작업', () => {
  // 개별 테스트 타임아웃 설정
}, 15000);
```

## 8. 구현 체크리스트

### 8.1. 기본 설정
- [ ] Vitest 설정 및 환경 구성
- [ ] 테스트 설정 파일 작성
- [ ] Mock 설정 (Three.js, WebGL 등)
- [ ] CI/CD 파이프라인 구성

### 8.2. 테스트 작성
- [ ] Vue 컴포넌트 단위 테스트
- [ ] Pinia 스토어 테스트
- [ ] 유틸리티 함수 테스트
- [ ] 3D 효과 모듈 테스트

### 8.3. 통합 테스트
- [ ] 컴포넌트 간 상호작용 테스트
- [ ] API 통합 테스트
- [ ] 사용자 플로우 테스트

### 8.4. E2E 테스트
- [ ] 주요 사용자 시나리오 테스트
- [ ] 반응형 디자인 테스트
- [ ] 접근성 테스트
- [ ] 오류 상황 테스트

## 9. 다음 단계

테스팅 환경 설정이 완료되면 다음 문서로 진행하세요:

**08_Deployment_Guide.md** - 배포 가이드

## 10. 트러블슈팅

### 10.1. 일반적인 문제들

#### Three.js 관련 테스트 오류
- WebGL Context Mock 설정 확인
- Canvas Mock 설정 확인
- jest-canvas-mock 라이브러리 사용

#### Vue 컴포넌트 테스트 오류
- @vue/test-utils 버전 호환성 확인
- 전역 컴포넌트 등록 확인
- Pinia 테스트 설정 확인

#### E2E 테스트 불안정성
- 대기 시간 적절히 설정
- 네트워크 상태 고려
- 테스트 격리 확인
