# 02. 핵심 컴포넌트 구현 가이드

## 1. 컴포넌트 구현 순서

### 1.1. 구현 우선순위
1. **기본 레이아웃 컴포넌트** (`TheHeader`, `TheFooter`)
2. **3D 캔버스 컴포넌트** (`EffectCanvas`)  
3. **효과 목록 컴포넌트** (`EffectList`, `EffectListItem`)
4. **컨트롤 패널 컴포넌트** (`EffectControls`)
5. **정보 패널 컴포넌트** (`InfoPanel`)
6. **UI 기본 컴포넌트** (`BaseButton`, `BaseSlider`)

## 2. 레이아웃 컴포넌트

### 2.1. TheHeader.vue

```vue
<template>
  <header class="the-header">
    <div class="header-container">
      <div class="logo-section">
        <h1 class="logo">
          <span class="logo-text">Kirakira</span>
          <span class="logo-subtitle">Gundam Effects</span>
        </h1>
      </div>
      
      <nav class="nav-section">
        <button 
          class="nav-button"
          @click="toggleLibrary"
          :class="{ active: isLibraryVisible }"
          aria-label="효과 라이브러리 토글"
        >
          <span class="nav-icon">📚</span>
          Library
        </button>
        
        <button 
          class="nav-button"
          @click="toggleInfoPanel"
          :class="{ active: isInfoPanelVisible }"
          aria-label="정보 패널 토글"
        >
          <span class="nav-icon">ℹ️</span>
          Info
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useUIStore } from '@/store/uiStore';

export default {
  name: 'TheHeader',
  setup() {
    const uiStore = useUIStore();
    
    const isLibraryVisible = computed(() => uiStore.isLibraryVisible);
    const isInfoPanelVisible = computed(() => uiStore.isInfoPanelVisible);
    
    const toggleLibrary = () => {
      uiStore.toggleLibrary();
    };
    
    const toggleInfoPanel = () => {
      uiStore.toggleInfoPanel();
    };
    
    return {
      isLibraryVisible,
      isInfoPanelVisible,
      toggleLibrary,
      toggleInfoPanel
    };
  }
};
</script>

<style scoped>
.the-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--color-secondary-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 1000;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  margin: 0;
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-accent);
  text-shadow: 0 0 10px var(--color-primary-accent);
}

.logo-subtitle {
  font-size: 0.75rem;
  font-weight: 300;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.nav-section {
  display: flex;
  gap: 1rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.nav-button:hover {
  border-color: var(--color-primary-accent);
  color: var(--color-primary-accent);
  box-shadow: 0 0 5px var(--color-primary-accent);
}

.nav-button.active {
  background: var(--color-primary-accent);
  color: var(--color-primary-bg);
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 10px var(--color-primary-accent);
}

.nav-icon {
  font-size: 1rem;
}

/* 반응형 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .nav-button {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
  
  .nav-button span:not(.nav-icon) {
    display: none;
  }
}
</style>
```

### 2.2. TheFooter.vue

```vue
<template>
  <footer class="the-footer">
    <div class="footer-container">
      <div class="footer-content">
        <p class="copyright">
          © 2024 Kirakira. Gundam Effects Viewer.
        </p>
        <div class="footer-links">
          <a href="#" class="footer-link">GitHub</a>
          <span class="separator">|</span>
          <a href="#" class="footer-link">Documentation</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter'
};
</script>

<style scoped>
.the-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: var(--color-secondary-bg);
  border-top: 1px solid var(--color-border);
  z-index: 1000;
}

.footer-container {
  height: 100%;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.copyright {
  margin: 0;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-primary-accent);
}

.separator {
  color: var(--color-border);
}

/* 반응형 */
@media (max-width: 768px) {
  .footer-container {
    padding: 0 1rem;
  }
  
  .footer-content {
    font-size: 0.625rem;
  }
  
  .footer-links {
    gap: 0.25rem;
  }
}
</style>
```

## 3. 3D 캔버스 컴포넌트

### 3.1. EffectCanvas.vue

