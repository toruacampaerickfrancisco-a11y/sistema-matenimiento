import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import koaLogger from 'koa-logger';
import compress from 'koa-compress';
import json from 'koa-json';
import Router from 'koa-router';


// Configuración
import config from './config/config.js';
import { testConnection, syncDatabase } from './config/database.js';
import appLogger from './utils/logger.js';
// import { seedDatabase } from './seeders/initialData.js';

// Modelos
import './models/index.js';

// Rutas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import ticketRoutes from './routes/tickets.js';
import equipmentRoutes from './routes/equipment.js';
import notificationRoutes from './routes/notifications.js';
import userPermissionsRoutes from './routes/userPermissions.js';
import permissionRoutes from './routes/permissions.js';
import dashboardRoutes from './routes/dashboard.js';
import insumosRoutes from './routes/insumos.js';
import departmentRoutes from './routes/departments.js';

// Crear app Koa
const app = new Koa();
const router = new Router();

// Logging helpers
const LOG_LEVEL = process.env.LOG_LEVEL || (config && config.server && config.server.logLevel) || 'info';
function log(...args) { if (LOG_LEVEL !== 'silent') appLogger.info(args.join(' ')); }
function debug(...args) { if (LOG_LEVEL === 'debug') appLogger.debug(args.join(' ')); }


// Middleware globales
app.use(helmet()); // Seguridad
app.use(compress()); // Compresión
app.use(json({ pretty: false, param: 'pretty' })); // JSON prettier
app.use(bodyParser({
  enableTypes: ['json', 'form'],
  jsonLimit: '10mb',
  formLimit: '10mb'
}));


// CORS
app.use(cors({
  origin: (ctx) => {
    // Allow configuring a single allowed origin via env var (for external access)
    const allowedOrigin = process.env.ALLOWED_ORIGIN; // e.g. 'http://192.168.0.50:30001'
    const requestOrigin = ctx.request.header.origin;
    if (allowedOrigin) {
      // If the request origin matches the configured origin, allow it
      if (requestOrigin && requestOrigin === allowedOrigin) return allowedOrigin;
      return ''; // empty string -> CORS will block
    }
    // Default: allow local dev origins and reflect origin if present
    const validOrigins = ['http://localhost:30001', 'http://127.0.0.1:30001'];
    if (requestOrigin) {
      if (validOrigins.includes(requestOrigin)) return requestOrigin;
      return requestOrigin; // reflect by default for convenience in development
    }
    return '*';
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Optional middleware to restrict access to a single client IP
// Configure with: ALLOWED_CLIENT_IP=192.168.0.57
app.use(async (ctx, next) => {
  const allowedIp = process.env.ALLOWED_CLIENT_IP;
  if (!allowedIp) return await next();

  // Try several ways to extract client IP (supports proxied requests if X-Forwarded-For used)
  let reqIp = ctx.ip || ctx.request.ip || (ctx.request.socket && ctx.request.socket.remoteAddress) || '';
  // Normalize IPv6 mapped IPv4 (::ffff:192.168.0.1)
  if (reqIp && reqIp.startsWith('::ffff:')) reqIp = reqIp.replace('::ffff:', '');

  if (reqIp !== allowedIp) {
    ctx.status = 403;
    ctx.body = {
      success: false,
      message: 'Access forbidden: client IP not allowed'
    };
    console.warn(`Blocked request from IP ${reqIp}, allowed: ${allowedIp}`);
    return;
  }

  await next();
});

// Logger solo en desarrollo (request logging)
if (config.server.env === 'development') {
  app.use(koaLogger());
}

// Error handler global
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error no capturado:', err);
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      message: config.server.env === 'development' ? err.message : 'Error interno del servidor',
      ...(config.server.env === 'development' && { stack: err.stack })
    };
    app.emit('error', err, ctx);
  }
});

// Ruta de health check
router.get('/health', (ctx) => {
  ctx.body = {
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
    version: '1.0.0'
  };
});

// Ruta raíz
router.get('/', (ctx) => {
  ctx.body = {
    success: true,
    message: 'API Sistema ERP Mantenimiento - Secretaría de Bienestar del Estado de Sonora',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      equipment: '/api/equipment',
      tickets: '/api/tickets'
    }
  };
});

// Registrar rutas de la API
const apiRouter = new Router({ prefix: '/api' });

