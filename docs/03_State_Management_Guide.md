# 03. 상태 관리 구현 가이드 (Pinia)

## 1. Pinia 스토어 아키텍처

### 1.1. 스토어 설계 원칙
- **단일 책임 원칙**: 각 스토어는 하나의 도메인만 관리
- **단방향 데이터 흐름**: Action → State → UI
- **타입 안전성**: TypeScript 호환 구조 (선택사항)
- **상태 정규화**: 중복 데이터 최소화

### 1.2. 스토어 구조
```
src/store/
├── index.js          # Pinia 인스턴스 및 전역 설정
├── effectStore.js    # 효과 관련 상태 관리
├── uiStore.js        # UI 상태 관리
└── types.js          # 타입 정의 (선택사항)
```

## 2. 기본 설정

### 2.1. Pinia 인스턴스 생성 (src/store/index.js)

```javascript
import { createPinia } from 'pinia';

const pinia = createPinia();

// 개발 환경에서 상태 디버깅 활성화
if (process.env.NODE_ENV === 'development') {
  pinia.use(({ store }) => {
    store.$subscribe((mutation, state) => {
      console.log(`[${store.$id}] ${mutation.type}:`, mutation);
    });
  });
}

export default pinia;
```

### 2.2. 타입 정의 (src/store/types.js)

```javascript
/**
 * 효과 객체 타입 정의
 * @typedef {Object} Effect
 * @property {string} id - 고유 ID
 * @property {string} name - 효과 이름
 * @property {string} description - 효과 설명
 * @property {string} thumbnail - 썸네일 이미지 URL
 * @property {string[]} relatedGundam - 관련 건담 기체 배열
 * @property {Object} defaultParams - 기본 파라미터 설정
 */

/**
 * 파라미터 타입 정의
 * @typedef {Object} Parameter
 * @property {'slider'|'color'|'toggle'} type - 파라미터 타입
 * @property {number|string|boolean} value - 현재 값
 * @property {number} [min] - 최소값 (slider용)
 * @property {number} [max] - 최대값 (slider용)  
 * @property {number} [step] - 단계값 (slider용)
 */

/**
 * 로딩 상태 타입
 * @typedef {'idle'|'loading'|'succeeded'|'failed'} LoadingStatus
 */

export const LoadingStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
};
```

## 3. Effect Store 구현

### 3.1. effectStore.js

