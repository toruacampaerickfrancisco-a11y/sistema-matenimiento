"use client";

import { useEffect, useMemo, useState, useRef } from 'react';
import EditEquipmentModal from './EditEquipmentModal';
import AddEquipmentModal from './AddEquipmentModal';
import ActionButtons from './ActionButtons';
import Pagination from './Pagination';
import styles from './Table.module.css';
import { usePreciseUpdates } from './hooks/usePreciseUpdates';
import { useColumnAutoSize, ColumnConfig } from './hooks/useColumnAutoSize';

export default function EquipmentTable() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawResp, setRawResp] = useState<any>(null);
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [users, setUsers] = useState<any[]>([]);

  // 🚀 Sistema de autoajuste de columnas para equipos
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const columnConfig: ColumnConfig[] = [
    { key: 'id', label: 'ID', minWidth: 80, maxWidth: 120, priority: 'high', flexible: false },
    { key: 'type', label: 'Tipo', minWidth: 100, maxWidth: 150, priority: 'high', flexible: true },
    { key: 'brand', label: 'Marca', minWidth: 100, maxWidth: 140, priority: 'medium', flexible: true },
    { key: 'model', label: 'Modelo', minWidth: 120, maxWidth: 180, priority: 'medium', flexible: true },
    { key: 'serial', label: 'Serial', minWidth: 100, maxWidth: 140, priority: 'medium', flexible: true },
    { key: 'activo_fijo', label: 'Activo Fijo', minWidth: 110, maxWidth: 150, priority: 'low', flexible: true },
    { key: 'status', label: 'Estado', minWidth: 90, maxWidth: 120, priority: 'high', flexible: false },
    { key: 'user', label: 'Asignado a', minWidth: 150, maxWidth: 200, priority: 'medium', flexible: true },
    { key: 'actions', label: 'Acciones', minWidth: 120, maxWidth: 150, priority: 'high', flexible: false }
  ];

  const { getColumnClass, debug } = useColumnAutoSize(
    columnConfig,
    tableContainerRef,
    {
      minTableWidth: 900,
      maxTableWidth: 1600,
      padding: 40,
      enableHiding: true
    }
  );

  // 🎯 Sistema de actualización por eventos precisos para equipos
  const { data: equipmentData, triggerEvent: triggerEquipmentEvent } = usePreciseUpdates({
    endpoint: '/api/equipment',
    eventTypes: ['equipment-created', 'equipment-updated', 'equipment-deleted'],
    onUpdate: (data: any) => {
      const newEquipment = data.equipment || [];
      setRawResp(data);
      setEquipment(newEquipment);
    },
    dependencies: [q, statusFilter, typeFilter, currentPage.toString(), itemsPerPage.toString(), sortBy, sortDir],
    cacheKey: `equipment-${q}-${statusFilter}-${typeFilter}-${currentPage}-${itemsPerPage}-${sortBy}-${sortDir}`
  });

  // 🎯 Usuarios solo cuando se necesiten (para asignaciones)
  const { data: usersData, triggerEvent: triggerUserEvent } = usePreciseUpdates({
    endpoint: '/api/users',
    eventTypes: ['user-created', 'user-updated', 'user-deleted'],
    onUpdate: (data: any) => {
      const newUsers = data.users || [];
      setUsers(newUsers);
    },
    cacheKey: 'users-for-equipment'
  });

  // Carga inicial (solo una vez, con loading visible)
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Cargar equipos
        const equipRes = await fetch('/api/equipment');
        const equipData = await equipRes.json();
        setRawResp(equipData);
        setEquipment(equipData.equipment || []);

        // Cargar usuarios
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setEquipment([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const typeOptions = useMemo(() => {
    const set = new Set<string>();
    equipment.forEach((e) => {
      if (e && e.type) set.add(String(e.type));
    });
    return Array.from(set).sort();
  }, [equipment]);

  const filtered = useMemo(() => {
    let list = equipment;
    const term = q?.trim().toLowerCase();
    if (term) {
      list = list.filter((e) => {
        if (!e) return false;
        const id = String(e.id || '').toLowerCase();
        const type = String(e.type || '').toLowerCase();
        const brand = String(e.brand || '').toLowerCase();
        const model = String(e.model || '').toLowerCase();
        const serial = String(e.serial || '').toLowerCase();
        const activoFijo = String(e.activo_fijo || '').toLowerCase();
        const userId = String(e.user_id || '').toLowerCase();
        return id.includes(term) || type.includes(term) || brand.includes(term) || model.includes(term) || serial.includes(term) || activoFijo.includes(term) || userId.includes(term);
      });
    }
    if (typeFilter) {
      list = list.filter((e) => String(e.type || '') === typeFilter);
    }
    if (statusFilter) {
      if (statusFilter === 'assigned') {
        list = list.filter((e) => e.user_id && String(e.user_id).trim() !== '');
      } else if (statusFilter === 'unassigned') {
        list = list.filter((e) => !e.user_id || String(e.user_id).trim() === '');
      }
    }
    return list;
  }, [equipment, q, typeFilter, statusFilter]);

  // 📄 Paginación calculada
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEquipment = filtered.slice(startIndex, endIndex);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [q, typeFilter, statusFilter]);

  async function handleDeleteEquipment(id: string) {
    if (!confirm('¿Eliminar este equipo? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`/api/equipment/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando');
      setEquipment((s) => s.filter((e) => e.id !== id));
      
      // 🔥 Disparar evento de equipo eliminado
      triggerEquipmentEvent('equipment-deleted', { equipmentId: id });
    } catch (err) {
      alert('No se pudo eliminar el equipo.');
    }
  }

  const [editingEquipment, setEditingEquipment] = useState<any | null>(null);
  const [addingEquipment, setAddingEquipment] = useState(false);

  function handleEquipmentSaved(u: any) {
    setEquipment((s) => s.map((x) => (x.id === u.id ? { ...(x), ...(u || {}) } : x)));
    
    // 🔥 Disparar evento de equipo actualizado
    triggerEquipmentEvent('equipment-updated', { equipment: u });
  }

  function handleEquipmentCreated(u: any) {
    setEquipment((s) => [u, ...s]);
    
    // 🔥 Disparar evento de equipo creado
    triggerEquipmentEvent('equipment-created', { equipment: u });
  }

  if (loading) return <div>Cargando equipos...</div>;

  if (!equipment.length) return (
    <div>
      <div>No hay equipos.</div>
      <button onClick={() => setAddingEquipment(true)} style={{ marginTop: 12, background: '#249b8a', color: 'white', borderRadius: 999, padding: '10px 18px', border: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>+</span> Agregar Equipo
      </button>
      <details style={{ marginTop: 12 }}>
        <summary>Ver respuesta cruda de /api/equipment</summary>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(rawResp, null, 2)}</pre>
      </details>
    </div>
  );

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 20px'
    }}>
      {/* Primera fila: Filtros - Exacto como en las imágenes */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: 20, 
        marginBottom: 16,
        width: '100%'
      }}>
        {/* Filtros de la izquierda - exacto como la imagen */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '500', 
              color: '#9ca3af', 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              TIPO DE EQUIPO
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter((e.target as HTMLSelectElement).value)}
              style={{
                width: '260px',
                height: '42px',
                padding: '0 16px 0 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#4b5563',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="">Todos los Tipos</option>
              {typeOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              fontWeight: '500', 
              color: '#9ca3af', 
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ESTADO ASIGNACIÓN
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}
              style={{
                width: '200px',
                height: '42px',
                padding: '0 16px 0 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#4b5563',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 12px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px'
              }}
            >
              <option value="">Todos los Estados</option>
              <option value="assigned">Asignado</option>
              <option value="unassigned">Sin asignar</option>
            </select>
          </div>
        </div>

        {/* Barra de búsqueda centrada - exacta como la imagen */}
        <div style={{ 
          flex: 1,
          maxWidth: '420px',
          position: 'relative',
          marginLeft: 'auto',
          marginRight: '24px'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              fontSize: '16px',
              color: '#9ca3af',
              zIndex: 1
            }}>
              🔍
            </span>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ((e.target as HTMLInputElement).value)}
              placeholder="Buscar por ID, marca, modelo, serial..."
              style={{
                width: '100%',
                height: '42px',
                padding: '0 16px 0 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#4b5563',
                outline: 'none',
                boxShadow: 'none'
              }}
            />
          </div>
        </div>
        
        {/* Botón de exportar - exacto como la imagen */}
        <button 
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              "ID,Tipo,Marca,Modelo,Serial,Activo Fijo,Usuario Asignado\n" +
              filtered.map(e => {
                const usuario = users.find(u => String(u.id).trim().toLowerCase() === String(e.user_id).trim().toLowerCase());
                return `${e.id},"${e.type}","${e.brand}","${e.model}","${e.serial}","${e.activo_fijo || 'N/A'}","${usuario ? usuario.name : 'Sin asignar'}"`;
              }).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "equipos.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          style={{ 
            background: '#10b981', 
            color: 'white', 
            borderRadius: '6px', 
            padding: '0 20px', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            height: '42px',
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          📋 Exportar
        </button>
      </div>

  <div 
        ref={tableContainerRef}
        className={`${styles.tableWrapper} ${styles.large}`}
      >
        {/* 🚀 Indicador de autoajuste */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '12px',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        }}>
          📊 {debug.visibleColumns}/{debug.totalColumns} cols | {debug.screenCategory} | {debug.tableWidth}px
        </div>
        
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={`${styles.th} ${styles.colId} ${styles.columnResponsive}`} style={getColumnClass('id').style}>
                ID
              </th>
              <th className={`${styles.th} ${styles.colType} ${styles.columnResponsive}`} style={getColumnClass('type').style}>
                Tipo
              </th>
              <th className={`${styles.th} ${styles.colBrand} ${styles.columnResponsive}`} style={getColumnClass('brand').style}>
                Marca
              </th>
              <th className={`${styles.th} ${styles.colModel} ${styles.columnResponsive}`} style={getColumnClass('model').style}>
                Modelo
              </th>
              <th className={`${styles.th} ${styles.colSerial} ${styles.columnResponsive}`} style={getColumnClass('serial').style}>
                Serial
              </th>
              <th className={`${styles.th} ${styles.colActivoFijo} ${styles.columnResponsive}`} style={getColumnClass('activo_fijo').style}>
                Activo Fijo
              </th>
              <th className={`${styles.th} ${styles.colStatus} ${styles.columnResponsive}`} style={getColumnClass('status').style}>
                Estado
              </th>
              <th className={`${styles.th} ${styles.colUser} ${styles.columnResponsive}`} style={getColumnClass('user').style}>
                Usuario Asignado
              </th>
              <th className={`${styles.th} ${styles.colActions} ${styles.columnResponsive}`} style={getColumnClass('actions').style}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td className={styles.td} colSpan={8}>No hay equipos.</td></tr>
            ) : (
            paginatedEquipment.map((e) => {
              // Buscar el nombre del usuario asignado usando user_id
              const usuario = users.find(u => String(u.id).trim().toLowerCase() === String(e.user_id).trim().toLowerCase());
              return (
                <tr key={e.id} className={styles.tr}>
                  <td 
                    className={`${styles.td} ${styles.colId} ${styles.columnResponsive}`} 
                    style={getColumnClass('id').style}
                  >
                    <div>{e.id}</div>
                  </td>
                  <td 
                    className={`${styles.td} ${styles.colType} ${styles.columnResponsive}`} 
                    style={getColumnClass('type').style}
                  >
                    {e.type}
                  </td>
                  <td 
                    className={`${styles.td} ${styles.colBrand} ${styles.columnResponsive}`} 
                    style={getColumnClass('brand').style}
                  >
                    {e.brand || '-'}
                  </td>
                  <td 
                    className={`${styles.td} ${styles.colModel} ${styles.columnResponsive}`} 
                    style={getColumnClass('model').style}
                  >
                    {e.model || '-'}
                  </td>
                  <td 
                    className={`${styles.td} ${styles.colSerial} ${styles.columnResponsive}`} 
                    style={getColumnClass('serial').style}
                  >
                    {e.serial || '-'}
                  </td>
                  <td 
                    className={`${styles.td} ${styles.colActivoFijo} ${styles.columnResponsive}`} 
                    style={getColumnClass('activo_fijo').style}
                  >
                    {e.activo_fijo || 'N/A'}
                  </td>
                  <td 
                    className={`${styles.td} ${styles.colStatus} ${styles.columnResponsive}`} 
                    style={getColumnClass('status').style}
                  >
                    {e.status || 'activo'}
                  </td>
                  <td 
                    className={`${styles.td} ${styles.colUser} ${styles.columnResponsive}`} 
                    style={getColumnClass('user').style}
                  >
                    {usuario ? (
                      <div>
                        <div>{usuario.name}</div>
                        <div>ID: {e.user_id}</div>
                      </div>
                    ) : (
                      <span>Sin asignar</span>
                    )}
                  </td>
                  <td 
                    className={`${styles.actionsCell} ${styles.colActions} ${styles.columnResponsive}`}
                    style={getColumnClass('actions').style}
                  >
                    <div className="actionButtons">
                      <ActionButtons
                        onView={() => {/* no-op or future view */}}
                        onEdit={() => setEditingEquipment(e)}
                        onDelete={() => handleDeleteEquipment(e.id)}
                        size={12}
                      />
                    </div>
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>

        {/* 📄 Componente de Paginación */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      {/* Botón flotante para agregar equipo */}
      <button 
        onClick={() => setAddingEquipment(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#249b8a',
          color: 'white',
          border: 'none',
          fontSize: '24px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#1e8873';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#249b8a';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Agregar Equipo"
      >
        +
      </button>

      {editingEquipment ? <EditEquipmentModal item={editingEquipment} onClose={() => setEditingEquipment(null)} onSaved={handleEquipmentSaved} /> : null}
      {addingEquipment ? <AddEquipmentModal onClose={() => setAddingEquipment(false)} onCreated={handleEquipmentCreated} /> : null}
    </div>
  );
}
