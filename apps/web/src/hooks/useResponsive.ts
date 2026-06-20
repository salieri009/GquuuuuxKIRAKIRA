import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";

/**
 * Syncs viewport size with uiStore. Prefer initializeUI() in Header for full setup;
 * this hook is available for isolated testing and optional use.
 */
export function useResponsive() {
  const handleResize = useUIStore((state) => state.handleResize);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
}
