import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UIState, ToastMessage, ModalState } from '../types';

interface UIStoreState extends UIState {
  // Toast 관련
  toasts: ToastMessage[];
  
  // Modal 관련
  modal: ModalState;
  
  // Getters
  isOverlayOpen: () => boolean;
  isSidebarOpen: () => boolean;
  isCanvasMainView: () => boolean;
  themeClass: () => string;
  activePanelCount: () => number;
  
  // Actions
  toggleInfoPanel: () => void;
  toggleLibrary: () => void;
  toggleControls: () => void;
  closeAllPanels: () => void;
  toggleFullscreen: () => Promise<void>;
  setTheme: (theme: 'dark' | 'light' | 'high-contrast') => void;
  detectMobile: () => void;
  detectReducedMotion: () => void;
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => void;
  hideToast: (id: string) => void;
  openModal: (component: string, props?: Record<string, any>) => void;
  closeModal: () => void;
  handleKeyboardShortcut: (event: KeyboardEvent) => void;
  handleResize: () => void;
  initializeUI: () => void;
  cleanupUI: () => void;
  setGlowEffects: (enabled: boolean) => void;
  setBackgroundParticles: (enabled: boolean) => void;
}

const initialState: UIState = {
  isInfoPanelVisible: false,
  isLibraryVisible: true,
  isControlsVisible: true,
  isFullscreen: false,
  isMobile: false,
  theme: 'dark',
  prefersReducedMotion: false,
  glowEffects: true,
  backgroundParticles: true,
};

