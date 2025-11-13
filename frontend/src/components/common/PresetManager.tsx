import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Download, Upload } from 'lucide-react';
import { useEffectStore } from '../../store/effectStore';
import { useUIStore } from '../../store/uiStore';
import GlassPanel from '../ui/GlassPanel';
import NeonButton from '../ui/NeonButton';

interface Preset {
  id: string;
  name: string;
  effectId: string;
  params: Record<string, any>;
  createdAt: string;
}

export default function PresetManager() {
  const { modal, closeModal, showToast } = useUIStore();
  const { selectedEffect, currentParams, updateParams, selectEffect } = useEffectStore();
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    try {
      const saved = localStorage.getItem('kirakira-presets');
      if (saved) {
        setPresets(JSON.parse(saved));
      }
    } catch (error) {
      console.error('프리셋 로드 실패:', error);
    }
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      showToast('프리셋 이름을 입력해주세요.', 'warning');
      return;
    }

    if (!selectedEffect) {
      showToast('효과를 선택해주세요.', 'warning');
      return;
    }

    const params = Object.fromEntries(
      Object.entries(currentParams).map(([key, param]) => [key, param.value])
    );

    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      effectId: selectedEffect.id,
      params,
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    localStorage.setItem('kirakira-presets', JSON.stringify(updated));
    setPresets(updated);
    setPresetName('');
    showToast(`프리셋 "${newPreset.name}"이 저장되었습니다.`, 'success');
  };

  const deletePreset = (id: string) => {
    if (!window.confirm('이 프리셋을 삭제하시겠습니까?')) return;

    const updated = presets.filter(p => p.id !== id);
    localStorage.setItem('kirakira-presets', JSON.stringify(updated));
    setPresets(updated);
    showToast('프리셋이 삭제되었습니다.', 'success');
  };

  const applyPreset = (preset: Preset) => {
    // 효과 선택
    selectEffect(preset.effectId);
    
    // 파라미터 적용
    setTimeout(() => {
      updateParams(preset.params);
      showToast(`프리셋 "${preset.name}"이 적용되었습니다.`, 'success');
    }, 100);
  };

  const exportPresets = () => {
    const dataStr = JSON.stringify(presets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kirakira-presets-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('프리셋이 내보내졌습니다.', 'success');
  };

  const importPresets = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          const updated = [...presets, ...imported];
          localStorage.setItem('kirakira-presets', JSON.stringify(updated));
          setPresets(updated);
          showToast(`${imported.length}개의 프리셋이 가져와졌습니다.`, 'success');
        }
      } catch (error) {
        showToast('프리셋 파일 형식이 올바르지 않습니다.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const currentEffectPresets = presets.filter(p => 
    selectedEffect && p.effectId === selectedEffect.id
  );

  if (!modal.visible || modal.component !== 'presets') {
    return null;
  }

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
              <h2 className="text-2xl font-bold text-accent">프리셋 관리</h2>
              <NeonButton onClick={closeModal} size="sm" variant="ghost">
                <X size={20} />
              </NeonButton>
            </div>

            {/* 프리셋 저장 */}
            {selectedEffect && (
              <div className="mb-lg p-md bg-secondary-bg rounded border border-border-primary">
                <h3 className="font-bold text-text-primary mb-sm">새 프리셋 저장</h3>
                <div className="flex gap-sm">
                  <input
                    type="text"
                    placeholder="프리셋 이름"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        savePreset();
                      }
                    }}
                    className="flex-1 px-sm py-xs bg-primary-bg border-2 border-primary-accent rounded text-text-primary"
                  />
                  <NeonButton onClick={savePreset} leftIcon={<Save size={16} />}>
                    저장
                  </NeonButton>
                </div>
              </div>
            )}

            {/* 프리셋 목록 */}
            <div className="flex-1 overflow-y-auto space-y-sm mb-lg">
              {currentEffectPresets.length === 0 ? (
                <div className="text-center py-lg text-text-muted">
                  {selectedEffect 
                    ? '이 효과에 대한 프리셋이 없습니다.'
                    : '효과를 선택하면 프리셋을 저장할 수 있습니다.'}
                </div>
              ) : (
                currentEffectPresets.map((preset) => (
                  <motion.div
                    key={preset.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-md bg-secondary-bg rounded border border-border-primary flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-text-primary">{preset.name}</h4>
                      <p className="text-xs text-text-muted mt-xs">
                        {new Date(preset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-sm">
                      <NeonButton
                        size="sm"
                        variant="primary"
                        onClick={() => applyPreset(preset)}
                      >
                        적용
                      </NeonButton>
                      <NeonButton
                        size="sm"
                        variant="ghost"
                        onClick={() => deletePreset(preset.id)}
                      >
                        <Trash2 size={16} />
                      </NeonButton>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* 가져오기/내보내기 */}
            <div className="flex gap-sm pt-md border-t border-border-primary">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={importPresets}
                  className="hidden"
                />
                <NeonButton
                  as="div"
                  variant="secondary"
                  leftIcon={<Upload size={16} />}
                  className="w-full cursor-pointer"
                >
                  가져오기
                </NeonButton>
              </label>
              <NeonButton
                variant="secondary"
                onClick={exportPresets}
                leftIcon={<Download size={16} />}
                className="flex-1"
              >
                내보내기
              </NeonButton>
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

