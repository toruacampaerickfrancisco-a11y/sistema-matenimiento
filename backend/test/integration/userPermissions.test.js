import request from 'supertest';

// NOTE: We'll use dynamic imports because the codebase uses ESM modules
async function setup() {
  // Import app and database helpers once per test run
  const appModule = await import('../../src/app.js');
  const { default: app } = appModule;
  const dbModule = await import('../../src/config/database.js');
  const { syncDatabase } = dbModule;
  const modelsModule = await import('../../src/models/index.js');
  const { User, Permission, UserPermission } = modelsModule;

  // Force sync DB to a clean state (drop and recreate)
  await syncDatabase(true);
  return { app, User, Permission, UserPermission };
}

// Helper to insert a permission
async function ensurePermission(Permission, { module, action, name, description }) {
  await Permission.findOrCreate({ where: { module, action }, defaults: {
    name: name || `${module}:${action}`,
    description: description || ''
  }});
}

describe('Integración: creación de usuarios y permisos por defecto', () => {
  let app;
  let User;
  let Permission;
  let UserPermission;

  beforeAll(async () => {
    const setupRes = await setup();
    app = setupRes.app;
    User = setupRes.User;
    Permission = setupRes.Permission;
    UserPermission = setupRes.UserPermission;

    // Create all the permissions required by roles (tecnico, inventario, usuario)
    const perms = [
      // Dashboard
      { module: 'dashboard', action: 'view', name: 'Ver Dashboard' },

      // Profile
      { module: 'profile', action: 'view' },
      { module: 'profile', action: 'edit' },

      // Tickets
      { module: 'tickets', action: 'view' },
      { module: 'tickets', action: 'create' },
      { module: 'tickets', action: 'edit' },
      { module: 'tickets', action: 'delete' },

      // Equipment
      { module: 'equipment', action: 'view' },
      { module: 'equipment', action: 'create' },
      { module: 'equipment', action: 'edit' },
      { module: 'equipment', action: 'delete' },

      // Users
      { module: 'users', action: 'view' },
      { module: 'users', action: 'create' },
      { module: 'users', action: 'edit' },
      { module: 'users', action: 'delete' },

      // Reports
      { module: 'reports', action: 'view' },
      { module: 'reports', action: 'export' },

      // Permissions
      { module: 'permissions', action: 'view' },
      { module: 'permissions', action: 'assign' },

      // Supplies
      { module: 'supplies', action: 'view' },
      { module: 'supplies', action: 'create' },
      { module: 'supplies', action: 'edit' },
      { module: 'supplies', action: 'delete' },
    ];

    for (const p of perms) {
      await ensurePermission(Permission, p);
    }

    // Create admin user (will bypass permission checks)
    await User.create({
      usuario: 'admin_test',
      correo: 'admin_test@example.com',
      contrasena: 'Password123',
      nombre_completo: 'Admin Test',
      numero_empleado: '0000',
      rol: 'admin',
      departamento: 'IT',
      activo: true
    });
  });

  afterAll(async () => {
    // Clean up the DB: re-sync to drop all tables
    const dbModule = await import('../../src/config/database.js');
    await dbModule.syncDatabase(true);
  });

  test('Crear usuario tecnico vía API asigna 15 permisos por defecto', async () => {
    // Login as admin to get token
    const loginRes = await request(app.callback())
      .post('/api/auth/login')
      .send({ username: 'admin_test', password: 'Password123' })
      .expect(200);

    const token = loginRes.body.data.token;

    // Create a tecnico user
    const userCreateRes = await request(app.callback())
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'tecnico_test',
        email: 'tecnico_test@example.com',
        password: 'Password123',
        fullName: 'Tecnico Test',
        employeeNumber: '1001',
        role: 'Técnico', // intentionally accented to test normalization
        department: 'Mantenimiento'
      })
      .expect(201);

    const createdUser = userCreateRes.body.data;

    // Fetch user details from DB (include permissions)
    const modelsModule = await import('../../src/models/index.js');
    const { User: U } = modelsModule;
    const userFromDb = await U.findOne({ where: { usuario: 'tecnico_test' }, include: [
      { model: UserPermission, as: 'permisos', include: [{ model: Permission, as: 'permission' }] }
    ] });

    expect(userFromDb).toBeTruthy();

    // Map permissions and check count
    const permsAssigned = (userFromDb.permisos || []).filter(p => p.is_active);

    expect(permsAssigned.length).toBe(15); // 'tecnico' expected 15

    // Check a couple of specific permission existence
    const modulesActions = permsAssigned.map(p => `${p.permission.module}:${p.permission.action}`);
    expect(modulesActions).toContain('tickets:create');
    expect(modulesActions).toContain('users:view');
  });
});
