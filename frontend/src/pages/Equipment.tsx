import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Equipment, User, Department } from '@/types';
import { equipmentService } from '../services/equipmentService';
import { userService } from '../services/userService';
import { departmentService } from '../services/departmentService';
import styles from './Equipment.module.css';
import Table from '../components/Table';
import Modal from '../components/Modal';
import AddEquipmentModal from '../components/AddEquipmentModal';
import Pagination from '../components/Pagination';
import { Pencil, Trash2, Plus, Laptop, Smartphone, Printer, Server, Eye, Filter, Columns, ChevronLeft, ChevronRight, Search, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { exportToExcel } from '../utils/exportUtils';
import { showSuccess, showError, showConfirm } from '../utils/swal';
import { useAuth } from '../hooks/useAuth';

const iconMap: { [key: string]: React.ReactNode } = {
  default: <Laptop size={16} />,
  computadora: <Laptop size={16} />,
  celular: <Smartphone size={16} />,
  impresora: <Printer size={16} />,
  servidor: <Server size={16} />,
};

const getWarrantyStatus = (dateString?: string) => {
  if (!dateString) return { text: 'Sin información', className: '' };
  const expiration = new Date(dateString);
  const now = new Date();
  const daysLeft = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { text: 'Expirada', className: styles.warrantyExpired };
  if (daysLeft < 30) return { text: 'Por expirar', className: styles.warrantyWarning };
  return { text: 'Vigente', className: styles.warrantyValid };
};

const EquipmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEquipment, setTotalEquipment] = useState(0);
  const [filters, setFilters] = useState({ type: '', status: '', search: '', location: '' });
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['name', 'type', 'brand', 'serialNumber', 'status', 'location', 'requirement', 'assignedUser', 'actions']);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<(string | number)[]>([]);

  const fetchEquipmentAndUsers = useCallback(async () => {
    try {
      setLoading(true);
      const [equipmentResponse, usersResponse, departmentsResponse] = await Promise.all([
        equipmentService.getEquipment({
          page,
          limit,
          search: filters.search,
          type: filters.type,
          status: filters.status,
          location: filters.location
        }),
        userService.getUsers({ limit: 1000, isActive: 'true' }),
        departmentService.getAll()
      ]);
      
      setEquipment(equipmentResponse.data || []);
      setTotalPages(equipmentResponse.pagination?.totalPages || 1);
      setTotalEquipment(equipmentResponse.pagination?.total || 0);

      setUsers(usersResponse.data || []);
      if (departmentsResponse.success) {
        setDepartments(departmentsResponse.data);
      }
      setError(null);
    } catch (err) {
      setError('No se pudo cargar la información. Por favor, intente de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchEquipmentAndUsers();
  }, [fetchEquipmentAndUsers]);

  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const response = await equipmentService.getEquipment({ limit: 10000 });
        const allEquipment = response.data || [];
        
        const uniqueStatuses = Array.from(new Set(allEquipment.map(e => e.status).filter(Boolean))) as string[];
        setStatuses(uniqueStatuses.sort());
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };
    loadFiltersData();
  }, []);

  const formatStatusLabel = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'retired' || s === 'baja') return 'BAJA';
    if (s === 'active' || s === 'activo' || s === 'operativo') return 'OPERATIVO';
    if (s === 'maintenance' || s === 'mantenimiento') return 'EN MANTENIMIENTO';
    if (s === 'available' || s === 'disponible') return 'DISPONIBLE';
    if (s === 'assigned' || s === 'asignado') return 'ASIGNADO';
    return status.toUpperCase();
  };

  const handleOpenModal = (equipment: Equipment | null = null) => {
    setCurrentEquipment(equipment);
    setIsEditing(!!equipment);
    setIsModalOpen(true);
  };

  const handleOpenDetailsModal = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsDetailsModalOpen(false);
    setCurrentEquipment(null);
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (data: any) => {
    const mapped = {
      name: data.name,
      type: data.type,
      brand: data.brand,
      model: data.model,
      serialNumber: data.serialNumber,
      inventoryNumber: data.inventoryNumber,
      status: data.status,
      location: data.location,
      assignedUserId: data.assignedUserId || null,
      purchaseDate: data.purchaseDate || null,
      warrantyExpiration: data.warrantyExpiration || null,
      description: data.notes, // Note: AddEquipmentModal uses 'notes', backend might expect 'description' or 'notes'. Let's check.
      processor: data.processor,
      ram: data.ram,
      hardDrive: data.hardDrive,
      operatingSystem: data.operatingSystem,
      notes: data.notes,
      requirement: data.requirement
    };

    // Ensure description is mapped correctly if the modal uses 'notes'
    if (data.notes && !mapped.description) {
        mapped.description = data.notes;
    }

    try {
      if (isEditing && currentEquipment) {
        await equipmentService.updateEquipment(currentEquipment.id, mapped);
        await showSuccess('Éxito', 'Equipo actualizado exitosamente.');
      } else {
        await equipmentService.createEquipment(mapped);
        await showSuccess('Éxito', 'Equipo creado exitosamente.');
      }
      fetchEquipmentAndUsers();
      handleCloseModals();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ocurrió un error al guardar el equipo.';
      await showError('Error', errorMessage);
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (await showConfirm('¿Eliminar equipo?', '¿Está seguro de que desea eliminar este equipo?')) {
      try {
        await equipmentService.deleteEquipment(id);
        fetchEquipmentAndUsers();
        await showSuccess('Eliminado', 'Equipo eliminado correctamente.');
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Ocurrió un error al eliminar el equipo.';
        setError(errorMessage);
        console.error(err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (await showConfirm('¿Eliminar equipos?', `¿Estás seguro de eliminar ${selectedEquipmentIds.length} equipos?`)) {
      try {
        setLoading(true);
        await Promise.all(selectedEquipmentIds.map(id => equipmentService.deleteEquipment(id.toString())));
        await fetchEquipmentAndUsers();
        setSelectedEquipmentIds([]);
        await showSuccess('Eliminados', 'Equipos eliminados correctamente.');
      } catch (err: any) {
        console.error('Error deleting equipment:', err);
        setError('Error al eliminar algunos equipos. Por favor intente de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      // Fetch all equipment matching current filters
      const response = await equipmentService.getEquipment({
        page: 1,
        limit: 10000,
        search: filters.search,
        type: filters.type,
        status: filters.status,
        location: filters.location
      });
      
      const allEquipment = response.data || [];

      const dataToExport = allEquipment.map(item => {
        const row: Record<string, any> = {};
        
        if (visibleColumns.includes('name')) row['Nombre'] = item.name;
        if (visibleColumns.includes('type')) row['Tipo'] = item.type;
        if (visibleColumns.includes('brand')) row['Marca/Modelo'] = `${item.brand} ${item.model}`;
        if (visibleColumns.includes('serialNumber')) row['No. Serie'] = item.serialNumber;
        if (visibleColumns.includes('inventoryNumber')) row['Activo Fijo'] = item.inventoryNumber;
        if (visibleColumns.includes('status')) row['Estado'] = item.status;
        if (visibleColumns.includes('location')) row['Ubicación'] = item.location;
        if (visibleColumns.includes('requirement')) row['Requerimientos'] = item.requirement || '-';
        if (visibleColumns.includes('assignedUser')) row['Asignado a'] = item.assignedUser?.fullName || 'No asignado';
        if (visibleColumns.includes('purchaseDate')) row['Fecha Compra'] = item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '-';
        if (visibleColumns.includes('warrantyExpiration')) row['Garantía'] = item.warrantyExpiration ? new Date(item.warrantyExpiration).toLocaleDateString() : '-';
        
        return row;
      });

      exportToExcel(dataToExport, 'Equipos');
    } catch (err) {
      console.error('Error exporting equipment:', err);
      await showError('Error', 'No se pudo exportar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const allColumns = [
    { 
      key: 'name', 
      label: 'Nombre', 
      render: (row: Equipment) => row.name
    },
    { key: 'type', label: 'Tipo' },
    { 
      key: 'brand', 
      label: 'Marca/Modelo', 
      render: (row: Equipment) => `${row.brand} ${row.model}` 
    },
    { key: 'serialNumber', label: 'No. Serie' },
    { key: 'inventoryNumber', label: 'Activo Fijo' },
    { 
      key: 'status', 
      label: 'Estado', 
      render: (row: Equipment) => row.status
    },
    { key: 'location', label: 'Ubicación' },
    { 
      key: 'requirement', 
      label: 'Requerimientos',
      render: (row: Equipment) => row.requirement || '-'
    },
    { 
      key: 'assignedUser', 
      label: 'Asignado a', 
      render: (row: Equipment) => row.assignedUser?.fullName || 'No asignado' 
    },
    { 
      key: 'purchaseDate', 
      label: 'Fecha Compra',
      render: (row: Equipment) => row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : '-'
    },
    { 
      key: 'warrantyExpiration', 
      label: 'Garantía',
      render: (row: Equipment) => {
        const status = getWarrantyStatus(row.warrantyExpiration as any);
        return status.text;
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row: Equipment) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenModal(row); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id.toString()); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const columns = allColumns.filter(col => visibleColumns.includes(col.key));

  const toggleColumn = (key: string) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter(c => c !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ 
              background: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '8px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#374151',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s'
            }}
            title="Volver al Panel Principal"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Gestión de Equipos</h1>
            <p>Inventario de todos los equipos de la organización.</p>
          </div>
        </div>

        <div style={{ background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Filtros y Búsqueda */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, alignItems: 'end' }}>
               <div className="form-group" style={{ marginBottom: 0 }}>
                 <label className="form-label">Tipo</label>
                 <select 
                    className="form-select"
                    value={filters.type} 
                    onChange={(e) => {
                      setFilters({ ...filters, type: e.target.value });
                      setPage(1);
                    }}
                  >
                    <option value="">TODOS</option>
                    <option value="Laptop">LAPTOP</option>
                    <option value="Desktop">DESKTOP</option>
                    <option value="Printer">IMPRESORA</option>
                    <option value="Server">SERVIDOR</option>
                    <option value="Other">OTRO</option>
                  </select>
               </div>

               <div className="form-group" style={{ marginBottom: 0 }}>
                 <label className="form-label">Estado</label>
                 <select 
                    className="form-select"
                    value={filters.status} 
                    onChange={(e) => {
                      setFilters({ ...filters, status: e.target.value });
                      setPage(1);
                    }}
                  >
                    <option value="">TODOS</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{formatStatusLabel(status)}</option>
                    ))}
                  </select>
               </div>

               <div className="form-group" style={{ marginBottom: 0 }}>
                 <label className="form-label">Ubicación</label>
                 <select 
                    className="form-select"
                    value={filters.location} 
                    onChange={(e) => {
                      setFilters({ ...filters, location: e.target.value });
                      setPage(1);
                    }}
                  >
                    <option value="">TODAS</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.display_name}>{dept.display_name.toUpperCase()}</option>
                    ))}
                  </select>
               </div>

               <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className={styles.columnSelectorWrapper} style={{ display: 'flex', gap: 8 }}>
                    {(user?.role === 'admin' || user?.role === 'tecnico' || user?.role === 'technician') && (
                      <button 
                        className="btn btn-outline"
                        onClick={handleExport}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#107c41', borderColor: '#107c41' }}
                        title="Exportar a Excel"
                      >
                        <FileSpreadsheet size={20} />
                        Excel
                      </button>
                    )}
                    <button 
                      className="btn btn-outline"
                      onClick={() => setShowColumnSelector(!showColumnSelector)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      title="Columnas"
                    >
                      <Columns size={20} />
                      Columnas
                    </button>
                    {showColumnSelector && (
                      <div className={styles.columnSelector}>
                        <h3>Columnas Visibles</h3>
                        {allColumns.map(col => (
                          <label key={col.key} className={styles.columnOption}>
                            <input 
                              type="checkbox" 
                              checked={visibleColumns.includes(col.key)}
                              onChange={() => toggleColumn(col.key)}
                              disabled={col.key === 'actions'}
                            />
                            {col.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
             </div>

             <div style={{ position: 'relative', width: '100%' }}>
                 <Search size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                 <input 
                    className="form-input"
                    type="text" 
                    placeholder="Buscar equipos..." 
                    value={filters.search}
                    onChange={(e) => {
                      setFilters({ ...filters, search: e.target.value });
                      setPage(1);
                    }}
                    style={{ width: '100%', paddingLeft: 40, height: '48px', fontSize: '1rem' }}
                 />
             </div>
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className={styles.btnAgregar} onClick={() => handleOpenModal()}>
              <Plus size={16} />
              Agregar
            </button>
          </div>

        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.tableWrapper}>
          <Table 
            columns={columns} 
            data={equipment} 
            loading={loading}
            selectable={false}
            selectedIds={selectedEquipmentIds}
            onSelectionChange={setSelectedEquipmentIds}
          />
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

      {isModalOpen && (
        <Modal title={isEditing ? 'Editar Equipo' : 'Nuevo Equipo'} onClose={handleCloseModals} isOpen={true}>
          <AddEquipmentModal
            onSubmit={handleSubmit}
            loading={loading}
            users={users}
            departments={departments}
            onCancel={handleCloseModals}
            initialData={currentEquipment ? {
              name: currentEquipment.name,
              type: currentEquipment.type,
              brand: currentEquipment.brand,
              model: currentEquipment.model,
              serialNumber: currentEquipment.serialNumber,
              inventoryNumber: currentEquipment.inventoryNumber,
              status: currentEquipment.status,
              location: currentEquipment.location,
              assignedUserId: currentEquipment.assignedUserId,
              purchaseDate: currentEquipment.purchaseDate,
              warrantyExpiration: currentEquipment.warrantyExpiration,
              notes: currentEquipment.description,
              processor: currentEquipment.processor,
              ram: currentEquipment.ram,
              hardDrive: currentEquipment.hardDrive,
              operatingSystem: currentEquipment.operatingSystem
            } : {}}
          />
        </Modal>
      )}

      {isDetailsModalOpen && currentEquipment && (
        <Modal title="Detalles del Equipo" onClose={handleCloseModals} isOpen={true}>
          <div className={styles.detailsContent}>
            <div className={styles.detailsHeader}>
              <div className={styles.equipmentTitle}>
                {iconMap[currentEquipment.type?.toLowerCase() || 'default']}
                <h3>{currentEquipment.name}</h3>
              </div>
              <span className={`${styles.statusBadge} ${styles[currentEquipment.status?.toLowerCase() || 'retired']}`}>{currentEquipment.status}</span>
            </div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <label>Tipo</label>
                <span>{currentEquipment.type}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Marca / Modelo</label>
                <span>{currentEquipment.brand} / {currentEquipment.model}</span>
              </div>
              <div className={styles.detailItem}>
                <label>No. Serie</label>
                <span className={styles.serialNumber}>{currentEquipment.serialNumber}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Activo Fijo</label>
                <span>{currentEquipment.inventoryNumber}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Ubicación</label>
                <span>{currentEquipment.location || 'No especificada'}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Asignado a</label>
                <span>{currentEquipment.assignedUser?.fullName || <span className={styles.noAssigned}>No asignado</span>}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Fecha de Compra</label>
                <span>{currentEquipment.purchaseDate ? new Date(currentEquipment.purchaseDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <label>Garantía</label>
                <span className={getWarrantyStatus(currentEquipment.warrantyExpiration).className}>
                  {getWarrantyStatus(currentEquipment.warrantyExpiration).text}
                  {currentEquipment.warrantyExpiration ? ` (${new Date(currentEquipment.warrantyExpiration).toLocaleDateString()})` : ''}
                </span>
              </div>
              <div className={`${styles.detailItem} ${styles.fullWidth}`}>
                <label>Notas</label>
                <p>{currentEquipment.notes || 'Sin notas.'}</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>Cerrar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
    </Layout>
  );
};

export default EquipmentPage;