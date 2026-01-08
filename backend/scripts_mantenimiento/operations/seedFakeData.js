
// Script para insertar datos inventados en la base de datos usando ES Modules
// Ejecuta: node src/scripts/seedFakeData.js

import { User, Equipment, Ticket, TicketComment, Permission } from '../../src/models/index.js';
import { sequelize } from '../../src/config/database.js';

async function seedFakeData() {
  await sequelize.sync(); // Asegura que las tablas existen

  // Usuarios
  const userUUIDs = {
    ana: '6d379b85-d32c-40b5-9a7a-86997d671166',
    luis: 'b673ebee-9e77-4d8b-a8a1-c1d217447f5f',
    carla: '0ba423b6-7cdb-438a-a388-5cb8ad2f9bc0',
    pedro: '6f2e3fb6-baa2-4bf2-956b-ae871e231067'
  };
  // Eliminar todos los usuarios excepto el administrador
  await User.destroy({ where: { rol: { [sequelize.Op.ne]: 'admin' } } });
  // Opcional: eliminar todos y luego crear solo el admin
  // await User.destroy({ where: {} });
  // Insertar solo el usuario administrador
  await User.bulkCreate([
    { id: userUUIDs.ana, nombre_completo: 'Ana Martínez', usuario: 'ana.mtz', correo: 'ana@empresa.com', rol: 'admin', contrasena: 'hash1', departamento: 'Sistemas', isActive: true, numero_empleado: 'EMP001' }
  ], { ignoreDuplicates: true });

  // Equipos
  const now = new Date();
  // Insertar equipos después de usuarios
  await Equipment.bulkCreate([
    { name: 'Laptop Ana', type: 'laptop', brand: 'Dell', model: 'XPS 13', serial_number: 'SN123456', inventory_number: 'INV-001', status: 'assigned', location: 'Oficina 101', UserId: 1, purchase_date: '2023-01-10', warranty_expiration: '2026-01-10', notes: 'Equipo principal', created_at: now, updated_at: now },
    { name: 'Impresora HP', type: 'printer', brand: 'HP', model: 'LaserJet', serial_number: 'SN654321', inventory_number: 'INV-002', status: 'available', location: 'Sala común', UserId: null, purchase_date: '2022-05-20', warranty_expiration: '2025-05-20', notes: 'Uso compartido', created_at: now, updated_at: now },
    { name: 'Servidor DB', type: 'server', brand: 'Lenovo', model: 'ThinkSys', serial_number: 'SN789012', inventory_number: 'INV-003', status: 'maintenance', location: 'Data Center', UserId: null, purchase_date: '2021-09-15', warranty_expiration: '2024-09-15', notes: 'Mantenimiento anual', created_at: now, updated_at: now },
  ], { ignoreDuplicates: true });

  // Tickets
  const ticketYear = new Date().getFullYear();
  // Insertar tickets después de usuarios y equipos
  await Ticket.bulkCreate([
    { ticket_number: `SBDI/0001/${ticketYear}`, title: 'No enciende laptop', description: 'La laptop no prende', userId: 3, equipmentId: 1, status: 'nuevo', priority: 'alta', serviceType: 'correctivo', assignedToId: 2, diagnosis: null, solution: null, createdAt: '2025-11-18 09:00:00', reported_by_id: userUUIDs.carla },
    { ticket_number: `SBDI/0002/${ticketYear}`, title: 'Papel atascado', description: 'Impresora marca error papel', userId: 1, equipmentId: 2, status: 'en_proceso', priority: 'media', serviceType: 'correctivo', assignedToId: 2, diagnosis: 'Revisar rodillos', solution: null, createdAt: '2025-11-18 10:30:00', reported_by_id: userUUIDs.ana },
    { ticket_number: `SBDI/0003/${ticketYear}`, title: 'Actualizar servidor', description: 'Solicitud de actualización', userId: 2, equipmentId: 3, status: 'cerrado', priority: 'baja', serviceType: 'preventivo', assignedToId: 1, diagnosis: 'Listo', solution: 'Parche aplicado', createdAt: '2025-11-17 15:00:00', reported_by_id: userUUIDs.luis },
  ], { ignoreDuplicates: true });

  // Comentarios de Ticket
  await TicketComment.bulkCreate([
    { ticketId: 1, userId: 2, comment: 'Revisando el equipo', createdAt: '2025-11-18 09:30:00' },
    { ticketId: 2, userId: 2, comment: 'Se limpió el rodillo', createdAt: '2025-11-18 11:00:00' },
    { ticketId: 3, userId: 1, comment: 'Actualización completada', createdAt: '2025-11-17 16:00:00' },
  ], { ignoreDuplicates: true });

  // Permisos
  await Permission.bulkCreate([
    { name: 'admin', description: 'Acceso total' },
    { name: 'tecnico', description: 'Gestión de tickets/equipos' },
    { name: 'usuario', description: 'Reporte de tickets propios' },
  ], { ignoreDuplicates: true });

  console.log('Datos inventados insertados correctamente.');
  process.exit(0);
}

seedFakeData().catch(err => {
  console.error('Error al insertar datos inventados:', err);
  process.exit(1);
});
