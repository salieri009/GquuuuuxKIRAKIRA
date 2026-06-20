import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { UIState, ToastMessage, ModalState } from "../types";

interface UIStoreState extends UIState {
  // Toast 관련
  toasts: ToastMessage[];

  // Modal 관련
  modal: ModalState;

  // Getters
  isOverlayOpen: () => boolean;

  // Actions
  toggleInfoPanel: () => void;
  toggleLibrary: () => void;
  toggleControls: () => void;
  closeAllPanels: () => void;
  toggleFullscreen: () => Promise<void>;
  setTheme: (theme: "dark" | "light" | "high-contrast") => void;
  detectMobile: () => void;
  detectReducedMotion: () => void;
  showToast: (
    message: string,
    type?: "info" | "success" | "warning" | "error",
    duration?: number,
  ) => void;
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
  theme: "dark",
  prefersReducedMotion: false,
  glowEffects: false,
  backgroundParticles: true,
};

export const useUIStore = create<UIStoreState>()(
  devtools(
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
        return (
          state.isInfoPanelVisible ||
          state.isLibraryVisible ||
          state.modal.visible
        );
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
      },

      toggleLibrary: () => {
        set((draft) => {
          draft.isLibraryVisible = !draft.isLibraryVisible;

          // 모바일에서는 정보 패널 자동 닫기
          if (draft.isMobile && draft.isLibraryVisible) {
            draft.isInfoPanelVisible = false;
          }
        });
      },

      toggleControls: () => {
        set((draft) => {
          draft.isControlsVisible = !draft.isControlsVisible;
        });
      },

      closeAllPanels: () => {
        set((draft) => {
          draft.isInfoPanelVisible = false;
          draft.isLibraryVisible = false;
        });
      },

      toggleFullscreen: async () => {
        try {
          const state = get();

          if (!state.isFullscreen) {
            await document.documentElement.requestFullscreen();
            set((draft) => {
              draft.isFullscreen = true;
            });
          } else {
            await document.exitFullscreen();
            set((draft) => {
              draft.isFullscreen = false;
            });
          }
        } catch (error) {
          console.warn("풀스크린 모드 변경 실패:", error);
          get().showToast("풀스크린 모드를 변경할 수 없습니다.", "warning");
        }
      },

      setTheme: (theme: "dark" | "light" | "high-contrast") => {
        if (!["dark", "light", "high-contrast"].includes(theme)) {
          console.warn("지원하지 않는 테마:", theme);
          return;
        }

        set((draft) => {
          draft.theme = theme;
        });

        // 로컬 스토리지에 저장
        try {
          localStorage.setItem("kirakira-theme", theme);
        } catch (error) {
          console.warn("테마 설정 저장 실패:", error);
        }

        // HTML에 테마 적용
        document.documentElement.setAttribute("data-theme", theme);
      },

      detectMobile: () => {
        const isMobile =
          window.innerWidth <= 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          );

        const wasMobile = get().isMobile;

        set((draft) => {
          draft.isMobile = isMobile;
        });

        // 모바일에서는 모든 패널 기본 닫기
        if (isMobile && !wasMobile) {
          get().closeAllPanels();
        }
      },

      detectReducedMotion: () => {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        set((draft) => {
          draft.prefersReducedMotion = prefersReducedMotion;
        });
      },

      showToast: (
        message: string,
        type: "info" | "success" | "warning" | "error" = "info",
        duration: number = 3000,
      ) => {
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
      },

      hideToast: (id: string) => {
        set((draft) => {
          const index = draft.toasts.findIndex((toast) => toast.id === id);
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
      },

      closeModal: () => {
        set((draft) => {
          draft.modal = {
            visible: false,
            component: null,
            props: {},
          };
        });
      },

      handleKeyboardShortcut: (event: KeyboardEvent) => {
        const actions = get();

        // Escape 키: 모든 오버레이 닫기
        if (event.key === "Escape") {
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
            case "i":
              event.preventDefault();
              actions.toggleInfoPanel();
              break;
            case "l":
              event.preventDefault();
              actions.toggleLibrary();
              break;
            case "Enter":
              event.preventDefault();
              actions.toggleFullscreen();
              break;
            case "k":
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
          const savedTheme = localStorage.getItem("kirakira-theme") as
            | "dark"
            | "light"
            | "high-contrast";
          if (
            savedTheme &&
            ["dark", "light", "high-contrast"].includes(savedTheme)
          ) {
            actions.setTheme(savedTheme);
          }
        } catch (error) {
          console.warn("저장된 테마 로드 실패:", error);
        }

        // 환경 감지
        actions.detectMobile();
        actions.detectReducedMotion();
        document.documentElement.setAttribute("data-motion", "full");

        // 이벤트 리스너 등록
        window.addEventListener("resize", actions.handleResize);
        document.addEventListener("keydown", actions.handleKeyboardShortcut);

        // 풀스크린 상태 변화 감지
        document.addEventListener("fullscreenchange", () => {
          set((draft) => {
            draft.isFullscreen = !!document.fullscreenElement;
          });
        });

        // 모션 설정 변화 감지
        const mediaQuery = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );
        const handleMotionChange = (e: MediaQueryListEvent) => {
          set((draft) => {
            draft.prefersReducedMotion = e.matches;
          });
        };
        mediaQuery.addEventListener("change", handleMotionChange);
      },

      cleanupUI: () => {
        const actions = get();
        window.removeEventListener("resize", actions.handleResize);
        document.removeEventListener("keydown", actions.handleKeyboardShortcut);
      },

      setGlowEffects: (enabled: boolean) => {
        set((draft) => {
          draft.glowEffects = enabled;
        });

        // HTML에 속성 적용
        document.documentElement.setAttribute(
          "data-glow-effects",
          enabled.toString(),
        );
      },

      setBackgroundParticles: (enabled: boolean) => {
        set((draft) => {
          draft.backgroundParticles = enabled;
        });
      },
    })),
    {
      name: "ui-store",
    },
  ),
);
