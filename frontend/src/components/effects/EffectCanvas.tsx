import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useEffectStore } from '../../store/effectStore';
import { EffectService } from '../../services/effectService';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProgressBar from '../ui/ProgressBar';
import { getUserFriendlyMessage } from '../../utils/errorHandler';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 효과 렌더링 컴포넌트
function EffectRenderer() {
  const { selectedEffect, currentParams } = useEffectStore();
  const effectRef = useRef<{ module: any; objects: any } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!selectedEffect) return;

    let mounted = true;
    let retryTimeout: NodeJS.Timeout | null = null;

    const loadEffect = async () => {
      try {
        const { module } = await EffectService.loadEffectModule(selectedEffect.id);
        
        if (!mounted) return;

        // Scene 가져오기 (useThree hook 사용)
        const scene = sceneRef.current;
        if (!scene) {
          console.warn('Scene not available yet, retrying...');
          retryTimeout = setTimeout(loadEffect, 100);
          return;
        }

        // 기존 효과 정리
        if (effectRef.current) {
          effectRef.current.module.dispose(scene, effectRef.current.objects);
        }

        // 새 효과 초기화
        const params = Object.fromEntries(
          Object.entries(currentParams).map(([key, param]) => [key, param.value])
        );
        const objects = module.init(scene, params);

        effectRef.current = { module, objects };
      } catch (error) {
        console.error('Effect load error:', error);
      }
    };

    loadEffect();

    return () => {
      mounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (effectRef.current && sceneRef.current) {
        effectRef.current.module.dispose(sceneRef.current, effectRef.current.objects);
        effectRef.current = null;
      }
    };
  }, [selectedEffect?.id, currentParams]); // currentParams 추가: 파라미터 변경 시 재초기화

  // 애니메이션 루프
  const clock = useRef(new THREE.Clock());
  useFrame((state) => {
    // Scene 참조 저장
    if (!sceneRef.current) {
      sceneRef.current = state.scene;
    }

    if (!effectRef.current || !selectedEffect) return;

    const deltaTime = clock.current.getDelta();
    const params = Object.fromEntries(
      Object.entries(currentParams).map(([key, param]) => [key, param.value])
    );

    effectRef.current.module.update(effectRef.current.objects, params, deltaTime);
  });

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
}

export default function EffectCanvas() {
  const { selectedEffect, status, progress, error } = useEffectStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEffect && status === 'loading') {
      setIsLoading(true);
      setLoadError(null);
    } else if (status === 'succeeded') {
      setIsLoading(false);
    } else if (status === 'failed') {
      setIsLoading(false);
      setLoadError(error || '효과를 로드할 수 없습니다.');
    }
  }, [selectedEffect, status, error]);

  const handleRetry = async () => {
    if (selectedEffect) {
      setLoadError(null);
      setIsLoading(true);
      try {
        await EffectService.loadEffectModule(selectedEffect.id);
        setIsLoading(false);
      } catch (err) {
        setLoadError(getUserFriendlyMessage(err instanceof Error ? err : new Error(String(err))));
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div 
      className="relative w-full h-full bg-primary-bg rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-bg bg-opacity-90 z-10">
          <LoadingSpinner size="lg" />
          <p className="mt-md text-sm text-muted">
            {selectedEffect ? `Loading ${selectedEffect.name}...` : 'Loading effect...'}
          </p>
          {progress > 0 && progress < 100 && (
            <div className="mt-md w-64">
              <ProgressBar progress={progress} showPercentage />
            </div>
          )}
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-bg bg-opacity-90 z-10">
          <div className="text-center max-w-md">
            <p className="text-danger mb-md">{loadError}</p>
            <button 
              className="neon-button"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5] }}
        style={{ background: 'transparent' }}
        onCreated={({ scene }) => {
          // Scene 참조 저장 (EffectRenderer에서 사용)
        }}
      >
        <EffectRenderer />
      </Canvas>

      {selectedEffect && !isLoading && !loadError && (
        <div className="absolute bottom-4 left-4 glass-panel p-sm">
          <h3 className="text-sm font-bold text-accent">
            {selectedEffect.name}
          </h3>
          <p className="text-xs text-muted mt-xs">
            {selectedEffect.relatedGundam.join(', ')}
          </p>
        </div>
      )}
    </motion.div>
  );
}
