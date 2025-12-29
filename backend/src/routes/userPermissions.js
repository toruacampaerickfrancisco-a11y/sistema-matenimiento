import Router from 'koa-router';
import { authenticateToken } from '../middleware/auth.js';
import userController from '../controllers/userController.js';

const router = new Router({ prefix: '/users' });

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios con sus permisos
router.get('/permissions/all', userController.getAllUsersWithPermissions.bind(userController));

// Obtener permisos del usuario
router.get('/:id/permissions', userController.getUserPermissions.bind(userController));

// Asignar permiso a usuario
router.post('/:id/permissions', userController.assignPermission.bind(userController));

// Revocar permiso a usuario
router.delete('/:id/permissions/:permissionId', userController.revokePermission.bind(userController));

// Obtener módulos a los que el usuario tiene acceso
router.get('/:id/modules', userController.getUserModules.bind(userController));

export default router;
