import Router from 'koa-router';
import insumoController from '../controllers/insumoController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requirePermission } from '../middleware/auth.js';

const router = new Router({ prefix: '/insumos' });

router.get('/', authenticateToken, requirePermission('supplies', 'view'), insumoController.getAllInsumos);
router.post('/', authenticateToken, requirePermission('supplies', 'create'), insumoController.createInsumo);
router.put('/:id', authenticateToken, requirePermission('supplies', 'edit'), insumoController.updateInsumo);
router.get('/:id/history', authenticateToken, requirePermission('supplies', 'view'), insumoController.getHistory);
router.delete('/:id', authenticateToken, requirePermission('supplies', 'delete'), insumoController.deleteInsumo);

export default router;
