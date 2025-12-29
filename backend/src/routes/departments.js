import Router from 'koa-router';
import departmentController from '../controllers/departmentController.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = new Router({ prefix: '/departments' });

router.use(authenticateToken);

router.get('/', requirePermission('users', 'view'), departmentController.getAll.bind(departmentController));
router.get('/:id', requirePermission('users', 'view'), departmentController.getById.bind(departmentController));
router.post('/', requirePermission('users', 'create'), departmentController.create.bind(departmentController));
router.put('/:id', requirePermission('users', 'edit'), departmentController.update.bind(departmentController));
router.delete('/:id', requirePermission('users', 'delete'), departmentController.delete.bind(departmentController));

export default router;