```javascript
import { defineStore } from 'pinia';
import { getEffects } from '@/services/api';
import { LoadingStatus } from './types';

export const useEffectStore = defineStore('effect', {
  // 상태 정의
  state: () => ({
    /** @type {Effect[]} 전체 효과 목록 */
    effects: [],
    
    /** @type {Effect|null} 현재 선택된 효과 */
    selectedEffect: null,
    
    /** @type {Object<string, Parameter>} 현재 적용된 파라미터 값 */
    currentParams: {},
    
    /** @type {LoadingStatus} 데이터 로딩 상태 */
    status: LoadingStatus.IDLE,
    
    /** @type {string|null} 에러 메시지 */
    error: null,
    
    /** @type {number} 마지막 업데이트 시간 */
    lastFetchTime: 0
  }),

  // 게터 정의
  getters: {
    /**
     * 현재 선택된 효과의 파라미터만 반환
     * @returns {Object<string, any>} 파라미터 값 객체
     */
    selectedParams: (state) => {
      if (!state.selectedEffect) return {};
      
      const params = {};
      Object.keys(state.currentParams).forEach(key => {
        params[key] = state.currentParams[key].value;
      });
      return params;
    },

    /**
     * 로딩 중인지 확인
     * @returns {boolean}
     */
    isLoading: (state) => state.status === LoadingStatus.LOADING,

    /**
     * 에러 상태인지 확인
     * @returns {boolean}
     */
    hasError: (state) => state.status === LoadingStatus.FAILED,

    /**
     * 데이터가 성공적으로 로드되었는지 확인
     * @returns {boolean}
     */
    isReady: (state) => state.status === LoadingStatus.SUCCEEDED && state.effects.length > 0,

    /**
     * ID로 효과 찾기
     * @returns {Function} (id: string) => Effect|undefined
     */
    getEffectById: (state) => (id) => {
      return state.effects.find(effect => effect.id === id);
    },

    /**
     * 관련 건담으로 효과 필터링
     * @returns {Function} (gundamName: string) => Effect[]
     */
    getEffectsByGundam: (state) => (gundamName) => {
      return state.effects.filter(effect => 
        effect.relatedGundam.includes(gundamName)
      );
    }
  },

  // 액션 정의
  actions: {
    /**
     * 효과 목록을 서버에서 가져오기
     * @returns {Promise<void>}
     */
    async fetchEffects() {
      // 이미 로딩 중이면 중복 요청 방지
      if (this.status === LoadingStatus.LOADING) {
        return;
      }

      // 최근에 가져온 데이터가 있으면 캐시 사용 (5분 이내)
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      if (this.lastFetchTime > fiveMinutesAgo && this.effects.length > 0) {
        return;
      }

      this.status = LoadingStatus.LOADING;
      this.error = null;

      try {
        const effects = await getEffects();
        
        // 데이터 검증
        if (!Array.isArray(effects)) {
          throw new Error('효과 데이터 형식이 올바르지 않습니다.');
        }

        this.effects = effects;
        this.status = LoadingStatus.SUCCEEDED;
        this.lastFetchTime = Date.now();

        // 첫 번째 효과를 기본 선택 (선택된 효과가 없을 때만)
        if (!this.selectedEffect && effects.length > 0) {
          this.selectEffect(effects[0].id);
        }

      } catch (error) {
        console.error('효과 목록 로드 실패:', error);
        this.status = LoadingStatus.FAILED;
        this.error = error.message || '효과 목록을 불러오는데 실패했습니다.';
      }
    },

    /**
     * 효과 선택
     * @param {string} effectId - 선택할 효과의 ID
     */
    selectEffect(effectId) {
      const effect = this.getEffectById(effectId);
      
      if (!effect) {
        console.warn(`효과를 찾을 수 없습니다: ${effectId}`);
        return;
      }

      // 이전 효과와 같으면 무시
      if (this.selectedEffect?.id === effectId) {
        return;
      }

      this.selectedEffect = effect;
      
      // 기본 파라미터로 초기화
      this.resetParams();
      
      console.log(`효과 선택됨: ${effect.name}`);
    },

    /**
     * 파라미터 값 업데이트
     * @param {string} key - 파라미터 키
     * @param {any} value - 새로운 값
     */
    updateParam(key, value) {
      if (!this.selectedEffect) {
        console.warn('선택된 효과가 없습니다.');
        return;
      }

      if (!(key in this.currentParams)) {
        console.warn(`존재하지 않는 파라미터: ${key}`);
        return;
      }

      const param = this.currentParams[key];
      
      // 값 검증 및 정규화
      let normalizedValue = value;
      
      if (param.type === 'slider') {
        normalizedValue = Math.max(param.min || 0, Math.min(param.max || 100, Number(value)));
      } else if (param.type === 'color') {
        // 색상 값 검증 (헥스 코드 형식)
        if (!/^#[0-9A-F]{6}$/i.test(value)) {
          console.warn(`잘못된 색상 형식: ${value}`);
          return;
        }
      } else if (param.type === 'toggle') {
        normalizedValue = Boolean(value);
      }

      // 값이 실제로 변경된 경우만 업데이트
      if (param.value !== normalizedValue) {
        this.currentParams[key].value = normalizedValue;
        console.log(`파라미터 업데이트: ${key} = ${normalizedValue}`);
      }
    },

    /**
     * 여러 파라미터 한번에 업데이트
     * @param {Object<string, any>} params - 업데이트할 파라미터 객체
     */
    updateParams(params) {
      Object.keys(params).forEach(key => {
        this.updateParam(key, params[key]);
      });
    },

    /**
     * 현재 효과의 파라미터를 기본값으로 리셋
     */
    resetParams() {
      if (!this.selectedEffect) {
        this.currentParams = {};
        return;
      }

      // 깊은 복사로 기본 파라미터 설정
      this.currentParams = JSON.parse(JSON.stringify(this.selectedEffect.defaultParams));
      
      console.log('파라미터가 기본값으로 리셋되었습니다.');
    },

    /**
     * 효과 즐겨찾기 토글 (추후 확장용)
     * @param {string} effectId - 효과 ID
     */
    toggleFavorite(effectId) {
      const effect = this.getEffectById(effectId);
      if (effect) {
        // TODO: 로컬 스토리지나 사용자 설정에 저장
        console.log(`즐겨찾기 토글: ${effect.name}`);
      }
    },

    /**
     * 스토어 상태 초기화
     */
    resetStore() {
      this.effects = [];
      this.selectedEffect = null;
      this.currentParams = {};
      this.status = LoadingStatus.IDLE;
      this.error = null;
      this.lastFetchTime = 0;
    }
  }
});
```

