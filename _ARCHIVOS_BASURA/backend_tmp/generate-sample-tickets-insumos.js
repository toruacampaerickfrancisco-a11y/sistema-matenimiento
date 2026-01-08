import { sequelize, User, Ticket } from '../src/models/index.js';
import { DataTypes } from 'sequelize';

const Insumo = sequelize.define('insumos', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.STRING,
  cantidad: DataTypes.INTEGER,
  unidad: DataTypes.STRING,
  ubicacion: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE
}, {
  tableName: 'insumos',
  timestamps: false
});

function randItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

async function run() {
  try {
    await sequelize.authenticate();

    const users = await User.findAll({ attributes: ['id','nombre_completo','correo'] });
    if (!users || users.length === 0) {
      console.error('No users found in DB. Aborting.');
      return process.exit(1);
    }

    const sampleInsumos = [
      { nombre: 'Memoria RAM 8GB', descripcion: 'DDR4 8GB', cantidad: 50, unidad: 'unidades', ubicacion: 'Almacén' },
      { nombre: 'Disco Sólido 256GB SSD', descripcion: 'SSD SATA 256GB', cantidad: 40, unidad: 'unidades', ubicacion: 'Almacén' },
      { nombre: 'Mouse Óptico', descripcion: 'Mouse USB negro', cantidad: 100, unidad: 'unidades', ubicacion: 'Almacén' },
      { nombre: 'Pantalla 22"', descripcion: 'Monitor 22 pulgadas', cantidad: 20, unidad: 'unidades', ubicacion: 'Almacén' },
      { nombre: 'Bocina USB', descripcion: 'Bocina pequeña USB', cantidad: 30, unidad: 'unidades', ubicacion: 'Almacén' }
    ];

    for (const si of sampleInsumos) {
      const [existing] = await sequelize.query(`SELECT id FROM insumos WHERE LOWER(nombre)=LOWER(:nombre) LIMIT 1`, {
        replacements: { nombre: si.nombre }
      });
      if (!existing || existing.length === 0) {
        await Insumo.create({ ...si, created_at: new Date(), updated_at: new Date() });
        console.log('Inserted insumo:', si.nombre);
      } else {
        console.log('Insumo already exists, skipping:', si.nombre);
      }
    }

    const titles = [
      'Falla en equipo: no enciende',
      'Solicitud de cambio de disco',
      'Pantalla con líneas',
      'Mouse no responde',
      'Solicito instalación de memoria RAM'
    ];

    const descriptions = [
      'El equipo presenta falla al intentar arrancar, muestra luces pero no inicia sistema operativo.',
      'Solicito reemplazo por disco SSD para mejorar rendimiento.',
      'La pantalla muestra líneas verticales intermitentes.',
      'El mouse deja de funcionar ocasionalmente al moverlo.',
      'Necesito adicionar memoria RAM por lentitud en aplicaciones.'
    ];

    const priorities = ['sin_clasificar','baja','media','alta','critica'];
    const serviceTypes = ['preventivo','correctivo','instalacion'];

    const createCount = 20;
    for (let i=0;i<createCount;i++) {
      const reporter = randItem(users);
      const assigned = Math.random() < 0.3 ? randItem(users) : null;
      const title = randItem(titles) + (Math.random()<0.4 ? ` - ${i+1}` : '');
      const description = randItem(descriptions) + `\nGenerado automáticamente para pruebas (#${i+1}).`;
      const priority = randItem(priorities);
      const service_type = randItem(serviceTypes);

      const ticket_number = await Ticket.generateTicketNumber();
      const ticket = await Ticket.create({
        ticket_number,
        title,
        description,
        reported_by_id: reporter.id,
        assigned_to_id: assigned ? assigned.id : null,
        priority,
        service_type,
        status: 'nuevo',
        attachments: null,
        tags: null
      });
      console.log('Created ticket:', ticket.ticket_number, '-', title, 'reportedBy:', reporter.nombre_completo || reporter.correo);
    }

    console.log('Sample generation complete.');

  } catch (err) {
    console.error('Error during generation:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
