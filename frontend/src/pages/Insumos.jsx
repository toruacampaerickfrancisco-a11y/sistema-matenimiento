import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import Modal from '../components/Modal';
import AddInsumoModal from '../components/AddInsumoModal';
import { Search, FileSpreadsheet, Columns, Edit, Trash2, ArrowLeft, History } from 'lucide-react';
import { exportToExcel } from '../utils/exportUtils';
import axios from 'axios';
import Table from '../components/Table';
import styles from './Equipment.module.css';
import Layout from '../components/Layout';
import { showSuccess, showError, showConfirm } from '../utils/swal';
import { useAuth } from '../hooks/useAuth';

const Insumos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { canView, loading: loadingPerms } = usePermissions();
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '', cantidad: 0, unidad: '', ubicacion: '' });
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ unidad: '', ubicacion: '' });
  const [visibleColumns, setVisibleColumns] = useState(['nombre', 'descripcion', 'cantidad', 'unidad', 'ubicacion', 'last_entry', 'last_exit', 'actions']);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // History Modal State
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedInsumoName, setSelectedInsumoName] = useState('');

  useEffect(() => {
    fetchInsumos();
  }, []); // Fetch initially, filters will be applied client-side for now

  async function fetchInsumos() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get('/api/insumos', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data && response.data.data) {
        setInsumos(response.data.data);
      } else if (Array.isArray(response.data)) {
        setInsumos(response.data);
      } else {
        setInsumos([]);
      }
      setError('');
    } catch (err) {
      console.error("Error fetching insumos:", err);
      setInsumos([]);
      setError('Error al cargar los insumos');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (id) => {
    const insumo = insumos.find(i => i.id === id);
    if (insumo) {
      setForm({
        nombre: insumo.nombre,
        descripcion: insumo.descripcion,
        cantidad: insumo.cantidad,
        unidad: insumo.unidad,
        ubicacion: insumo.ubicacion
      });
      setEditId(id);
      setShowForm(true);
    }
  };

  const handleDelete = async (id) => {
    if (await showConfirm('¿Eliminar insumo?', '¿Está seguro de que desea eliminar este insumo?')) {
      try {
        const token = sessionStorage.getItem('authToken');
        await axios.delete(`/api/insumos/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        fetchInsumos();
        await showSuccess('Eliminado', 'Insumo eliminado correctamente.');
      } catch (err) {
        console.error("Error deleting insumo:", err);
        await showError('Error', 'Error al eliminar el insumo');
      }
    }
  };

  const handleSubmit = async (formData) => {
    setLoadingForm(true);
    try {
      const token = sessionStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (editId) {
        await axios.put(`/api/insumos/${editId}`, formData, { headers });
      } else {
        await axios.post('/api/insumos', formData, { headers });
      }

      fetchInsumos();
      setShowForm(false);
      setEditId(null);
      setForm({ nombre: '', descripcion: '', cantidad: 0, unidad: '', ubicacion: '' });
      await showSuccess('Éxito', 'Insumo guardado correctamente.');
    } catch (err) {
      console.error("Error saving insumo:", err);
      await showError('Error', 'Error al guardar el insumo');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleExport = () => {
    exportToExcel(filteredInsumos, 'Insumos');
  };

  const handleViewHistory = async (item) => {
    setSelectedInsumoName(item.nombre);
    setShowHistory(true);
    setLoadingHistory(true);
    setHistoryData([]);
    
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get(`/api/insumos/${item.id}/history`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data && response.data.success) {
        setHistoryData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      await showError('Error', 'No se pudo cargar el historial');
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleColumn = (key) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter(c => c !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  // Listas para filtros (derivadas de los datos o estáticas)
  const unidades = [...new Set(insumos.map(i => i.unidad).filter(Boolean))];
  const ubicaciones = [...new Set(insumos.map(i => i.ubicacion).filter(Boolean))];

  // Definición de columnas
  const allColumns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'unidad', label: 'Unidad' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'last_entry', label: 'Última Entrada' },
    { key: 'last_exit', label: 'Última Salida' },
    { key: 'actions', label: 'Acciones' }
  ];

  const columns = allColumns
    .filter(col => visibleColumns.includes(col.key))
    .map(col => {
      if (col.key === 'last_entry' || col.key === 'last_exit') {
        return {
          label: col.label,
          key: col.key,
          render: (item) => {
            if (!item[col.key]) return '-';
            
            const date = new Date(item[col.key]).toLocaleDateString() + ' ' + new Date(item[col.key]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const qtyKey = col.key === 'last_entry' ? 'last_entry_quantity' : 'last_exit_quantity';
            const qty = item[qtyKey];
            
            return (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{date}</span>
                {qty !== null && qty !== undefined && (
                  <span style={{ 
                    fontSize: '0.85em', 
                    fontWeight: 'bold',
                    color: col.key === 'last_entry' ? '#059669' : '#dc2626' 
                  }}>
                    {col.key === 'last_entry' ? `(+${qty})` : `(-${qty})`}
                  </span>
                )}
              </div>
            );
          }
        };
      }
      if (col.key === 'actions') {
        return {
          label: col.label,
          key: col.key,
          render: (item) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleViewHistory(item)} className="btn-icon" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }} title="Ver Historial">
                <History size={18} />
              </button>
              <button onClick={() => handleEdit(item.id)} className="btn-icon" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#2563eb' }} title="Editar">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="btn-icon" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }} title="Eliminar">
                <Trash2 size={18} />
              </button>
            </div>
          )
        };
      }
      return { label: col.label, key: col.key };
    });

  // Filtrado por búsqueda y filtros de selección
  const filteredInsumos = insumos.filter(item => {
    const s = search.toLowerCase();
    const matchesSearch = 
      (item.nombre?.toLowerCase() || '').includes(s) ||
      (item.descripcion?.toLowerCase() || '').includes(s) ||
      (item.unidad?.toLowerCase() || '').includes(s) ||
      (item.ubicacion?.toLowerCase() || '').includes(s) ||
      (String(item.cantidad) || '').includes(s);

    const matchesUnidad = filters.unidad ? item.unidad === filters.unidad : true;
    const matchesUbicacion = filters.ubicacion ? item.ubicacion === filters.ubicacion : true;
    return matchesSearch && matchesUnidad && matchesUbicacion;
  });

  if (loadingPerms) return null; // O un spinner

  if (!canView('supplies')) {
    return (
      <Layout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <svg width="64" height="64" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginBottom: 24 }}><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 8 }}>Acceso No Autorizado</h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>No tienes permisos para acceder a esta página.</p>
          <button className="btn" onClick={() => window.location.href = '/'} style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: 8 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginRight: 8 }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Volver al Inicio
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.pageWrapper}>
        <div className={styles.headerRow} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
            <h1 className={styles.pageTitle}>Gestión de Insumos</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginLeft: 'auto' }}>
            <button className={styles.btnAgregar} onClick={() => { setShowForm(true); setEditId(null); setForm({ nombre: '', descripcion: '', cantidad: 0, unidad: '', ubicacion: '' }); }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginRight: 6 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Agregar
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div style={{ background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Unidad</label>
              <select
                className="form-select"
                value={filters.unidad}
                onChange={e => setFilters({ ...filters, unidad: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
              >
                <option value="">Todas</option>
                {unidades.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Ubicación</label>
              <select
                className="form-select"
                value={filters.ubicacion}
                onChange={e => setFilters({ ...filters, ubicacion: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
              >
                <option value="">Todas</option>
                {ubicaciones.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              {(user?.role === 'admin' || user?.role === 'tecnico' || user?.role === 'technician') && (
                <button className="btn btn-outline" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#107c41', borderColor: '#107c41', background: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }} title="Exportar a Excel">
                  <FileSpreadsheet size={20} />
                  Excel
                </button>
              )}
              <button className="btn btn-outline" onClick={() => setShowColumnSelector(!showColumnSelector)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '8px 16px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} title="Columnas">
                <Columns size={20} />
                Columnas
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar insumos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: 40, height: '48px', fontSize: '1rem' }}
            />
          </div>

          {showColumnSelector && (
            <div className={styles.columnSelector} style={{ padding: '10px', border: '1px solid #eee', marginTop: '10px' }}>
              <h3>Columnas Visibles</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {allColumns.map(col => (
                  <label key={col.key} className={styles.columnOption} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
            </div>
          )}
        </div>

        <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditId(null); }} title={editId ? 'Editar Insumo' : 'Agregar Insumo'}>
          <AddInsumoModal
            onSubmit={handleSubmit}
            loading={loadingForm}
            initialData={form}
            onCancel={() => { setShowForm(false); setEditId(null); }}
          />
          {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        </Modal>

        <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title={`Historial de Asignaciones: ${selectedInsumoName}`}>
          {loadingHistory ? (
            <p>Cargando historial...</p>
          ) : historyData.length === 0 ? (
            <p>No hay historial de asignaciones para este insumo.</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Fecha</th>
                    <th style={{ padding: '8px' }}>Ticket</th>
                    <th style={{ padding: '8px' }}>Título</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((h, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '8px' }}>{new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td style={{ padding: '8px' }}>{h.ticketNumber}</td>
                      <td style={{ padding: '8px' }}>{h.ticketTitle}</td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'right', 
                        fontWeight: 'bold', 
                        color: h.quantity > 0 ? '#059669' : '#dc2626' 
                      }}>
                        {h.quantity > 0 ? '+' : ''}{h.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button className="btn btn-secondary" onClick={() => setShowHistory(false)}>Cerrar</button>
          </div>
        </Modal>

        <Table
          columns={columns}
          data={filteredInsumos}
          loading={loading}
          error={error}
          selectable={false}
          rowKey="id"
        />
      </div>
    </Layout>
  );
}

export default Insumos;