export const useUIStore = create<UIStoreState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        toasts: [],
        modal: {
          visible: false,
          component: null,
          props: {},
        },

        // Getters
        isOverlayOpen: () => {
          const state = get();
          return state.isInfoPanelVisible || state.isLibraryVisible || state.modal.visible;
        },

        isSidebarOpen: () => {
          const state = get();
          return state.isInfoPanelVisible || state.isLibraryVisible;
        },

        isCanvasMainView: () => {
          const state = get();
          return !state.isInfoPanelVisible && !state.isLibraryVisible;
        },

        themeClass: () => `theme-${get().theme}`,

        activePanelCount: () => {
          const state = get();
          let count = 0;
          if (state.isInfoPanelVisible) count++;
          if (state.isLibraryVisible) count++;
          if (state.isControlsVisible) count++;
          return count;
        },

        // Actions
        toggleInfoPanel: () => {
          set((draft) => {
            draft.isInfoPanelVisible = !draft.isInfoPanelVisible;
            
            // 모바일에서는 라이브러리 패널 자동 닫기
            if (draft.isMobile && draft.isInfoPanelVisible) {
              draft.isLibraryVisible = false;
            }
          });
          
          console.log(`정보 패널: ${get().isInfoPanelVisible ? '열림' : '닫힘'}`);
        },

        toggleLibrary: () => {
          set((draft) => {
            draft.isLibraryVisible = !draft.isLibraryVisible;
            
            // 모바일에서는 정보 패널 자동 닫기
            if (draft.isMobile && draft.isLibraryVisible) {
              draft.isInfoPanelVisible = false;
            }
          });
          
          console.log(`라이브러리 패널: ${get().isLibraryVisible ? '열림' : '닫힘'}`);
        },

        toggleControls: () => {
          set((draft) => {
            draft.isControlsVisible = !draft.isControlsVisible;
          });
          
          console.log(`컨트롤 패널: ${get().isControlsVisible ? '열림' : '닫힘'}`);
        },

        closeAllPanels: () => {
          set((draft) => {
            draft.isInfoPanelVisible = false;
            draft.isLibraryVisible = false;
          });
          
          console.log('모든 패널이 닫혔습니다.');
        },

        toggleFullscreen: async () => {
          try {
            const state = get();
            
            if (!state.isFullscreen) {
              await document.documentElement.requestFullscreen();
              set((draft) => { draft.isFullscreen = true; });
            } else {
              await document.exitFullscreen();
              set((draft) => { draft.isFullscreen = false; });
            }
          } catch (error) {
            console.warn('풀스크린 모드 변경 실패:', error);
            get().showToast('풀스크린 모드를 변경할 수 없습니다.', 'warning');
          }
        },

        setTheme: (theme: 'dark' | 'light' | 'high-contrast') => {
          if (!['dark', 'light', 'high-contrast'].includes(theme)) {
            console.warn('지원하지 않는 테마:', theme);
            return;
          }

          set((draft) => {
            draft.theme = theme;
          });
          
          // 로컬 스토리지에 저장
          try {
            localStorage.setItem('kirakira-theme', theme);
          } catch (error) {
            console.warn('테마 설정 저장 실패:', error);
          }
          
          // HTML에 테마 적용
          document.documentElement.setAttribute('data-theme', theme);
          
          console.log(`테마 변경: ${theme}`);
        },

        detectMobile: () => {
          const isMobile = window.innerWidth <= 768 || 
                          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          const wasMobile = get().isMobile;
          
          set((draft) => {
            draft.isMobile = isMobile;
          });
          
          // 모바일에서는 모든 패널 기본 닫기
          if (isMobile && !wasMobile) {
            get().closeAllPanels();
          }
          
          console.log(`모바일 환경: ${isMobile}`);
        },

        detectReducedMotion: () => {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          set((draft) => {
            draft.prefersReducedMotion = prefersReducedMotion;
          });
          
          console.log(`모션 감소 모드: ${prefersReducedMotion}`);
        },

        showToast: (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration: number = 3000) => {
          const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          set((draft) => {
            draft.toasts.push({
              id,
              message,
              type,
              duration,
              visible: true,
            });
          });
          
          // 자동 제거 타이머
          setTimeout(() => {
            get().hideToast(id);
          }, duration);
          
          console.log(`토스트 표시: ${message}`);
        },

        hideToast: (id: string) => {
          set((draft) => {
            const index = draft.toasts.findIndex(toast => toast.id === id);
            if (index !== -1) {
              draft.toasts.splice(index, 1);
            }
          });
        },

        openModal: (component: string, props: Record<string, any> = {}) => {
          set((draft) => {
            draft.modal = {
              visible: true,
              component,
              props,
            };
          });
          
          console.log(`모달 열림: ${component}`);
        },

        closeModal: () => {
          set((draft) => {
            draft.modal = {
              visible: false,
              component: null,
              props: {},
            };
          });
          
          console.log('모달 닫힘');
        },

        handleKeyboardShortcut: (event: KeyboardEvent) => {
          const actions = get();
          
          // Escape 키: 모든 오버레이 닫기
          if (event.key === 'Escape') {
            if (actions.modal.visible) {
              actions.closeModal();
            } else if (actions.isOverlayOpen()) {
              actions.closeAllPanels();
            }
            return;
          }
          
          // Ctrl/Cmd + 단축키들
          if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
              case 'i':
                event.preventDefault();
                actions.toggleInfoPanel();
                break;
              case 'l':
                event.preventDefault();
                actions.toggleLibrary();
                break;
              case 'Enter':
                event.preventDefault();
                actions.toggleFullscreen();
                break;
              case 'k':
                event.preventDefault();
                actions.toggleControls();
                break;
            }
          }
        },

        handleResize: () => {
          const wasMobile = get().isMobile;
          get().detectMobile();
          
          // 모바일 ↔ 데스크탑 전환 시 레이아웃 조정
          const isMobile = get().isMobile;
          if (wasMobile !== isMobile && isMobile) {
            get().closeAllPanels();
          }
        },

        initializeUI: () => {
          const actions = get();
          
          // 로컬 스토리지에서 테마 불러오기
          try {
            const savedTheme = localStorage.getItem('kirakira-theme') as 'dark' | 'light' | 'high-contrast';
            if (savedTheme && ['dark', 'light', 'high-contrast'].includes(savedTheme)) {
              actions.setTheme(savedTheme);
            }
          } catch (error) {
            console.warn('저장된 테마 로드 실패:', error);
          }
          
          // 환경 감지
          actions.detectMobile();
          actions.detectReducedMotion();
          
          // 이벤트 리스너 등록
          window.addEventListener('resize', actions.handleResize);
          document.addEventListener('keydown', actions.handleKeyboardShortcut);
          
          // 풀스크린 상태 변화 감지
          document.addEventListener('fullscreenchange', () => {
            set((draft) => {
              draft.isFullscreen = !!document.fullscreenElement;
            });
          });
          
          // 모션 설정 변화 감지
          const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
          const handleMotionChange = (e: MediaQueryListEvent) => {
            set((draft) => {
              draft.prefersReducedMotion = e.matches;
            });
          };
          mediaQuery.addEventListener('change', handleMotionChange);
          
          console.log('UI 초기화 완료');
        },

        cleanupUI: () => {
          const actions = get();
          window.removeEventListener('resize', actions.handleResize);
          document.removeEventListener('keydown', actions.handleKeyboardShortcut);
        },

        setGlowEffects: (enabled: boolean) => {
          set((draft) => {
            draft.glowEffects = enabled;
          });
          
          // HTML에 속성 적용
          document.documentElement.setAttribute('data-glow-effects', enabled.toString());
          console.log(`글로우 효과: ${enabled ? '활성화' : '비활성화'}`);
        },

        setBackgroundParticles: (enabled: boolean) => {
          set((draft) => {
            draft.backgroundParticles = enabled;
          });
          
          console.log(`배경 파티클: ${enabled ? '활성화' : '비활성화'}`);
        },
      })),
      {
        name: 'ui-store',
      }
    )
  )
);

// 스토어 구독자 설정 (디버깅용)
if (import.meta.env.DEV) {
  useUIStore.subscribe(
    (state) => state.theme,
    (theme) => {
      console.log('Theme changed:', theme);
    }
  );

  useUIStore.subscribe(
    (state) => state.isMobile,
    (isMobile) => {
      console.log('Mobile state changed:', isMobile);
    }
  );
}
