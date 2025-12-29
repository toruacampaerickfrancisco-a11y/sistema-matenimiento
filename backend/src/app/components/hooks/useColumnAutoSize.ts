import { useEffect, useState, useRef, useCallback } from 'react';
import { useScreenDetection } from './useScreenDetection';

export interface ColumnConfig {
  key: string;
  label: string;
  priority: 'high' | 'medium' | 'low'; // Prioridad para mostrar en pantallas pequeñas
  minWidth: number; // Ancho mínimo en px
  maxWidth: number; // Ancho máximo en px
  preferredWidth?: number; // Ancho preferido en px
  flexible: boolean; // Si puede crecer/decrecer
  breakpoint?: 'mobile' | 'tablet' | 'desktop' | 'ultrawide'; // Desde qué breakpoint mostrar
}

export interface TableDimensions {
  containerWidth: number;
  availableWidth: number;
  columnsToShow: string[];
  columnWidths: Record<string, number>;
  totalWidth: number;
}

export const useColumnAutoSize = (
  columns: ColumnConfig[],
  containerRef: React.RefObject<HTMLElement>,
  options: {
    minTableWidth?: number;
    maxTableWidth?: number;
    padding?: number;
    enableHiding?: boolean;
  } = {}
) => {
  const screenInfo = useScreenDetection();
  const [tableDimensions, setTableDimensions] = useState<TableDimensions>({
    containerWidth: 1200,
    availableWidth: 1200,
    columnsToShow: columns.map(col => col.key),
    columnWidths: {},
    totalWidth: 1200,
  });

  const {
    minTableWidth = 800,
    maxTableWidth = 2000,
    padding = 40,
    enableHiding = true,
  } = options;

  // Función para calcular qué columnas mostrar según la pantalla
  const getVisibleColumns = useCallback((screenWidth: number, category: string) => {
    let visibleColumns = columns;

    // Filtrar por breakpoint
    visibleColumns = visibleColumns.filter(col => {
      if (!col.breakpoint) return true;
      
      switch (col.breakpoint) {
        case 'mobile': return screenWidth >= 480;
        case 'tablet': return screenWidth >= 768;
        case 'desktop': return screenWidth >= 1024;
        case 'ultrawide': return screenWidth >= 1920;
        default: return true;
      }
    });

    // En pantallas pequeñas, filtrar por prioridad
    if (enableHiding && category === 'small') {
      visibleColumns = visibleColumns.filter(col => col.priority === 'high');
    } else if (enableHiding && category === 'medium') {
      visibleColumns = visibleColumns.filter(col => col.priority !== 'low');
    }

    return visibleColumns;
  }, [columns, enableHiding]);

  // Función para calcular anchos de columnas
  const calculateColumnWidths = useCallback((
    visibleColumns: ColumnConfig[],
    availableWidth: number
  ) => {
    const columnWidths: Record<string, number> = {};
    
    // Calcular ancho total mínimo requerido
    const totalMinWidth = visibleColumns.reduce((sum, col) => sum + col.minWidth, 0);
    
    if (totalMinWidth > availableWidth) {
      // Si no hay suficiente espacio, usar anchos mínimos
      visibleColumns.forEach(col => {
        columnWidths[col.key] = col.minWidth;
      });
      return { columnWidths, totalWidth: totalMinWidth };
    }

    // Calcular espacio extra disponible
    let remainingWidth = availableWidth - totalMinWidth;
    
    // Asignar anchos mínimos primero
    visibleColumns.forEach(col => {
      columnWidths[col.key] = col.minWidth;
    });

    // Distribuir espacio extra a columnas flexibles
    const flexibleColumns = visibleColumns.filter(col => col.flexible);
    
    if (flexibleColumns.length > 0 && remainingWidth > 0) {
      // Calcular peso de cada columna flexible
      const totalFlexWeight = flexibleColumns.reduce((sum, col) => {
        const preferredExtra = (col.preferredWidth || col.minWidth) - col.minWidth;
        return sum + Math.max(1, preferredExtra / 50); // Peso basado en ancho preferido
      }, 0);

      flexibleColumns.forEach(col => {
        const preferredExtra = (col.preferredWidth || col.minWidth) - col.minWidth;
        const weight = Math.max(1, preferredExtra / 50);
        const extraWidth = (remainingWidth * weight) / totalFlexWeight;
        
        const newWidth = Math.min(
          col.maxWidth,
          columnWidths[col.key] + extraWidth
        );
        
        columnWidths[col.key] = Math.round(newWidth);
      });
    }

    const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
    
    return { columnWidths, totalWidth };
  }, []);

  // Función para aplicar CSS variables
  const applyCSSVariables = useCallback((dimensions: TableDimensions) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Aplicar anchos de columnas como CSS variables
    Object.entries(dimensions.columnWidths).forEach(([key, width]) => {
      root.style.setProperty(`--col-${key}-width`, `${width}px`);
    });

    // Variables generales de tabla
    root.style.setProperty('--table-total-width', `${dimensions.totalWidth}px`);
    root.style.setProperty('--table-container-width', `${dimensions.containerWidth}px`);
    
    // Clases para ocultar columnas no visibles
    const allColumnKeys = columns.map(col => col.key);
    allColumnKeys.forEach(key => {
      const isVisible = dimensions.columnsToShow.includes(key);
      root.style.setProperty(`--col-${key}-display`, isVisible ? 'table-cell' : 'none');
    });
  }, [columns]);

  // Función principal de cálculo
  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth || screenInfo.width;
    const availableWidth = Math.min(
      Math.max(containerWidth - padding, minTableWidth),
      maxTableWidth
    );

    const visibleColumns = getVisibleColumns(screenInfo.width, screenInfo.category);
    const { columnWidths, totalWidth } = calculateColumnWidths(visibleColumns, availableWidth);

    const newDimensions: TableDimensions = {
      containerWidth,
      availableWidth,
      columnsToShow: visibleColumns.map(col => col.key),
      columnWidths,
      totalWidth: Math.min(totalWidth, maxTableWidth),
    };

    setTableDimensions(newDimensions);
    applyCSSVariables(newDimensions);
  }, [
    containerRef,
    screenInfo,
    padding,
    minTableWidth,
    maxTableWidth,
    getVisibleColumns,
    calculateColumnWidths,
    applyCSSVariables
  ]);

  // Recalcular cuando cambie el tamaño de pantalla
  useEffect(() => {
    calculateDimensions();
  }, [calculateDimensions]);

  // Recalcular con ResizeObserver para cambios de contenedor
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      calculateDimensions();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateDimensions]);

  // Función para actualizar configuración de columna
  const updateColumnConfig = useCallback((key: string, updates: Partial<ColumnConfig>) => {
    const updatedColumns = columns.map(col => 
      col.key === key ? { ...col, ...updates } : col
    );
    // En una implementación real, esto actualizaría el estado de columnas
    calculateDimensions();
  }, [columns, calculateDimensions]);

  // Función para obtener clase CSS para columna
  const getColumnClass = useCallback((columnKey: string) => {
    const isVisible = tableDimensions.columnsToShow.includes(columnKey);
    const width = tableDimensions.columnWidths[columnKey];
    
    return {
      className: `col-${columnKey} ${!isVisible ? 'hidden' : ''}`,
      style: {
        width: width ? `${width}px` : 'auto',
        minWidth: width ? `${width}px` : 'auto',
        maxWidth: width ? `${width}px` : 'auto',
        display: isVisible ? 'table-cell' : 'none',
      }
    };
  }, [tableDimensions]);

  return {
    tableDimensions,
    screenInfo,
    calculateDimensions,
    updateColumnConfig,
    getColumnClass,
    // Información útil para debugging
    debug: {
      visibleColumns: tableDimensions.columnsToShow.length,
      totalColumns: columns.length,
      screenCategory: screenInfo.category,
      containerWidth: tableDimensions.containerWidth,
      tableWidth: tableDimensions.totalWidth,
    }
  };
};

export default useColumnAutoSize;