## 4. UI Store 구현

### 4.1. uiStore.js

```javascript
import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  // 상태 정의
  state: () => ({
    /** @type {boolean} 정보 패널 표시 여부 */
    isInfoPanelVisible: false,
    
    /** @type {boolean} 효과 라이브러리 패널 표시 여부 */
    isLibraryVisible: false,
    
    /** @type {boolean} 컨트롤 패널 표시 여부 */
    isControlPanelVisible: true,
    
    /** @type {boolean} 풀스크린 모드 여부 */
    isFullscreen: false,
    
    /** @type {boolean} 모바일 환경 여부 */
    isMobile: false,
    
    /** @type {string} 현재 테마 */
    theme: 'dark',
    
    /** @type {boolean} 모션 감소 모드 */
    prefersReducedMotion: false,
    
    /** @type {Object} 토스트 메시지 */
    toast: {
      visible: false,
      message: '',
      type: 'info', // 'info' | 'success' | 'warning' | 'error'
      duration: 3000
    },
    
    /** @type {Object} 모달 상태 */
    modal: {
      visible: false,
      component: null,
      props: {}
    }
  }),

  // 게터 정의
  getters: {
    /**
     * 어떤 오버레이든 열려있는지 확인
     * @returns {boolean}
     */
    isOverlayOpen: (state) => {
      return state.isInfoPanelVisible || 
             state.isLibraryVisible || 
             state.modal.visible;
    },

    /**
     * 사이드바가 열려있는지 확인
     * @returns {boolean}
     */
    isSidebarOpen: (state) => {
      return state.isInfoPanelVisible || state.isLibraryVisible;
    },

    /**
     * 캔버스가 메인 영역을 차지하는지 확인
     * @returns {boolean}
     */
    isCanvasMainView: (state) => {
      return !state.isInfoPanelVisible && !state.isLibraryVisible;
    },

    /**
     * UI 테마 클래스 이름
     * @returns {string}
     */
    themeClass: (state) => `theme-${state.theme}`,

    /**
     * 현재 활성화된 패널 개수
     * @returns {number}
     */
    activePanelCount: (state) => {
      let count = 0;
      if (state.isInfoPanelVisible) count++;
      if (state.isLibraryVisible) count++;
      if (state.isControlPanelVisible) count++;
      return count;
    }
  },

  // 액션 정의
  actions: {
    /**
     * 정보 패널 토글
     */
    toggleInfoPanel() {
      this.isInfoPanelVisible = !this.isInfoPanelVisible;
      
      // 모바일에서는 라이브러리 패널 자동 닫기
      if (this.isMobile && this.isInfoPanelVisible) {
        this.isLibraryVisible = false;
      }
      
      console.log(`정보 패널: ${this.isInfoPanelVisible ? '열림' : '닫힘'}`);
    },

    /**
     * 라이브러리 패널 토글
     */
    toggleLibrary() {
      this.isLibraryVisible = !this.isLibraryVisible;
      
      // 모바일에서는 정보 패널 자동 닫기
      if (this.isMobile && this.isLibraryVisible) {
        this.isInfoPanelVisible = false;
      }
      
      console.log(`라이브러리 패널: ${this.isLibraryVisible ? '열림' : '닫힘'}`);
    },

    /**
     * 컨트롤 패널 토글
     */
    toggleControlPanel() {
      this.isControlPanelVisible = !this.isControlPanelVisible;
      console.log(`컨트롤 패널: ${this.isControlPanelVisible ? '열림' : '닫힘'}`);
    },

    /**
     * 모든 패널 닫기
     */
    closeAllPanels() {
      this.isInfoPanelVisible = false;
      this.isLibraryVisible = false;
      console.log('모든 패널이 닫혔습니다.');
    },

    /**
     * 풀스크린 토글
     */
    async toggleFullscreen() {
      try {
        if (!this.isFullscreen) {
          await document.documentElement.requestFullscreen();
          this.isFullscreen = true;
        } else {
          await document.exitFullscreen();
          this.isFullscreen = false;
        }
      } catch (error) {
        console.warn('풀스크린 모드 변경 실패:', error);
        this.showToast('풀스크린 모드를 변경할 수 없습니다.', 'warning');
      }
    },

    /**
     * 테마 변경
     * @param {string} theme - 새로운 테마 ('dark' | 'light')
     */
    setTheme(theme) {
      if (['dark', 'light'].includes(theme)) {
        this.theme = theme;
        
        // 로컬 스토리지에 저장
        try {
          localStorage.setItem('kirakira-theme', theme);
        } catch (error) {
          console.warn('테마 설정 저장 실패:', error);
        }
        
        console.log(`테마 변경: ${theme}`);
      }
    },

    /**
     * 모바일 환경 감지 및 설정
     */
    detectMobile() {
      const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      this.isMobile = isMobile;
      
      // 모바일에서는 모든 패널 기본 닫기
      if (isMobile) {
        this.closeAllPanels();
      }
      
      console.log(`모바일 환경: ${isMobile}`);
    },

    /**
     * 모션 감소 모드 감지
     */
    detectReducedMotion() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.prefersReducedMotion = prefersReducedMotion;
      console.log(`모션 감소 모드: ${prefersReducedMotion}`);
    },

    /**
     * 토스트 메시지 표시
     * @param {string} message - 메시지 내용
     * @param {string} type - 메시지 타입 ('info' | 'success' | 'warning' | 'error')
     * @param {number} duration - 표시 시간 (ms)
     */
    showToast(message, type = 'info', duration = 3000) {
      // 기존 토스트가 있으면 즉시 닫기
      if (this.toast.visible) {
        this.hideToast();
      }
      
      this.toast = {
        visible: true,
        message,
        type,
        duration
      };
      
      // 자동 닫기 타이머 설정
      setTimeout(() => {
        this.hideToast();
      }, duration);
      
      console.log(`토스트 표시: ${message}`);
    },

    /**
     * 토스트 메시지 숨기기
     */
    hideToast() {
      this.toast.visible = false;
    },

    /**
     * 모달 열기
     * @param {string} component - 컴포넌트 이름
     * @param {Object} props - 컴포넌트에 전달할 props
     */
    openModal(component, props = {}) {
      this.modal = {
        visible: true,
        component,
        props
      };
      
      console.log(`모달 열림: ${component}`);
    },

    /**
     * 모달 닫기
     */
    closeModal() {
      this.modal = {
        visible: false,
        component: null,
        props: {}
      };
      
      console.log('모달 닫힘');
    },

    /**
     * 키보드 단축키 처리
     * @param {KeyboardEvent} event - 키보드 이벤트
     */
    handleKeyboardShortcut(event) {
      // Escape 키: 모든 오버레이 닫기
      if (event.key === 'Escape') {
        if (this.modal.visible) {
          this.closeModal();
        } else if (this.isOverlayOpen) {
          this.closeAllPanels();
        }
        return;
      }
      
      // Ctrl/Cmd + 단축키들
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'i':
            event.preventDefault();
            this.toggleInfoPanel();
            break;
          case 'l':
            event.preventDefault();
            this.toggleLibrary();
            break;
          case 'Enter':
            event.preventDefault();
            this.toggleFullscreen();
            break;
        }
      }
    },

    /**
     * 윈도우 리사이즈 처리
     */
    handleResize() {
      const wasMobile = this.isMobile;
      this.detectMobile();
      
      // 모바일 ↔ 데스크탑 전환 시 레이아웃 조정
      if (wasMobile !== this.isMobile) {
        if (this.isMobile) {
          this.closeAllPanels();
        }
      }
    },

    /**
     * 초기 UI 설정 로드
     */
    initializeUI() {
      // 로컬 스토리지에서 테마 불러오기
      try {
        const savedTheme = localStorage.getItem('kirakira-theme');
        if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
          this.theme = savedTheme;
        }
      } catch (error) {
        console.warn('저장된 테마 로드 실패:', error);
      }
      
      // 환경 감지
      this.detectMobile();
      this.detectReducedMotion();
      
      // 이벤트 리스너 등록
      window.addEventListener('resize', this.handleResize);
      document.addEventListener('keydown', this.handleKeyboardShortcut);
      
      // 풀스크린 상태 변화 감지
      document.addEventListener('fullscreenchange', () => {
        this.isFullscreen = !!document.fullscreenElement;
      });
      
      console.log('UI 초기화 완료');
    },

    /**
     * UI 정리 (컴포넌트 언마운트 시)
     */
    cleanupUI() {
      window.removeEventListener('resize', this.handleResize);
      document.removeEventListener('keydown', this.handleKeyboardShortcut);
    }
  }
});
```

