import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "./uiStore";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      isInfoPanelVisible: false,
      isLibraryVisible: true,
      isControlsVisible: true,
      isFullscreen: false,
      isMobile: false,
      theme: "dark",
      prefersReducedMotion: false,
      glowEffects: false,
      backgroundParticles: true,
      toasts: [],
      modal: { visible: false, component: null, props: {} },
    });
  });

  it("toggleInfoPanel flips visibility", () => {
    expect(useUIStore.getState().isInfoPanelVisible).toBe(false);
    useUIStore.getState().toggleInfoPanel();
    expect(useUIStore.getState().isInfoPanelVisible).toBe(true);
    useUIStore.getState().toggleInfoPanel();
    expect(useUIStore.getState().isInfoPanelVisible).toBe(false);
  });

  it("toggleLibrary flips visibility", () => {
    expect(useUIStore.getState().isLibraryVisible).toBe(true);
    useUIStore.getState().toggleLibrary();
    expect(useUIStore.getState().isLibraryVisible).toBe(false);
  });

  it("closeAllPanels closes info and library panels", () => {
    useUIStore.setState({
      isInfoPanelVisible: true,
      isLibraryVisible: true,
    });
    useUIStore.getState().closeAllPanels();
    expect(useUIStore.getState().isInfoPanelVisible).toBe(false);
    expect(useUIStore.getState().isLibraryVisible).toBe(false);
  });

  it("detectMobile sets isMobile from viewport width", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });
    useUIStore.getState().detectMobile();
    expect(useUIStore.getState().isMobile).toBe(true);
  });

  it("handleResize closes panels when switching to mobile", () => {
    useUIStore.setState({
      isMobile: false,
      isInfoPanelVisible: true,
      isLibraryVisible: true,
    });
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });
    useUIStore.getState().handleResize();
    expect(useUIStore.getState().isMobile).toBe(true);
    expect(useUIStore.getState().isInfoPanelVisible).toBe(false);
    expect(useUIStore.getState().isLibraryVisible).toBe(false);
  });
});
