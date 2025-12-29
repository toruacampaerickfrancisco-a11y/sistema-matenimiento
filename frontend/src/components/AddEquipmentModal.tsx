import React, { useState, useEffect } from 'react';
import { User, Department } from '@/types';

export interface AddEquipmentModalProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialData?: any;
  users?: User[];
  departments?: Department[];
  onCancel?: () => void;
}

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData = {}, 
  users = [],
  departments = [],
  onCancel 
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [type, setType] = useState(initialData.type || 'computadora');
  const [brand, setBrand] = useState(initialData.brand || '');
  const [model, setModel] = useState(initialData.model || '');
  const [serialNumber, setSerialNumber] = useState(initialData.serialNumber || '');
  const [status, setStatus] = useState(initialData.status || 'operativo');
  const [location, setLocation] = useState(initialData.location || '');
  const [purchaseDate, setPurchaseDate] = useState(initialData.purchaseDate ? initialData.purchaseDate.split('T')[0] : '');
  const [warrantyExpiration, setWarrantyExpiration] = useState(initialData.warrantyExpiration ? initialData.warrantyExpiration.split('T')[0] : '');
  const [assignedUserId, setAssignedUserId] = useState(initialData.assignedUserId || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [requirement, setRequirement] = useState(initialData.requirement || '');
  
  // Hardware Specs
  const [inventoryNumber, setInventoryNumber] = useState(initialData.inventoryNumber || '');
  const [processor, setProcessor] = useState(initialData.processor || '');
  const [ram, setRam] = useState(initialData.ram || '');
  const [hardDrive, setHardDrive] = useState(initialData.hardDrive || '');
  const [operatingSystem, setOperatingSystem] = useState(initialData.operatingSystem || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || 'computadora');
      setBrand(initialData.brand || '');
      setModel(initialData.model || '');
      setSerialNumber(initialData.serialNumber || '');
      setStatus(initialData.status || 'operativo');
      setLocation(initialData.location || '');
      setPurchaseDate(initialData.purchaseDate ? initialData.purchaseDate.split('T')[0] : '');
      setWarrantyExpiration(initialData.warrantyExpiration ? initialData.warrantyExpiration.split('T')[0] : '');
      setAssignedUserId(initialData.assignedUserId || '');
      setNotes(initialData.notes || '');
      setRequirement(initialData.requirement || '');
      
      setInventoryNumber(initialData.inventoryNumber || '');
      setProcessor(initialData.processor || '');
      setRam(initialData.ram || '');
      setHardDrive(initialData.hardDrive || '');
      setOperatingSystem(initialData.operatingSystem || '');
    }
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ 
      name, 
      type, 
      brand, 
      model, 
      serialNumber, 
      status, 
      location, 
      purchaseDate: purchaseDate || null, 
      warrantyExpiration: warrantyExpiration || null, 
      assignedUserId: assignedUserId || null, 
      notes,
      requirement,
      inventoryNumber,
      processor,
      ram,
      hardDrive,
      operatingSystem
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label form-label-required">Nombre del Equipo</label>
          <input 
            required
            className="form-input"
            placeholder="Ej: Laptop Dell 01" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tipo</label>
          <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
            <option value="computadora">Computadora</option>
            <option value="impresora">Impresora</option>
            <option value="servidor">Servidor</option>
            <option value="celular">Celular</option>
            <option value="tablet">Tablet</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div className="form-group">
          <label className="form-label">Marca</label>
          <input 
            className="form-input"
            placeholder="Marca" 
            value={brand} 
            onChange={e => setBrand(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Modelo</label>
          <input 
            className="form-input"
            placeholder="Modelo" 
            value={model} 
            onChange={e => setModel(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label className="form-label form-label-required">No. Serie</label>
          <input 
            required
            className="form-input"
            placeholder="S/N" 
            value={serialNumber} 
            onChange={e => setSerialNumber(e.target.value)} 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Estado</label>
          <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="operativo">Operativo</option>
            <option value="en_reparacion">En Reparación</option>
            <option value="en_almacen">En Almacén</option>
            <option value="baja">De Baja</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Ubicación (Departamento)</label>
          <select 
            className="form-input"
            value={location} 
            onChange={e => setLocation(e.target.value)} 
          >
            <option value="">Seleccionar Departamento</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.display_name}>
                {dept.display_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Fecha de Compra</label>
          <input 
            type="date"
            className="form-input"
            value={purchaseDate} 
            onChange={e => setPurchaseDate(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Vencimiento Garantía</label>
          <input 
            type="date"
            className="form-input"
            value={warrantyExpiration} 
            onChange={e => setWarrantyExpiration(e.target.value)} 
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', margin: '1rem 0', paddingTop: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', color: '#374151' }}>Especificaciones Técnicas</h4>
        
        <div className="form-group">
          <label className="form-label">Activo Fijo</label>
          <input 
            className="form-input"
            placeholder="Ej: INV-2023-001" 
            value={inventoryNumber} 
            onChange={e => setInventoryNumber(e.target.value)} 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Procesador</label>
            <input 
              className="form-input"
              placeholder="Ej: Intel Core i5" 
              value={processor} 
              onChange={e => setProcessor(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">RAM</label>
            <input 
              className="form-input"
              placeholder="Ej: 16GB" 
              value={ram} 
              onChange={e => setRam(e.target.value)} 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Disco Duro</label>
            <input 
              className="form-input"
              placeholder="Ej: 512GB SSD" 
              value={hardDrive} 
              onChange={e => setHardDrive(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Sistema Operativo</label>
            <input 
              className="form-input"
              placeholder="Ej: Windows 11 Pro" 
              value={operatingSystem} 
              onChange={e => setOperatingSystem(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Usuario Asignado</label>
        <select className="form-input" value={assignedUserId} onChange={e => setAssignedUserId(e.target.value)}>
          <option value="">-- Sin Asignar --</option>
          {[...users].sort((a, b) => a.fullName.localeCompare(b.fullName)).map(u => (
            <option key={u.id} value={u.id}>{u.fullName} ({u.department})</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Requerimientos</label>
        <input 
          className="form-input"
          placeholder="Ej: Requiere UPS, Conexión a red dedicada..." 
          value={requirement} 
          onChange={e => setRequirement(e.target.value)} 
        />
      </div>

      <div className="form-group">
        <label className="form-label">Notas / Especificaciones</label>
        <textarea 
          rows={3}
          className="form-input"
          placeholder="Detalles adicionales..." 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          style={{ resize: 'vertical' }} 
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading} 
        >
          {loading ? 'Guardando...' : 'Guardar Equipo'}
        </button>
      </div>
    </form>
  );
};

export default AddEquipmentModal;
