import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useResponsive } from "./useResponsive";
import { useUIStore } from "../store/uiStore";

describe("useResponsive", () => {
  beforeEach(() => {
    useUIStore.setState({
      isMobile: false,
      isInfoPanelVisible: false,
      isLibraryVisible: true,
      isControlsVisible: true,
    });
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("calls handleResize on mount and registers resize listener", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useResponsive());

    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("updates mobile state when viewport shrinks", () => {
    renderHook(() => useResponsive());

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 480,
    });

    window.dispatchEvent(new Event("resize"));
    expect(useUIStore.getState().isMobile).toBe(true);
  });
});
