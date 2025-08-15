import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useEffect as useEffectContext } from '../../contexts/EffectContext';
import { loadEffectModule } from '../../services/effectService';
import LoadingSpinner from '../ui/LoadingSpinner';

function Scene() {
  const { state } = useEffectContext();
  
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
      
      {/* Effect placeholder - would contain actual 3D effect */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={state.currentParams.color || '#00FFFF'} 
          transparent 
          opacity={0.7}
          emissive={state.currentParams.color || '#00FFFF'}
          emissiveIntensity={0.2}
        />
      </mesh>
    </>
  );
}

export default function EffectCanvas() {
  const { state } = useEffectContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.selectedEffect) {
      setIsLoading(true);
      setError(null);
      
      loadEffectModule(state.selectedEffect.id)
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [state.selectedEffect]);

  return (
    <motion.div 
      className="relative w-full h-full bg-primary-bg rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-bg bg-opacity-80 z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-md text-sm text-muted">
              Loading {state.selectedEffect?.name}...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-bg bg-opacity-80 z-10">
          <div className="text-center">
            <p className="text-danger">Error: {error}</p>
            <button 
              className="neon-button mt-md"
              onClick={() => {
                setError(null);
                if (state.selectedEffect) {
                  loadEffectModule(state.selectedEffect.id);
                }
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5] }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>

      {state.selectedEffect && (
        <div className="absolute bottom-4 left-4 glass-panel p-sm">
          <h3 className="text-sm font-bold text-accent">
            {state.selectedEffect.name}
          </h3>
          <p className="text-xs text-muted mt-xs">
            {state.selectedEffect.relatedGundam.join(', ')}
          </p>
        </div>
      )}
    </motion.div>
  );
}