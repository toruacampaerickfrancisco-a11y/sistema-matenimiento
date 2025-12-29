"use client";

import React, { useState, useMemo } from 'react';
import UserCard from './UserCard';
import MobileFilter from './MobileFilter';
import styles from './MobileCards.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface UsersCardListProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onAssignEquipment?: (userId: string) => void;
  loading?: boolean;
}

export default function UsersCardList({ users, onEdit, onDelete, onAssignEquipment, loading }: UsersCardListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  // Obtener opciones únicas para filtros
  const filterOptions = useMemo(() => {
    const safeUsers = Array.isArray(users) ? users : [];
    const roles = [...new Set(safeUsers.map(u => u.role))].filter(Boolean).sort();
    const departments = [...new Set(safeUsers.map(u => u.department))].filter(Boolean).sort();
    
    return [
      { key: 'role', label: '👤 Rol', values: roles },
      { key: 'department', label: '🏢 Departamento', values: departments }
    ];
  }, [users]);

  // Filtrar usuarios por búsqueda y filtros avanzados
  const filteredUsers = useMemo(() => {
    // Asegurar que users sea un array válido
    const safeUsers = Array.isArray(users) ? users : [];
    let filtered = safeUsers;
    
    // Aplicar filtros avanzados
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(user => user[key as keyof User] === value);
      }
    });
    
    // Aplicar búsqueda de texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [users, searchTerm, activeFilters]);

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
            placeholder="Buscando usuarios..."
            disabled
          />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.cardSkeleton}>
            <div style={{ height: '80px' }}></div>
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
          placeholder="Buscar usuarios..."
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
      {paginatedUsers.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm ? (
            <>
              <h3>🔍 Sin resultados</h3>
              <p>No se encontraron usuarios que coincidan con "{searchTerm}"</p>
              <button 
                className={styles.paginationBtn}
                onClick={() => setSearchTerm('')}
              >
                Mostrar todos
              </button>
            </>
          ) : (
            <>
              <h3>👥 Sin usuarios</h3>
              <p>No hay usuarios registrados en el sistema</p>
            </>
          )}
        </div>
      ) : (
        <>
          {paginatedUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onAssignEquipment={onAssignEquipment}
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
      {filteredUsers.length > 0 && (
        <div style={{ 
          padding: '12px 16px', 
          textAlign: 'center', 
          color: '#7f8c8d', 
          fontSize: '13px' 
        }}>
          Mostrando {paginatedUsers.length} de {filteredUsers.length} usuarios
          {searchTerm && ` (filtrados de ${users.length} totales)`}
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
        title="Usuarios"
      />
    </div>
  );
}