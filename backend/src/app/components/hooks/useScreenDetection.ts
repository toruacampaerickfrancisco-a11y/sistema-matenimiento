import { useState, useEffect } from 'react';

export type ScreenType = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'ultrawide' | 'tv';
export type ScreenCategory = 'small' | 'medium' | 'large' | 'xlarge';

export interface ScreenInfo {
  type: ScreenType;
  category: ScreenCategory;
  width: number;
  height: number;
  aspectRatio: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isUltrawide: boolean;
  isTV: boolean;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  density: 'low' | 'medium' | 'high' | 'ultra';
}

export const useScreenDetection = (): ScreenInfo => {
  const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
    type: 'desktop',
    category: 'large',
    width: 1920,
    height: 1080,
    aspectRatio: 16/9,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isUltrawide: false,
    isTV: false,
    devicePixelRatio: 1,
    orientation: 'landscape',
    density: 'medium',
  });

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const aspectRatio = width / height;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      let type: ScreenType;
      let category: ScreenCategory;
      let density: 'low' | 'medium' | 'high' | 'ultra';
      
      // Detectar densidad de píxeles
      if (devicePixelRatio >= 3) {
        density = 'ultra';
      } else if (devicePixelRatio >= 2) {
        density = 'high';
      } else if (devicePixelRatio >= 1.5) {
        density = 'medium';
      } else {
        density = 'low';
      }
      
      // Detección avanzada por resolución y tipo de dispositivo
      if (width < 480) {
        type = 'mobile';
        category = 'small';
      } else if (width < 768) {
        type = 'mobile';
        category = 'small';
      } else if (width < 1024) {
        type = 'tablet';
        category = 'medium';
      } else if (width < 1366) {
        type = 'laptop';
        category = 'medium';
      } else if (width < 1600) {
        type = 'desktop';
        category = 'large';
      } else if (width < 2560) {
        // Detectar ultrawide por aspect ratio
        type = aspectRatio > 2 ? 'ultrawide' : 'desktop';
        category = 'large';
      } else if (width < 3840) {
        type = aspectRatio > 2.5 ? 'ultrawide' : 'desktop';
        category = 'xlarge';
      } else {
        // 4K o superior
        type = aspectRatio > 2.5 ? 'ultrawide' : 'tv';
        category = 'xlarge';
      }

      const newScreenInfo: ScreenInfo = {
        type,
        category,
        width,
        height,
        aspectRatio,
        isMobile: type === 'mobile',
        isTablet: type === 'tablet',
        isDesktop: ['desktop', 'laptop'].includes(type),
        isUltrawide: type === 'ultrawide',
        isTV: type === 'tv',
        devicePixelRatio,
        orientation,
        density,
      };

      setScreenInfo(newScreenInfo);
      
      // Agregar múltiples clases CSS dinámicas para mejor control
      document.body.className = document.body.className.replace(/screen-\w+|category-\w+|density-\w+|orientation-\w+/g, '');
      document.body.classList.add(
        `screen-${type}`,
        `category-${category}`,
        `density-${density}`,
        `orientation-${orientation}`
      );
      
      console.log('📱 Advanced screen detected:', newScreenInfo);
    };

    // Ejecutar al montar el componente
    updateScreenInfo();

    // Múltiples listeners para mejor detección
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);
    window.addEventListener('load', updateScreenInfo);
    
    // Debounced resize para mejor performance
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateScreenInfo, 150);
    };
    
    window.addEventListener('resize', debouncedResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
      window.removeEventListener('load', updateScreenInfo);
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return screenInfo;
};