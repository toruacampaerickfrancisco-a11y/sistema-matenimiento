import Router from 'koa-router';
import userController from '../controllers/userController.js';
import { authenticateToken, requireRole, requirePermission } from '../middleware/auth.js';

const router = new Router({ prefix: '/users' });

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de perfil del usuario autenticado
router.get('/profile', userController.getProfile.bind(userController));
router.put('/profile', userController.updateProfile.bind(userController));

// Rutas administrativas
router.get('/', requirePermission('users', 'view'), userController.getAllUsers.bind(userController));
router.get('/role/:role', requirePermission('users', 'view'), userController.getUsersByRole.bind(userController));
router.get('/:id', requirePermission('users', 'view'), userController.getUserById.bind(userController));
// Ruta para obtener los módulos a los que el usuario tiene acceso
router.get('/:id/modules', requirePermission('users', 'view'), userController.getUserModules.bind(userController));
router.post('/', requirePermission('users', 'create'), userController.createUser.bind(userController));
router.put('/:id', requirePermission('users', 'edit'), userController.updateUser.bind(userController));
router.delete('/:id', requirePermission('users', 'delete'), userController.deleteUser.bind(userController));

export default router;