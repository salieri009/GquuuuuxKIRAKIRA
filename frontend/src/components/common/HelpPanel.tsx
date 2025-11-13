import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, HelpCircle, BookOpen, Lightbulb } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import GlassPanel from '../ui/GlassPanel';
import NeonButton from '../ui/NeonButton';

export default function HelpPanel() {
  const { modal, closeModal } = useUIStore();

  if (!modal.visible || modal.component !== 'help') {
    return null;
  }

  const shortcuts = [
    { key: 'Ctrl/Cmd + I', description: '정보 패널 열기/닫기' },
    { key: 'Ctrl/Cmd + L', description: '라이브러리 패널 열기/닫기' },
    { key: 'Ctrl/Cmd + K', description: '컨트롤 패널 열기/닫기' },
    { key: 'Ctrl/Cmd + Enter', description: '풀스크린 모드 전환' },
    { key: 'Ctrl/Cmd + R', description: '파라미터 기본값으로 리셋' },
    { key: 'Escape', description: '모든 패널 닫기' },
  ];

  const tips = [
    {
      icon: <Lightbulb size={20} />,
      title: '효과 탐색',
      content: '라이브러리에서 효과를 클릭하여 선택하고, 검색 기능을 사용하여 원하는 효과를 빠르게 찾을 수 있습니다.',
    },
    {
      icon: <Lightbulb size={20} />,
      title: '파라미터 조정',
      content: '컨트롤 패널에서 슬라이더와 컬러 피커를 사용하여 효과의 파라미터를 실시간으로 조정할 수 있습니다.',
    },
    {
      icon: <Lightbulb size={20} />,
      title: '3D 뷰 조작',
      content: '마우스로 드래그하여 카메라를 회전하고, 스크롤로 확대/축소할 수 있습니다.',
    },
    {
      icon: <Lightbulb size={20} />,
      title: '프리셋 저장',
      content: '컨트롤 패널의 저장 버튼을 클릭하여 현재 설정을 프리셋으로 저장할 수 있습니다.',
    },
    {
      icon: <Lightbulb size={20} />,
      title: '즐겨찾기',
      content: '효과 카드의 별 아이콘을 클릭하여 즐겨찾기에 추가하거나 제거할 수 있습니다.',
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassPanel className="p-lg h-full flex flex-col">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <HelpCircle className="w-6 h-6 text-primary-accent" />
                <h2 className="text-2xl font-bold text-accent">도움말</h2>
              </div>
              <NeonButton onClick={closeModal} size="sm" variant="ghost">
                <X size={20} />
              </NeonButton>
            </div>

            <div className="flex-1 overflow-y-auto space-y-lg">
              {/* 키보드 단축키 */}
              <section>
                <div className="flex items-center gap-sm mb-md">
                  <Keyboard className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-lg font-bold text-text-primary">키보드 단축키</h3>
                </div>
                <div className="space-y-sm">
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between p-sm bg-secondary-bg rounded border border-border-primary"
                    >
                      <kbd className="px-2 py-1 bg-primary-bg border border-primary-accent rounded text-sm font-mono text-accent">
                        {shortcut.key}
                      </kbd>
                      <span className="text-sm text-text-secondary">{shortcut.description}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 사용 팁 */}
              <section>
                <div className="flex items-center gap-sm mb-md">
                  <BookOpen className="w-5 h-5 text-primary-accent" />
                  <h3 className="text-lg font-bold text-text-primary">사용 팁</h3>
                </div>
                <div className="space-y-md">
                  {tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-md bg-secondary-bg rounded border border-border-primary"
                    >
                      <div className="flex items-start gap-sm">
                        <div className="text-primary-accent flex-shrink-0 mt-xs">
                          {tip.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary mb-xs">{tip.title}</h4>
                          <p className="text-sm text-text-secondary">{tip.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* 정보 */}
              <section>
                <div className="p-md bg-secondary-bg rounded border border-border-primary">
                  <h4 className="font-bold text-text-primary mb-sm">프로젝트 정보</h4>
                  <p className="text-sm text-text-secondary">
                    Kirakira는 건담 시리즈의 시각 효과를 Three.js로 구현한 인터랙티브 웹 애플리케이션입니다.
                    다양한 효과를 탐색하고 파라미터를 조정하여 나만의 효과를 만들어보세요.
                  </p>
                </div>
              </section>
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