// Agregar todas las rutas
apiRouter.use(authRoutes.routes(), authRoutes.allowedMethods());
apiRouter.use(userPermissionsRoutes.routes(), userPermissionsRoutes.allowedMethods());
apiRouter.use(userRoutes.routes(), userRoutes.allowedMethods());
apiRouter.use(permissionRoutes.routes(), permissionRoutes.allowedMethods());
apiRouter.use(ticketRoutes.routes(), ticketRoutes.allowedMethods());
apiRouter.use(equipmentRoutes.routes(), equipmentRoutes.allowedMethods());
apiRouter.use(notificationRoutes.routes(), notificationRoutes.allowedMethods());
apiRouter.use(dashboardRoutes.routes(), dashboardRoutes.allowedMethods());
apiRouter.use(insumosRoutes.routes(), insumosRoutes.allowedMethods());
apiRouter.use(departmentRoutes.routes(), departmentRoutes.allowedMethods());

// Registrar routers
app.use(router.routes(), router.allowedMethods());
app.use(apiRouter.routes(), apiRouter.allowedMethods());
// Las rutas específicas ya están registradas bajo el prefijo `/api` en `apiRouter`.
// Evitar registrar las mismas rutas directamente en la app para prevenir duplicados.

// Middleware para rutas no encontradas
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    success: false,
    message: 'Ruta no encontrada',
    path: ctx.path,
    method: ctx.method
  };
});

// Servir archivos estáticos del frontend


// Función para inicializar la base de datos
async function initializeDatabase() {
  log('🔵 [PIN] Inicializando base de datos...');
  // Probar conexión
  log('🔵 [PIN] Probando conexión a la base de datos...');
  const connected = await testConnection();
  if (!connected) {
    console.error('🔴 [PIN] No se pudo conectar a la base de datos');
    throw new Error('No se pudo conectar a la base de datos');
  }

  // Sincronizar modelos (crear tablas)
  log('🔵 [PIN] Sincronizando modelos...');
  if (process.env.DB_SYNC !== 'false') {
    await syncDatabase(false); // false = no recrear tablas existentes
  } else {
    log('🟡 [PIN] Sincronización desactivada por configuración (DB_SYNC=false)');
  }

  // Verificar si hay datos, si no, poblar
  try {
    log('🔵 [PIN] Verificando usuarios en la base de datos...');
    const { User } = await import('./models/index.js');
    const userCount = await User.count();
    if (userCount === 0) {
      log('🟡 [PIN] No hay datos, poblando base de datos...');
      // await seedDatabase();
    } else {
      log(`🟢 [PIN] Base de datos ya tiene ${userCount} usuarios`);
    }
    return {
      connected: true,
      userCount
    };
  } catch (error) {
    console.error('🔴 [PIN] Error al verificar datos, poblando base de datos...');
    // await seedDatabase();
    return {
      connected: true,
      userCount: null
    };
  } finally {
    log('🟢 [PIN] Base de datos inicializada correctamente');
  }
}


// Función para iniciar el servidor
async function startServer() {
  try {
    log('🔵 [PIN] Iniciando servidor ERP Mantenimiento...');
    const dbSummary = await initializeDatabase();
    const server = app.listen(config.server.port, config.server.host, () => {
      log('🟢 [PIN] Servidor iniciado correctamente');
      const dbName = config.database.database || config.database.storage || '(sqlite)';
      appLogger.info(`Servidor iniciado — Host: ${config.server.host} — Puerto: ${config.server.port} — Entorno: ${config.server.env}`);
      appLogger.info(`API: http://${config.server.host}:${config.server.port}/api — Health: http://${config.server.host}:${config.server.port}/health`);
      appLogger.info(`DB: ${config.database.dialect}@${config.database.host || 'local'} / ${dbName} — Usuarios: ${dbSummary.userCount !== null ? dbSummary.userCount : 'N/A'}`);
    });
    server.on('error', (error) => {
      console.error('❌ Error en el servidor:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Error handlers del proceso
// Eliminar cierre automático por errores no capturados para desarrollo
// process.on('uncaughtException', (error) => {
//   console.error('❌ Excepción no capturada:', error);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ Promesa rechazada no manejada:', reason);
//   process.exit(1);
// });

// Iniciar servidor solo si no estamos en el entorno de prueba
if (process.env.NODE_ENV !== 'test') {
  startServer();
} else {
  console.log('🟡 [PIN] NODE_ENV=test - servidor no se inicia automáticamente (modo prueba)');
}

export default app;