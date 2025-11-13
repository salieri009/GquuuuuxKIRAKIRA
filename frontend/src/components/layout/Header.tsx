import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Info, Menu, X, Palette, Zap, Monitor, Maximize2, HelpCircle, Bookmark, Wifi, WifiOff } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useEffectStore } from '../../store/effectStore';
import { useNetworkStatus } from '../../utils/networkStatus';
import Button from '../ui/Button';
import { cn } from '../../utils';

export default function Header() {
  const {
    isInfoPanelVisible,
    isLibraryVisible,
    isControlsVisible,
    isMobile,
    theme,
    glowEffects,
    toggleInfoPanel,
    toggleLibrary,
    toggleControls,
    setTheme,
    setGlowEffects,
    toggleFullscreen,
    initializeUI,
    openModal,
  } = useUIStore();

  const { fetchEffects, isLoading } = useEffectStore();
  const networkStatus = useNetworkStatus();

  useEffect(() => {
    // UI 초기화
    initializeUI();
    
    // 효과 목록 로드
    fetchEffects();
  }, [initializeUI, fetchEffects]);

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <motion.header 
      className={cn(
        'sticky top-0 z-50 backdrop-blur-md border-b',
        'bg-gradient-to-r from-panel-bg/80 to-secondary-bg/80',
        'border-border-primary shadow-panel'
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* 로고 섹션 */}
        <motion.div
          className="flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                'bg-gradient-primary shadow-neon-cyan'
              )}
              whileHover={{ 
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.3)',
                scale: 1.05
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-primary-bg font-bold text-lg font-mono">G</span>
            </motion.div>
            
            {/* 로딩 인디케이터 */}
            {isLoading && (
              <motion.div
                className="absolute -inset-1 rounded-lg border-2 border-primary-accent"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>
          
          <div>
            <h1 className={cn(
              'text-xl font-bold bg-gradient-primary bg-clip-text text-transparent',
              'font-family-display tracking-wide'
            )}>
              Kirakira
            </h1>
            <p className="text-xs text-text-muted">
              Gundam Effects Viewer
            </p>
          </div>
        </motion.div>

              {/* 중앙 상태 표시 */}
              <div className="hidden md:flex items-center gap-2 text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    isLoading ? 'bg-warning animate-pulse' : 'bg-success'
                  )} />
                  <span>
                    {isLoading ? '로딩 중...' : '준비됨'}
                  </span>
                </div>
                
                {/* 네트워크 상태 표시 */}
                <div className="flex items-center gap-1 ml-2">
                  {networkStatus.online ? (
                    <>
                      <Wifi size={14} className="text-success" />
                      <span className="hidden lg:inline">
                        {networkStatus.effectiveType || '온라인'}
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} className="text-danger" />
                      <span className="hidden lg:inline">오프라인</span>
                    </>
                  )}
                </div>
              </div>

        {/* 우측 액션 버튼들 */}
        <div className="flex items-center gap-2">
          
          {/* 데스크탑 네비게이션 */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={isInfoPanelVisible ? "primary" : "ghost"}
              size="sm"
              onClick={toggleInfoPanel}
              leftIcon={<Info size={16} />}
              glow={isInfoPanelVisible && glowEffects}
              title="정보 패널 (Ctrl+I)"
            >
              <span className="hidden lg:inline">정보</span>
            </Button>
            
            <Button
              variant={isLibraryVisible ? "primary" : "ghost"}
              size="sm"
              onClick={toggleLibrary}
              leftIcon={<Menu size={16} />}
              glow={isLibraryVisible && glowEffects}
              title="라이브러리 (Ctrl+L)"
            >
              <span className="hidden lg:inline">라이브러리</span>
            </Button>
            
            <Button
              variant={isControlsVisible ? "secondary" : "ghost"}
              size="sm"
              onClick={toggleControls}
              leftIcon={<Settings size={16} />}
              glow={isControlsVisible && glowEffects}
              title="컨트롤 (Ctrl+K)"
            >
              <span className="hidden lg:inline">컨트롤</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal('help')}
              leftIcon={<HelpCircle size={16} />}
              title="도움말"
            >
              <span className="hidden lg:inline">도움말</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal('presets')}
              leftIcon={<Bookmark size={16} />}
              title="프리셋 관리"
            >
              <span className="hidden lg:inline">프리셋</span>
            </Button>
          </div>

          {/* 구분선 */}
          <div className="w-px h-6 bg-border-primary hidden md:block" />

          {/* 설정 버튼들 */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThemeToggle}
              leftIcon={<Palette size={16} />}
              title="테마 변경"
            >
              <span className="hidden sm:inline capitalize">{theme}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setGlowEffects(!glowEffects)}
              leftIcon={<Zap size={16} />}
              title="글로우 효과 토글"
              className={glowEffects ? 'text-primary-accent' : ''}
            >
              <span className="hidden sm:inline">
                {glowEffects ? 'ON' : 'OFF'}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              leftIcon={<Maximize2 size={16} />}
              title="풀스크린 (Ctrl+Enter)"
            />
          </div>

          {/* 모바일 메뉴 */}
          {isMobile && (
            <>
              <div className="w-px h-6 bg-border-primary" />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLibrary}
                leftIcon={isLibraryVisible ? <X size={18} /> : <Menu size={18} />}
                title="메뉴"
              />
            </>
          )}
        </div>
      </div>

      {/* 글로우 효과 */}
      {glowEffects && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-accent/5 via-transparent to-secondary-accent/5 pointer-events-none"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
      )}
    </motion.header>
  );
}