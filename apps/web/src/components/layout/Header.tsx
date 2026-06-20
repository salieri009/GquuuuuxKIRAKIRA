import React, { useEffect, useState } from "react";
import {
  Settings,
  Info,
  Menu,
  X,
  Maximize2,
  HelpCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useEffectStore } from "../../store/effectStore";
import Button from "../ui/Button";
import { cn } from "../../utils";

export default function Header() {
  const {
    isLibraryVisible,
    isControlsVisible,
    isMobile,
    toggleInfoPanel,
    toggleLibrary,
    toggleControls,
    toggleFullscreen,
    initializeUI,
    openModal,
  } = useUIStore();

  const { fetchEffects, status } = useEffectStore();
  const isLoading = status === "loading";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    initializeUI();
    fetchEffects();
  }, [initializeUI, fetchEffects]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 border-b border-border-primary",
        "bg-panel-bg/95 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-text-primary tracking-tight truncate">
              Kirakira
            </h1>
            <p className="text-xs text-text-muted truncate hidden sm:block">
              Gundam Effects
            </p>
          </div>
          {isLoading && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary-accent animate-pulse shrink-0"
              aria-hidden
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={isLibraryVisible ? "primary" : "ghost"}
              size="sm"
              onClick={toggleLibrary}
              leftIcon={<Menu size={16} />}
              title="라이브러리 (Ctrl+L)"
            >
              <span className="hidden lg:inline">라이브러리</span>
            </Button>

            <Button
              variant={isControlsVisible ? "primary" : "ghost"}
              size="sm"
              onClick={toggleControls}
              leftIcon={<Settings size={16} />}
              title="컨트롤 (Ctrl+K)"
            >
              <span className="hidden lg:inline">컨트롤</span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                leftIcon={<MoreHorizontal size={16} />}
                title="더보기"
                aria-expanded={menuOpen}
              >
                <span className="hidden lg:inline">더보기</span>
              </Button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 py-1 min-w-[10rem] rounded-md border border-border-primary bg-tertiary-bg shadow-lg z-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-glass-bg hover:text-text-primary flex items-center gap-2"
                    onClick={() => {
                      toggleInfoPanel();
                      setMenuOpen(false);
                    }}
                  >
                    <Info size={14} /> 정보
                  </button>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-glass-bg hover:text-text-primary flex items-center gap-2"
                    onClick={() => {
                      openModal("help");
                      setMenuOpen(false);
                    }}
                  >
                    <HelpCircle size={14} /> 도움말
                  </button>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-glass-bg hover:text-text-primary flex items-center gap-2"
                    onClick={() => {
                      openModal("presets");
                      setMenuOpen(false);
                    }}
                  >
                    <Bookmark size={14} /> 프리셋
                  </button>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            leftIcon={<Maximize2 size={16} />}
            title="풀스크린 (Ctrl+Enter)"
            className="hidden md:inline-flex"
          />

          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLibrary}
              leftIcon={isLibraryVisible ? <X size={18} /> : <Menu size={18} />}
              title="메뉴"
            />
          )}
        </div>
      </div>
    </header>
  );
}
