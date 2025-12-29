import { useEffect, useState } from 'react';
import { useScreenDetection, ScreenInfo } from './useScreenDetection';

export interface AutoLayoutConfig {
  sidebarWidth: number;
  contentMaxWidth: number;
  contentPadding: number;
  tableColumns: 'auto' | 'responsive' | 'full' | 'expanded';
  fontSize: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  itemsPerPage: number;
  buttonSize: 'small' | 'medium' | 'large';
  spacing: 'tight' | 'normal' | 'loose';
  headerHeight: number;
  bannerPadding: number;
}

export const useAutoLayout = () => {
  const screenInfo = useScreenDetection();
  const [layoutConfig, setLayoutConfig] = useState<AutoLayoutConfig>({
    sidebarWidth: 320,
    contentMaxWidth: 1400,
    contentPadding: 30,
    tableColumns: 'auto',
    fontSize: 'medium',
    itemsPerPage: 10,
    buttonSize: 'medium',
    spacing: 'normal',
    headerHeight: 70,
    bannerPadding: 15,
  });

  useEffect(() => {
    const calculateOptimalLayout = (screen: ScreenInfo): AutoLayoutConfig => {
      const { type, category, width, height, aspectRatio, density, orientation } = screen;

      // Configuración base por categoría de pantalla
      let baseConfig: AutoLayoutConfig;

      switch (category) {
        case 'small': // Móviles y pantallas pequeñas
          baseConfig = {
            sidebarWidth: orientation === 'portrait' ? 0 : 60,
            contentMaxWidth: width - 20,
            contentPadding: 10,
            tableColumns: 'responsive',
            fontSize: density === 'high' ? 'small' : 'xs',
            itemsPerPage: 5,
            buttonSize: 'small',
            spacing: 'tight',
            headerHeight: 60,
            bannerPadding: 10,
          };
          break;

        case 'medium': // Tablets y laptops pequeñas
          baseConfig = {
            sidebarWidth: width < 900 ? 200 : 250,
            contentMaxWidth: Math.min(width - 280, 1000),
            contentPadding: 20,
            tableColumns: 'responsive',
            fontSize: 'small',
            itemsPerPage: 8,
            buttonSize: 'medium',
            spacing: 'normal',
            headerHeight: 65,
            bannerPadding: 12,
          };
          break;

        case 'large': // Desktop estándar
          baseConfig = {
            sidebarWidth: aspectRatio > 2.2 ? 280 : 320,
            contentMaxWidth: Math.min(width - 380, 1400),
            contentPadding: aspectRatio > 2.2 ? 25 : 30,
            tableColumns: aspectRatio > 2.2 ? 'expanded' : 'full',
            fontSize: 'medium',
            itemsPerPage: aspectRatio > 2.2 ? 18 : 15,
            buttonSize: 'medium',
            spacing: 'normal',
            headerHeight: 70,
            bannerPadding: 15,
          };
          break;

        case 'xlarge': // 4K, TV, Ultrawide
          baseConfig = {
            sidebarWidth: aspectRatio > 2.5 ? 320 : 350,
            contentMaxWidth: Math.min(width - 400, aspectRatio > 2.5 ? 2000 : 1600),
            contentPadding: aspectRatio > 2.5 ? 35 : 40,
            tableColumns: 'expanded',
            fontSize: density === 'high' || density === 'ultra' ? 'medium' : 'large',
            itemsPerPage: aspectRatio > 2.5 ? 25 : 20,
            buttonSize: 'large',
            spacing: 'loose',
            headerHeight: 80,
            bannerPadding: 20,
          };
          break;

        default:
          baseConfig = {
            sidebarWidth: 320,
            contentMaxWidth: 1400,
            contentPadding: 30,
            tableColumns: 'auto',
            fontSize: 'medium',
            itemsPerPage: 10,
            buttonSize: 'medium',
            spacing: 'normal',
            headerHeight: 70,
            bannerPadding: 15,
          };
      }

      // Ajustes específicos por tipo de dispositivo
      switch (type) {
        case 'ultrawide':
          baseConfig.tableColumns = 'expanded';
          baseConfig.contentMaxWidth = Math.min(width * 0.85, 2200);
          baseConfig.itemsPerPage = Math.min(30, baseConfig.itemsPerPage * 1.5);
          break;

        case 'tv':
          baseConfig.fontSize = baseConfig.fontSize === 'xs' ? 'small' : 
                               baseConfig.fontSize === 'small' ? 'medium' :
                               baseConfig.fontSize === 'medium' ? 'large' : 'xl';
          baseConfig.contentPadding += 10;
          baseConfig.buttonSize = 'large';
          break;

        case 'mobile':
          // Forzar ajustes móviles
          baseConfig.sidebarWidth = 0;
          baseConfig.contentMaxWidth = width;
          baseConfig.contentPadding = 8;
          baseConfig.bannerPadding = 8;
          break;
      }

      return baseConfig;
    };

    const newConfig = calculateOptimalLayout(screenInfo);
    setLayoutConfig(newConfig);

    // Aplicar todas las variables CSS personalizadas
    const root = document.documentElement;
    root.style.setProperty('--sidebar-width', `${newConfig.sidebarWidth}px`);
    root.style.setProperty('--content-max-width', `${newConfig.contentMaxWidth}px`);
    root.style.setProperty('--content-padding', `${newConfig.contentPadding}px`);
    root.style.setProperty('--header-height', `${newConfig.headerHeight}px`);
    root.style.setProperty('--banner-padding', `${newConfig.bannerPadding}px`);
    
    // Agregar múltiples clases CSS para control granular
    document.body.className = document.body.className.replace(/font-size-\w+|button-size-\w+|spacing-\w+|columns-\w+/g, '');
    document.body.classList.add(
      `font-size-${newConfig.fontSize}`,
      `button-size-${newConfig.buttonSize}`,
      `spacing-${newConfig.spacing}`,
      `columns-${newConfig.tableColumns}`
    );

    console.log('🎯 Advanced auto-layout applied:', {
      screen: screenInfo,
      layout: newConfig
    });
  }, [screenInfo]);

  return {
    screenInfo,
    layoutConfig,
    // Función para forzar recálculo
    recalculate: () => {
      window.dispatchEvent(new Event('resize'));
    }
  };
};