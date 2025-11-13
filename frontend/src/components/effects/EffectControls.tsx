import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Save, Share, AlertCircle } from 'lucide-react';
import { useEffectStore } from '../../store/effectStore';
import { useUIStore } from '../../store/uiStore';
import { validateParam } from '../../utils/validation';
import NeonSlider from '../ui/NeonSlider';
import NeonButton from '../ui/NeonButton';
import GlassPanel from '../ui/GlassPanel';

export default function EffectControls() {
  const { selectedEffect, currentParams, updateParam, resetParams } = useEffectStore();
  const { showToast, openModal } = useUIStore();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!selectedEffect) {
    return (
      <GlassPanel className="p-lg text-center">
        <p className="text-muted">효과를 선택하면 컨트롤이 표시됩니다</p>
      </GlassPanel>
    );
  }

  const handleParamChange = (key: string, value: any) => {
    const param = currentParams[key];
    if (!param) return;

    // 입력 검증
    const validation = validateParam(key, value, param);
    
    if (!validation.valid) {
      setValidationErrors(prev => ({ ...prev, [key]: validation.error || '검증 실패' }));
      showToast(validation.error || '입력값이 올바르지 않습니다.', 'warning');
      return;
    }

    // 경고 메시지가 있으면 표시 (값이 조정된 경우)
    if (validation.error) {
      showToast(validation.error, 'info', 2000);
    }

    // 검증 통과 시 업데이트
    updateParam(key, validation.normalizedValue);
    setValidationErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm('모든 설정을 기본값으로 되돌리시겠습니까?')) {
      resetParams();
      setValidationErrors({});
      showToast('파라미터가 기본값으로 리셋되었습니다.', 'success');
    }
  };

  const handleSave = () => {
    openModal('presets');
  };

  const handleShare = async () => {
    const params = Object.fromEntries(
      Object.entries(currentParams).map(([key, param]) => [key, param.value])
    );

    const shareData = {
      effectId: selectedEffect.id,
      params,
      timestamp: new Date().toISOString(),
    };

    const shareUrl = `${window.location.origin}${window.location.pathname}?effect=${selectedEffect.id}&params=${encodeURIComponent(JSON.stringify(params))}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedEffect.name} 효과 설정`,
          text: `건담 효과 "${selectedEffect.name}"의 설정을 공유합니다.`,
          url: shareUrl,
        });
        showToast('공유가 완료되었습니다.', 'success');
      } catch (error) {
        // 사용자가 공유를 취소한 경우는 무시
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('링크가 클립보드에 복사되었습니다.', 'success');
    }).catch(() => {
      showToast('클립보드 복사에 실패했습니다.', 'error');
    });
  };

  const getParamLabel = (key: string): string => {
    const labels: Record<string, string> = {
      particleCount: '입자 개수',
      particleSize: '입자 크기',
      speed: '속도',
      spread: '분산도',
      color: '색상',
      glowIntensity: '글로우 강도',
      intensity: '강도',
      flashSpeed: '섬광 속도',
      waveCount: '파동 개수',
      pulseRate: '펄스 속도',
      turbulence: '터뷸런스',
      opacity: '투명도',
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getParamDescription = (key: string, config: any): string => {
    const descriptions: Record<string, string> = {
      particleCount: '효과의 입자 개수를 조절합니다. 값이 클수록 더 밀도 높은 효과를 보여줍니다.',
      particleSize: '각 입자의 크기를 조절합니다.',
      speed: '입자나 효과의 움직임 속도를 조절합니다.',
      color: '효과의 색상을 변경합니다.',
    };
    return descriptions[key] || `${getParamLabel(key)} 파라미터를 조절합니다.`;
  };

  return (
    <GlassPanel className="p-lg">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="text-lg font-bold text-accent">효과 컨트롤</h3>
        <div className="flex gap-sm">
          <NeonButton 
            onClick={handleReset} 
            size="sm" 
            variant="ghost"
            title="기본값으로 리셋 (Ctrl+R)"
          >
            <RotateCcw size={16} />
          </NeonButton>
          <NeonButton 
            onClick={handleSave} 
            size="sm" 
            variant="secondary"
            title="프리셋 저장"
          >
            <Save size={16} />
          </NeonButton>
          <NeonButton 
            onClick={handleShare} 
            size="sm"
            title="설정 공유"
          >
            <Share size={16} />
          </NeonButton>
        </div>
      </div>

      <div className="space-y-lg">
        {Object.entries(selectedEffect.defaultParams).map(([key, config]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-xs">
              <label 
                htmlFor={`param-${key}`}
                className="block text-sm font-medium text-text-primary mb-xs"
              >
                {getParamLabel(key)}
                {validationErrors[key] && (
                  <span className="ml-xs text-danger text-xs flex items-center gap-xs">
                    <AlertCircle size={12} />
                    {validationErrors[key]}
                  </span>
                )}
              </label>
              {config.type !== 'toggle' && (
                <p className="text-xs text-text-muted mb-sm">
                  {getParamDescription(key, config)}
                </p>
              )}
            </div>

            {config.type === 'slider' ? (
              <NeonSlider
                id={`param-${key}`}
                label=""
                value={typeof currentParams[key]?.value === 'number' ? currentParams[key].value : config.value}
                min={config.min || 0}
                max={config.max || 100}
                step={config.step || 1}
                onChange={(value) => handleParamChange(key, value)}
              />
            ) : config.type === 'color' ? (
              <div className="flex items-center gap-sm">
                <input
                  id={`param-${key}`}
                  type="color"
                  value={typeof currentParams[key]?.value === 'string' ? currentParams[key].value : config.value}
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="w-16 h-10 rounded border-2 border-primary-accent cursor-pointer"
                  aria-label={`${getParamLabel(key)} 색상 선택`}
                />
                <span className="text-accent font-mono text-sm">
                  {typeof currentParams[key]?.value === 'string' ? currentParams[key].value : config.value}
                </span>
              </div>
            ) : config.type === 'toggle' ? (
              <label className="flex items-center gap-sm cursor-pointer">
                <input
                  id={`param-${key}`}
                  type="checkbox"
                  checked={typeof currentParams[key]?.value === 'boolean' ? currentParams[key].value : config.value}
                  onChange={(e) => handleParamChange(key, e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-primary-accent cursor-pointer"
                />
                <span className="text-sm text-text-primary">
                  {getParamLabel(key)} {typeof currentParams[key]?.value === 'boolean' && currentParams[key].value ? '활성화' : '비활성화'}
                </span>
              </label>
            ) : config.type === 'select' && config.options ? (
              <select
                id={`param-${key}`}
                value={currentParams[key]?.value || config.value}
                onChange={(e) => handleParamChange(key, e.target.value)}
                className="w-full p-sm bg-secondary-bg border-2 border-primary-accent rounded text-text-primary"
              >
                {config.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : null}
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