```vue
<template>
  <div class="effect-canvas-container">
    <div class="canvas-wrapper" ref="canvasContainer">
      <canvas ref="canvas" />
      
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p class="loading-text">효과를 불러오는 중...</p>
      </div>
      
      <!-- 에러 상태 -->
      <div v-if="error" class="error-overlay">
        <div class="error-content">
          <h3>효과 로드 실패</h3>
          <p>{{ error }}</p>
          <button @click="retryLoad" class="retry-button">다시 시도</button>
        </div>
      </div>
      
      <!-- 캔버스 컨트롤 힌트 -->
      <div class="canvas-hints" v-if="!isLoading && !error">
        <p>마우스로 회전 • 휠로 확대/축소</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffectStore } from '@/store/effectStore';

export default {
  name: 'EffectCanvas',
  setup() {
    const canvas = ref(null);
    const canvasContainer = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    
    const effectStore = useEffectStore();
    
    // Three.js 핵심 객체들
    let scene = null;
    let camera = null;
    let renderer = null;
    let controls = null;
    let animationId = null;
    
    // 현재 로드된 효과
    let currentEffect = null;
    let currentEffectObjects = null;
    
    const selectedEffect = computed(() => effectStore.selectedEffect);
    const currentParams = computed(() => effectStore.currentParams);
    
    // Three.js 초기화
    const initThree = () => {
      if (!canvas.value || !canvasContainer.value) return;
      
      // Scene 생성
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x121212);
      
      // Camera 생성
      const containerRect = canvasContainer.value.getBoundingClientRect();
      camera = new THREE.PerspectiveCamera(
        75,
        containerRect.width / containerRect.height,
        0.1,
        1000
      );
      camera.position.set(0, 0, 5);
      
      // Renderer 생성
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true,
        alpha: true
      });
      renderer.setSize(containerRect.width, containerRect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Controls 생성
      controls = new OrbitControls(camera, canvas.value);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.enablePan = false;
      
      // 기본 조명 추가
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // 애니메이션 시작
      animate();
    };
    
    // 애니메이션 루프
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Controls 업데이트
      if (controls) {
        controls.update();
      }
      
      // 현재 효과 애니메이션 업데이트
      if (currentEffect && currentEffectObjects) {
        const delta = 0.016; // 대략 60fps
        currentEffect.animate(currentEffectObjects, currentParams.value, delta);
      }
      
      // 렌더링
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    // 효과 로드
    const loadEffect = async (effectName) => {
      if (!effectName || !scene) return;
      
      isLoading.value = true;
      error.value = null;
      
      try {
        // 기존 효과 정리
        if (currentEffect && currentEffectObjects) {
          currentEffect.dispose(scene, currentEffectObjects);
        }
        
        // 새 효과 동적 로드
        const effectModule = await import(`@/effects/${effectName}.effect.js`);
        
        // 효과 초기화
        const effectObjects = effectModule.init(scene, currentParams.value);
        
        currentEffect = effectModule;
        currentEffectObjects = effectObjects;
        
      } catch (err) {
        console.error('효과 로드 실패:', err);
        error.value = `효과 "${effectName}"을 로드할 수 없습니다.`;
      } finally {
        isLoading.value = false;
      }
    };
    
    // 리사이즈 핸들러
    const handleResize = () => {
      if (!canvasContainer.value || !camera || !renderer) return;
      
      const containerRect = canvasContainer.value.getBoundingClientRect();
      
      camera.aspect = containerRect.width / containerRect.height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(containerRect.width, containerRect.height);
    };
    
    // 다시 시도
    const retryLoad = () => {
      if (selectedEffect.value) {
        loadEffect(selectedEffect.value.id);
      }
    };
    
    // 생명주기 훅
    onMounted(async () => {
      await nextTick();
      initThree();
      
      window.addEventListener('resize', handleResize);
      
      // 초기 효과 로드 (첫 번째 효과가 있다면)
      if (selectedEffect.value) {
        loadEffect(selectedEffect.value.id);
      }
    });
    
    onUnmounted(() => {
      // 애니메이션 정지
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // 효과 정리
      if (currentEffect && currentEffectObjects && scene) {
        currentEffect.dispose(scene, currentEffectObjects);
      }
      
      // Three.js 리소스 정리
      if (renderer) {
        renderer.dispose();
      }
      if (controls) {
        controls.dispose();
      }
      
      window.removeEventListener('resize', handleResize);
    });
    
    // 선택된 효과 변경 감지
    watch(selectedEffect, (newEffect, oldEffect) => {
      if (newEffect && newEffect.id !== oldEffect?.id) {
        loadEffect(newEffect.id);
      }
    });
    
    // 파라미터 변경 감지 (효과가 이미 로드된 상태에서)
    watch(currentParams, (newParams) => {
      // 파라미터가 변경되면 실시간 반영
      // animate 함수에서 자동으로 처리됨
    }, { deep: true });
    
    return {
      canvas,
      canvasContainer,
      isLoading,
      error,
      retryLoad
    };
  }
};
</script>

<style scoped>
.effect-canvas-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(5px);
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin: 1rem 0 0 0;
  color: var(--color-text);
  font-size: 0.875rem;
}

.error-content {
  text-align: center;
  color: var(--color-text);
}

.error-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-secondary-accent);
}

.error-content p {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.retry-button {
  padding: 0.5rem 1rem;
  background: var(--color-primary-accent);
  color: var(--color-primary-bg);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.retry-button:hover {
  background: #00cccc;
  box-shadow: 0 0 10px var(--color-primary-accent);
}

.canvas-hints {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(30, 30, 30, 0.8);
  color: var(--color-text-muted);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  pointer-events: none;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 768px) {
  .canvas-hints {
    display: none;
  }
}
</style>
```

