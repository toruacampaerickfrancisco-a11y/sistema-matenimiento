"use client";

import React, { useState, useMemo } from 'react';
import TicketCard from './TicketCard';
import MobileFilter from './MobileFilter';
import styles from './MobileCards.module.css';

interface Ticket {
  id: string;
  userId: string;
  equipmentId: string;
  serviceType: string;
  observations: string;
  status: string;
  createdAt: string;
  userName?: string;
  equipmentName?: string;
}

interface TicketCardListProps {
  tickets: Ticket[];
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticketId: string) => void;
  onChangeStatus?: (ticketId: string, newStatus: string) => void;
  loading?: boolean;
}

export default function TicketCardList({ tickets, onEdit, onDelete, onChangeStatus, loading }: TicketCardListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  // Obtener opciones únicas para filtros
  const filterOptions = useMemo(() => {
    const safeTickets = Array.isArray(tickets) ? tickets : [];
    const serviceTypes = [...new Set(safeTickets.map(t => t.serviceType).filter(Boolean) as string[])].sort();
    const statuses = [...new Set(safeTickets.map(t => t.status).filter(Boolean) as string[])].sort();
    const users = [...new Set(safeTickets.map(t => t.userName).filter(Boolean) as string[])].sort();
    const equipments = [...new Set(safeTickets.map(t => t.equipmentName).filter(Boolean) as string[])].sort();
    
    return [
      { key: 'serviceType', label: '🔧 Tipo de Servicio', values: serviceTypes },
      { key: 'status', label: '📊 Estado', values: statuses },
      { key: 'userName', label: '👤 Usuario', values: users },
      { key: 'equipmentName', label: '⚙️ Equipo', values: equipments }
    ];
  }, [tickets]);

  // Filtrar tickets por búsqueda y filtros avanzados
  const filteredTickets = useMemo(() => {
    // Asegurar que tickets sea un array válido
    const safeTickets = Array.isArray(tickets) ? tickets : [];
    let filtered = safeTickets;
    
    // Aplicar filtros avanzados
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(ticket => ticket[key as keyof Ticket] === value);
      }
    });
    
    // Aplicar búsqueda de texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.id.toLowerCase().includes(term) ||
        ticket.serviceType.toLowerCase().includes(term) ||
        ticket.observations.toLowerCase().includes(term) ||
        ticket.status.toLowerCase().includes(term) ||
        (ticket.userName && ticket.userName.toLowerCase().includes(term)) ||
        (ticket.equipmentName && ticket.equipmentName.toLowerCase().includes(term)) ||
        ticket.userId.toLowerCase().includes(term) ||
        ticket.equipmentId.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [tickets, searchTerm, activeFilters]);

  // Paginación
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

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
            placeholder="Buscando tickets..."
            disabled
          />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.cardSkeleton}>
            <div style={{ height: '120px' }}></div>
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
          placeholder="Buscar tickets..."
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
      {paginatedTickets.length === 0 ? (
        <div className={styles.emptyState}>
          {searchTerm ? (
            <>
              <h3>🔍 Sin resultados</h3>
              <p>No se encontraron tickets que coincidan con "{searchTerm}"</p>
              <button 
                className={styles.paginationBtn}
                onClick={() => setSearchTerm('')}
              >
                Mostrar todos
              </button>
            </>
          ) : (
            <>
              <h3>🎫 Sin tickets</h3>
              <p>No hay tickets registrados en el sistema</p>
            </>
          )}
        </div>
      ) : (
        <>
          {paginatedTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangeStatus={onChangeStatus}
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
      {filteredTickets.length > 0 && (
        <div style={{ 
          padding: '12px 16px', 
          textAlign: 'center', 
          color: '#7f8c8d', 
          fontSize: '13px' 
        }}>
          Mostrando {paginatedTickets.length} de {filteredTickets.length} tickets
          {searchTerm && ` (filtrados de ${tickets.length} totales)`}
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
        title="Tickets"
      />
    </div>
  );
}