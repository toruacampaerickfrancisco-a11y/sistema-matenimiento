"use client";

import React, { useState, useMemo } from 'react';
import EquipmentCard from './EquipmentCard';
import MobileFilter from './MobileFilter';
import styles from './MobileCards.module.css';

interface Equipment {
  id: string;
  name: string;
  type: string;
  model?: string;
  serial?: string;
  location?: string;
  status?: string;
  assignedTo?: string;
}

interface EquipmentCardListProps {
  equipment: Equipment[];
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (equipmentId: string) => void;
  onAssignUser?: (equipmentId: string) => void;
  loading?: boolean;
}

export default function EquipmentCardList({ equipment, onEdit, onDelete, onAssignUser, loading }: EquipmentCardListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  // Obtener opciones únicas para filtros
  const filterOptions = useMemo(() => {
    const safeEquipment = Array.isArray(equipment) ? equipment : [];
    const types = [...new Set(safeEquipment.map(e => e.type).filter(Boolean) as string[])].sort();
    const statuses = [...new Set(safeEquipment.map(e => e.status).filter(Boolean) as string[])].sort();
    const locations = [...new Set(safeEquipment.map(e => e.location).filter(Boolean) as string[])].sort();
    const assignedUsers = [...new Set(safeEquipment.map(e => e.assignedTo).filter(Boolean) as string[])].sort();
    
    return [
      { key: 'type', label: '🔧 Tipo', values: types },
      { key: 'status', label: '📊 Estado', values: statuses },
      { key: 'location', label: '📍 Ubicación', values: locations },
      { key: 'assignedTo', label: '👤 Asignado a', values: assignedUsers }
    ];
  }, [equipment]);

  // Filtrar equipos por búsqueda y filtros avanzados
  const filteredEquipment = useMemo(() => {
    // Asegurar que equipment sea un array válido
    const safeEquipment = Array.isArray(equipment) ? equipment : [];
    let filtered = safeEquipment;
    
    // Aplicar filtros avanzados
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(item => item[key as keyof Equipment] === value);
      }
    });
    
    // Aplicar búsqueda de texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        (item.model && item.model.toLowerCase().includes(term)) ||
        (item.serial && item.serial.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term)) ||
        (item.status && item.status.toLowerCase().includes(term)) ||
        (item.assignedTo && item.assignedTo.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }, [equipment, searchTerm, activeFilters]);

  // Paginación
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipment = filteredEquipment.slice(startIndex, startIndex + itemsPerPage);

  // Funciones para manejar filtros
  const handleApplyFilters = (filters: Record<string, string>) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setCurrentPage(1);
  };

  // Reset página cuando cambia el filtro
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);

  if (loading) {
    return (
      <div className={styles.cardsContainer}>
        <div className={styles.mobileSearchHeader}>
          <span>🔍</span>
          <input 
            className={styles.searchInput}
            placeholder="Buscando equipos..."
            disabled
          />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.cardSkeleton}>
            <div style={{ height: '100px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.cardsContainer}>
      {/* Header con búsqueda y filtros */}
      <div className={styles.mobileSearchHeader}>
        <span>🔍</span>
        <input 
          className={styles.searchInput}
          placeholder="Buscar equipos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={`${styles.filterBtn} ${Object.keys(activeFilters).some(key => activeFilters[key]) ? styles.filterActive : ''}`}
          onClick={() => setShowFilter(true)}
          aria-label="Filtros"
          title="Filtros avanzados"
        >
          🔧
          {Object.keys(activeFilters).some(key => activeFilters[key]) && (
            <span className={styles.filterBadge}>
              {Object.values(activeFilters).filter(v => v).length}
            </span>
          )}
        </button>
        {searchTerm && (
          <button 
            className={styles.searchBtn}
            onClick={() => setSearchTerm('')}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Lista de Cards */}
      {paginatedEquipment.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm ? (
            <>
              <h3>🔍 Sin resultados</h3>
              <p>No se encontraron equipos que coincidan con "{searchTerm}"</p>
              <button 
                className={styles.paginationBtn}
                onClick={() => setSearchTerm('')}
              >
                Mostrar todos
              </button>
            </>
          ) : (
            <>
              <h3>⚙️ Sin equipos</h3>
              <p>No hay equipos registrados en el sistema</p>
            </>
          )}
        </div>
      ) : (
        <>
          {paginatedEquipment.map(item => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssignUser={onAssignUser}
            />
          ))}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className={styles.mobilePagination}>
              <button
                className={styles.paginationBtn}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              
              <div className={styles.paginationInfo}>
                {currentPage} de {totalPages}
              </div>
              
              <button
                className={styles.paginationBtn}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {/* Info de resultados */}
      {filteredEquipment.length > 0 && (
        <div style={{ 
          padding: '12px 16px', 
          textAlign: 'center', 
          color: '#7f8c8d', 
          fontSize: '13px' 
        }}>
          Mostrando {paginatedEquipment.length} de {filteredEquipment.length} equipos
          {searchTerm && ` (filtrados de ${equipment.length} totales)`}
        </div>
      )}

      {/* Modal de Filtros */}
      <MobileFilter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        filterOptions={filterOptions}
        currentFilters={activeFilters}
        title="Equipos"
      />
    </div>
  );
}