## 4. 효과 목록 컴포넌트

### 4.1. EffectList.vue

```vue
<template>
  <div class="effect-list" :class="{ visible: isVisible }">
    <div class="list-header">
      <h2>Effects Library</h2>
      <button 
        class="close-button"
        @click="closeLibrary"
        aria-label="라이브러리 닫기"
      >
        ✕
      </button>
    </div>
    
    <div class="list-content">
      <!-- 로딩 상태 -->
      <div v-if="status === 'loading'" class="status-message">
        <div class="loading-spinner small"></div>
        <p>효과 목록을 불러오는 중...</p>
      </div>
      
      <!-- 에러 상태 -->
      <div v-else-if="status === 'failed'" class="status-message error">
        <p>목록을 불러올 수 없습니다.</p>
        <button @click="retryFetch" class="retry-button">다시 시도</button>
      </div>
      
      <!-- 빈 상태 -->
      <div v-else-if="effects.length === 0" class="status-message">
        <p>사용 가능한 효과가 없습니다.</p>
      </div>
      
      <!-- 효과 목록 -->
      <div v-else class="effects-grid">
        <EffectListItem
          v-for="effect in effects"
          :key="effect.id"
          :effect="effect"
          :isSelected="selectedEffect?.id === effect.id"
          @select="selectEffect"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useEffectStore } from '@/store/effectStore';
import { useUIStore } from '@/store/uiStore';
import EffectListItem from './EffectListItem.vue';

export default {
  name: 'EffectList',
  components: {
    EffectListItem
  },
  setup() {
    const effectStore = useEffectStore();
    const uiStore = useUIStore();
    
    const effects = computed(() => effectStore.effects);
    const selectedEffect = computed(() => effectStore.selectedEffect);
    const status = computed(() => effectStore.status);
    const isVisible = computed(() => uiStore.isLibraryVisible);
    
    const selectEffect = (effectId) => {
      effectStore.selectEffect(effectId);
      // 모바일에서는 선택 후 라이브러리 자동 닫기
      if (window.innerWidth <= 768) {
        uiStore.toggleLibrary();
      }
    };
    
    const closeLibrary = () => {
      uiStore.toggleLibrary();
    };
    
    const retryFetch = () => {
      effectStore.fetchEffects();
    };
    
    onMounted(() => {
      // 효과 목록이 없으면 로드
      if (effects.value.length === 0 && status.value === 'idle') {
        effectStore.fetchEffects();
      }
    });
    
    return {
      effects,
      selectedEffect,
      status,
      isVisible,
      selectEffect,
      closeLibrary,
      retryFetch
    };
  }
};
</script>

<style scoped>
.effect-list {
  position: fixed;
  top: 60px;
  left: -400px;
  width: 400px;
  height: calc(100vh - 100px);
  background: var(--color-secondary-bg);
  border-right: 1px solid var(--color-border);
  transition: left 0.3s ease;
  z-index: 500;
  display: flex;
  flex-direction: column;
}

.effect-list.visible {
  left: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.list-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text);
}

.close-button {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: var(--color-text);
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: var(--color-text-muted);
}

.status-message.error {
  color: var(--color-secondary-accent);
}

.loading-spinner.small {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-primary-accent);
  color: var(--color-primary-bg);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.effects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

/* 반응형 */
@media (max-width: 768px) {
  .effect-list {
    width: 100%;
    left: -100%;
  }
  
  .effect-list.visible {
    left: 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

### 4.2. EffectListItem.vue

```vue
<template>
  <div 
    class="effect-list-item"
    :class="{ selected: isSelected }"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
    tabindex="0"
    role="button"
    :aria-label="`${effect.name} 효과 선택`"
  >
    <div class="item-thumbnail">
      <img 
        v-if="effect.thumbnail"
        :src="effect.thumbnail"
        :alt="effect.name"
        @error="handleImageError"
      />
      <div v-else class="thumbnail-placeholder">
        <span class="placeholder-icon">✨</span>
      </div>
    </div>
    
    <div class="item-content">
      <h3 class="item-title">{{ effect.name }}</h3>
      <p class="item-description">{{ effect.description }}</p>
      
      <div v-if="effect.relatedGundam.length > 0" class="item-tags">
        <span 
          v-for="gundam in effect.relatedGundam.slice(0, 2)"
          :key="gundam"
          class="tag"
        >
          {{ gundam }}
        </span>
        <span 
          v-if="effect.relatedGundam.length > 2"
          class="tag-more"
        >
          +{{ effect.relatedGundam.length - 2 }}
        </span>
      </div>
    </div>
    
    <div class="item-status">
      <div v-if="isSelected" class="status-indicator active">
        <span class="status-icon">▶</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EffectListItem',
  props: {
    effect: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('select', props.effect.id);
    };
    
    const handleImageError = (event) => {
      // 이미지 로드 실패 시 플레이스홀더로 대체
      event.target.style.display = 'none';
    };
    
    return {
      handleClick,
      handleImageError
    };
  }
};
</script>

