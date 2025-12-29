import Router from 'koa-router';
import { authenticateToken } from '../middleware/auth.js';
import permissionController from '../controllers/permissionController.js';

const router = new Router({ prefix: '/permissions' });

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', permissionController.getAllPermissions);

export default router;
