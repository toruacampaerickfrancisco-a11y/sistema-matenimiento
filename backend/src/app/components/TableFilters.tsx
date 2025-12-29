"use client";

import { useState } from 'react';
import styles from './TableFilters.module.css';

interface FilterOption {
  value: string;
  label: string;
}

interface TableFiltersProps {
  filters: Array<{
    id: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
  }>;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
  // Propiedades de paginación
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  // Exportación
  onExport?: () => void;
}

export default function TableFilters({
  filters,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange,
  className = "",
  page = 1,
  pageSize = 10,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  onExport
}: TableFiltersProps) {
  return (
    <div className={`${styles.filtersContainer} ${className}`}>
      <div className={styles.filtersRow}>
        {/* Primera fila: Filtros de dropdown */}
        <div className={styles.dropdownFilters}>
          {filters.map((filter) => (
            <div key={filter.id} className={styles.filterGroup}>
              <label className={styles.filterLabel}>{filter.label}</label>
              <select
                className={styles.filterSelect}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      
      {/* Segunda fila: Búsqueda y Exportar */}
      <div className={styles.actionsRow}>
        {/* Barra de búsqueda */}
        {onSearchChange && (
          <div className={styles.searchGroup}>
            <div className={styles.searchInputContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <div className={styles.searchIcon}>🔍</div>
            </div>
          </div>
        )}

        {/* Botón de exportar */}
        {onExport && (
          <div className={styles.exportGroup}>
            <button 
              onClick={onExport}
              className={styles.exportButton}
            >
              📊 Exportar
            </button>
          </div>
        )}
      </div>

      {/* Controles de paginación */}
      {onPageChange && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            <span>
              Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalRecords)} de {totalRecords} registros
            </span>
          </div>

          <div className={styles.paginationControls}>
            {/* Selector de tamaño de página */}
            {onPageSizeChange && (
              <div className={styles.pageSizeSelector}>
                <label className={styles.pageSizeLabel}>Mostrar:</label>
                <select
                  className={styles.pageSizeSelect}
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}

            {/* Navegación de páginas */}
            <div className={styles.pageNavigation}>
              <button
                className={`${styles.pageButton} ${page <= 1 ? styles.disabled : ''}`}
                onClick={() => onPageChange(1)}
                disabled={page <= 1}
                title="Primera página"
              >
                ⏮
              </button>
              
              <button
                className={`${styles.pageButton} ${page <= 1 ? styles.disabled : ''}`}
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                title="Página anterior"
              >
                ⏪
              </button>

              <span className={styles.pageInfo}>
                Página {page} de {totalPages}
              </span>

              <button
                className={`${styles.pageButton} ${page >= totalPages ? styles.disabled : ''}`}
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                title="Página siguiente"
              >
                ⏩
              </button>

              <button
                className={`${styles.pageButton} ${page >= totalPages ? styles.disabled : ''}`}
                onClick={() => onPageChange(totalPages)}
                disabled={page >= totalPages}
                title="Última página"
              >
                ⏭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}