<style scoped>
.effect-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-primary-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.effect-list-item:hover {
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}

.effect-list-item:focus {
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.3);
}

.effect-list-item.selected {
  border-color: var(--color-primary-accent);
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.item-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--color-secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.placeholder-icon {
  font-size: 1.5rem;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.item-description {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  background: var(--color-secondary-accent);
  color: var(--color-primary-bg);
  border-radius: 10px;
  font-weight: 500;
}

.tag-more {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.item-status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-indicator.active {
  color: var(--color-primary-accent);
  animation: pulse 2s infinite;
}

.status-icon {
  font-size: 0.875rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .effect-list-item {
    padding: 0.75rem;
  }
  
  .item-thumbnail {
    width: 50px;
    height: 50px;
  }
  
  .item-title {
    font-size: 0.875rem;
  }
  
  .item-description {
    font-size: 0.6875rem;
  }
}
</style>
```

## 5. 구현 체크리스트

### 5.1. 레이아웃 컴포넌트
- [ ] `TheHeader.vue` 구현 완료
- [ ] `TheFooter.vue` 구현 완료
- [ ] 반응형 레이아웃 테스트 완료

### 5.2. 3D 캔버스 컴포넌트
- [ ] `EffectCanvas.vue` 기본 구조 구현
- [ ] Three.js 초기화 로직 구현
- [ ] 효과 동적 로딩 시스템 구현
- [ ] 에러 핸들링 및 로딩 상태 구현
- [ ] 리사이즈 및 성능 최적화

### 5.3. 효과 목록 컴포넌트
- [ ] `EffectList.vue` 구현 완료
- [ ] `EffectListItem.vue` 구현 완료
- [ ] 상태별 UI (로딩/에러/빈상태) 구현
- [ ] 키보드 내비게이션 구현

## 6. 다음 단계

컴포넌트 구현이 완료되면 다음 문서로 진행하세요:

1. **03_State_Management_Guide.md** - Pinia 스토어 구현
2. **04_3D_Effect_System_Guide.md** - Three.js 효과 시스템 구현

## 7. 테스트 가이드

각 컴포넌트 구현 후 다음 사항들을 확인하세요:

### 7.1. 기능 테스트
- 컴포넌트 렌더링 정상 동작
- Props 전달 및 이벤트 발생 확인
- 상태 변화에 따른 UI 업데이트 확인

### 7.2. 접근성 테스트
- 키보드 내비게이션 동작 확인
- 스크린리더 호환성 확인
- 색상 대비 및 포커스 인디케이터 확인

### 7.3. 반응형 테스트
- 모바일, 태블릿, 데스크탑 화면에서 레이아웃 확인
- 터치 인터페이스 동작 확인
