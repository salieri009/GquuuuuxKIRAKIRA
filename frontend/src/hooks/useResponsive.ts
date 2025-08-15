import { useEffect } from 'react';
import { useUI } from '../contexts/UIContext';

export function useResponsive() {
  const { dispatch } = useUI();

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      dispatch({ type: 'SET_MOBILE', payload: isMobile });
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [dispatch]);
}