## 5. 스토어 연동 및 사용법

### 5.1. 메인 앱에서 스토어 등록 (src/main.js 수정)

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';

// 전역 스타일 import
import './styles/variables.css';
import './styles/base.css';
import './styles/typography.css';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');
```

### 5.2. 컴포넌트에서 스토어 사용 예시

```vue
<template>
  <div class="example-component">
    <h3>현재 선택된 효과: {{ selectedEffect?.name || '없음' }}</h3>
    
    <div v-if="isLoading">로딩 중...</div>
    
    <div v-else-if="hasError" class="error">
      {{ error }}
      <button @click="retryFetch">다시 시도</button>
    </div>
    
    <div v-else>
      <button 
        v-for="effect in effects"
        :key="effect.id"
        @click="selectEffect(effect.id)"
        :class="{ active: selectedEffect?.id === effect.id }"
      >
        {{ effect.name }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useEffectStore } from '@/store/effectStore';

export default {
  name: 'ExampleComponent',
  setup() {
    const effectStore = useEffectStore();
    
    // 반응형 데이터
    const effects = computed(() => effectStore.effects);
    const selectedEffect = computed(() => effectStore.selectedEffect);
    const isLoading = computed(() => effectStore.isLoading);
    const hasError = computed(() => effectStore.hasError);
    const error = computed(() => effectStore.error);
    
    // 액션
    const selectEffect = (id) => effectStore.selectEffect(id);
    const retryFetch = () => effectStore.fetchEffects();
    
    // 초기화
    onMounted(() => {
      effectStore.fetchEffects();
    });
    
    return {
      effects,
      selectedEffect,
      isLoading,
      hasError,
      error,
      selectEffect,
      retryFetch
    };
  }
};
</script>
```

## 6. 스토어 테스트 가이드

### 6.1. 유닛 테스트 예시 (Vitest)

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useEffectStore } from '@/store/effectStore';

// Mock API
vi.mock('@/services/api', () => ({
  getEffects: vi.fn()
}));

describe('effectStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('초기 상태가 올바르게 설정됨', () => {
    const store = useEffectStore();
    
    expect(store.effects).toEqual([]);
    expect(store.selectedEffect).toBeNull();
    expect(store.status).toBe('idle');
    expect(store.error).toBeNull();
  });

  it('효과 선택이 올바르게 동작함', () => {
    const store = useEffectStore();
    const mockEffect = {
      id: 'test-effect',
      name: 'Test Effect',
      defaultParams: { speed: { type: 'slider', value: 1, min: 0, max: 10 } }
    };
    
    store.effects = [mockEffect];
    store.selectEffect('test-effect');
    
    expect(store.selectedEffect).toEqual(mockEffect);
    expect(store.currentParams).toEqual(mockEffect.defaultParams);
  });

  it('파라미터 업데이트가 올바르게 동작함', () => {
    const store = useEffectStore();
    store.selectedEffect = {
      id: 'test',
      defaultParams: { speed: { type: 'slider', value: 1, min: 0, max: 10 } }
    };
    store.currentParams = { speed: { type: 'slider', value: 1, min: 0, max: 10 } };
    
    store.updateParam('speed', 5);
    
    expect(store.currentParams.speed.value).toBe(5);
  });
});
```

