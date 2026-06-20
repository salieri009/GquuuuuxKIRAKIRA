import React, { useState, useCallback } from "react";
import { RotateCcw, Save, Share, AlertCircle } from "lucide-react";
import { useEffectStore } from "../../store/effectStore";
import { useUIStore } from "../../store/uiStore";
import { validateParam } from "../../utils/validation";
import NeonSlider from "../ui/NeonSlider";
import Button from "../ui/Button";
import GlassPanel from "../ui/GlassPanel";
import { paramValuesFromRecord } from "../../utils/effectParams";
import { buildShareUrl } from "../../utils/shareUrl";

export default function EffectControls() {
  const { selectedEffect, currentParams, updateParam, resetParams } =
    useEffectStore();
  const { showToast, openModal } = useUIStore();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [confirmReset, setConfirmReset] = useState(false);

  const handleParamChange = useCallback(
    (key: string, value: unknown) => {
      const param = currentParams[key];
      if (!param) return;

      const validation = validateParam(key, value, param);

      if (!validation.valid) {
        setValidationErrors((prev) => ({
          ...prev,
          [key]: validation.error || "검증 실패",
        }));
        showToast(validation.error || "입력값이 올바르지 않습니다.", "warning");
        return;
      }

      updateParam(key, validation.normalizedValue);
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [currentParams, updateParam, showToast],
  );

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetParams();
    setValidationErrors({});
    setConfirmReset(false);
  }, [confirmReset, resetParams]);

  if (!selectedEffect) {
    return (
      <GlassPanel className="p-6 text-center">
        <p className="text-muted text-sm">
          효과를 선택하면 컨트롤이 표시됩니다
        </p>
      </GlassPanel>
    );
  }

  const handleShare = async () => {
    const shareUrl = buildShareUrl(
      selectedEffect.id,
      paramValuesFromRecord(currentParams),
    );

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedEffect.name} 효과 설정`,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("링크가 복사되었습니다.", "success");
      })
      .catch(() => {
        showToast("클립보드 복사에 실패했습니다.", "error");
      });
  };

  const getParamLabel = (key: string): string => {
    const labels: Record<string, string> = {
      particleCount: "입자 개수",
      particleSize: "입자 크기",
      speed: "속도",
      spread: "분산도",
      color: "색상",
      glowIntensity: "글로우 강도",
      intensity: "강도",
      density: "밀도",
      turbulence: "난류",
      opacity: "투명도",
      fieldStrength: "필드 강도",
      geometry: "기하",
      rotation: "회전",
      power: "출력",
      heat: "열",
      afterglow: "잔광",
      ripples: "파동",
      frequency: "주파수",
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const inputClass =
    "w-full p-2 text-sm bg-secondary-bg border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-accent";

  return (
    <GlassPanel className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">효과 컨트롤</h3>
        <div className="flex gap-2 items-center">
          {confirmReset ? (
            <>
              <span className="text-xs text-text-muted">리셋할까요?</span>
              <Button onClick={handleReset} size="sm" variant="danger">
                확인
              </Button>
              <Button
                onClick={() => setConfirmReset(false)}
                size="sm"
                variant="ghost"
              >
                취소
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleReset}
                size="sm"
                variant="ghost"
                title="기본값으로 리셋"
              >
                <RotateCcw size={16} />
              </Button>
              <Button
                onClick={() => openModal("presets")}
                size="sm"
                variant="ghost"
                title="프리셋"
              >
                <Save size={16} />
              </Button>
              <Button
                onClick={handleShare}
                size="sm"
                variant="ghost"
                title="공유"
              >
                <Share size={16} />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(selectedEffect.defaultParams).map(([key, config]) => (
          <div key={key}>
            <label
              htmlFor={`param-${key}`}
              className="block text-xs font-medium text-text-secondary mb-2"
            >
              {getParamLabel(key)}
              {validationErrors[key] && (
                <span className="ml-1 text-danger inline-flex items-center gap-1">
                  <AlertCircle size={12} />
                  {validationErrors[key]}
                </span>
              )}
            </label>

            {config.type === "slider" ? (
              <NeonSlider
                id={`param-${key}`}
                label=""
                value={
                  typeof currentParams[key]?.value === "number"
                    ? currentParams[key].value
                    : (config.value as number)
                }
                min={config.min || 0}
                max={config.max || 100}
                step={config.step || 1}
                onChange={(value) => handleParamChange(key, value)}
              />
            ) : config.type === "color" ? (
              <div className="flex items-center gap-2">
                <input
                  id={`param-${key}`}
                  type="color"
                  value={
                    typeof currentParams[key]?.value === "string"
                      ? currentParams[key].value
                      : (config.value as string)
                  }
                  onChange={(e) => handleParamChange(key, e.target.value)}
                  className="w-10 h-9 rounded border border-border-primary cursor-pointer bg-transparent"
                  aria-label={`${getParamLabel(key)} 색상`}
                />
                <span className="text-xs font-mono text-text-muted">
                  {typeof currentParams[key]?.value === "string"
                    ? currentParams[key].value
                    : config.value}
                </span>
              </div>
            ) : config.type === "toggle" ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id={`param-${key}`}
                  type="checkbox"
                  checked={
                    typeof currentParams[key]?.value === "boolean"
                      ? currentParams[key].value
                      : (config.value as boolean)
                  }
                  onChange={(e) => handleParamChange(key, e.target.checked)}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-sm text-text-secondary">활성화</span>
              </label>
            ) : config.type === "select" && config.options ? (
              <select
                id={`param-${key}`}
                value={String(currentParams[key]?.value ?? config.value)}
                onChange={(e) => handleParamChange(key, e.target.value)}
                className={inputClass}
              >
                {config.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
