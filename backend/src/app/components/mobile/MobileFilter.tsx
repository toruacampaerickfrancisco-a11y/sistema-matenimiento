"use client";

import React, { useState } from 'react';
import styles from './MobileFilter.module.css';

interface FilterOption {
  key: string;
  label: string;
  values: string[];
}

interface MobileFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Record<string, string>) => void;
  onClearFilters: () => void;
  filterOptions: FilterOption[];
  currentFilters: Record<string, string>;
  title: string;
}

export default function MobileFilter({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onClearFilters, 
  filterOptions, 
  currentFilters,
  title 
}: MobileFilterProps) {
  const [tempFilters, setTempFilters] = useState<Record<string, string>>(currentFilters);

  if (!isOpen) return null;

  const handleFilterChange = (key: string, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    setTempFilters({});
    onClearFilters();
    onClose();
  };

  const activeFiltersCount = Object.values(tempFilters).filter(v => v).length;

  return (
    <div className={styles.overlay}>
      <div className={styles.filterPanel}>
        {/* Header */}
        <div className={styles.header}>
          <h3>🔧 Filtros - {title}</h3>
          <button 
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar filtros"
          >
            ✕
          </button>
        </div>

        {/* Filter Options */}
        <div className={styles.filterContent}>
          {filterOptions.map(option => (
            <div key={option.key} className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                {option.label}
              </label>
              <select
                className={styles.filterSelect}
                value={tempFilters[option.key] || ''}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
              >
                <option value="">Todos</option>
                {option.values.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button 
            className={styles.clearBtn}
            onClick={handleClear}
          >
            🗑️ Limpiar
          </button>
          <button 
            className={styles.applyBtn}
            onClick={handleApply}
          >
            ✅ Aplicar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}