## 7. 성능 최적화 팁

### 7.1. 계산된 속성 최적화
- 복잡한 계산은 getters로 캐싱
- 의존성이 변경될 때만 재계산됨

### 7.2. 상태 구독 최적화
```javascript
// ❌ 잘못된 방법: 전체 스토어 구독
watch(store, (newStore) => {
  // 모든 변경에 반응
});

// ✅ 올바른 방법: 특정 속성만 구독
watch(() => store.selectedEffect, (newEffect) => {
  // 선택된 효과 변경에만 반응
});
```

### 7.3. 액션 중복 호출 방지
```javascript
// 이미 구현된 캐싱 및 중복 방지 로직 활용
if (store.status === 'loading') return; // 중복 요청 방지
```

## 8. 구현 체크리스트

### 8.1. 기본 설정
- [ ] Pinia 인스턴스 생성 및 설정
- [ ] 타입 정의 작성
- [ ] 메인 앱에 스토어 등록

### 8.2. Effect Store
- [ ] 기본 상태 정의
- [ ] 게터 구현 (selectedParams, isLoading 등)
- [ ] 액션 구현 (fetchEffects, selectEffect, updateParam)
- [ ] 에러 핸들링 및 캐싱 로직

### 8.3. UI Store  
- [ ] UI 상태 정의
- [ ] 패널 토글 액션 구현
- [ ] 키보드 단축키 처리
- [ ] 반응형 처리 및 환경 감지

### 8.4. 테스트
- [ ] 유닛 테스트 작성
- [ ] 통합 테스트 (컴포넌트와 연동)
- [ ] 성능 테스트

## 9. 다음 단계

상태 관리 구현이 완료되면 다음 문서로 진행하세요:

1. **04_3D_Effect_System_Guide.md** - Three.js 효과 시스템 구현
2. **05_API_Services_Guide.md** - API 서비스와 Mock 데이터 구현

## 10. 트러블슈팅

### 10.1. 일반적인 문제들

#### 스토어 상태가 반응하지 않음
- 컴포넌트에서 `computed`를 사용했는지 확인
- Pinia가 Vue 앱에 올바르게 등록되었는지 확인

#### 액션 호출 시 에러 발생
- 스토어 인스턴스가 올바르게 생성되었는지 확인
- 비동기 액션의 경우 `async/await` 사용 확인

#### 개발자 도구에서 상태 변화가 보이지 않음
- Vue Devtools 브라우저 확장 설치 확인
- 개발 환경에서 실행 중인지 확인
