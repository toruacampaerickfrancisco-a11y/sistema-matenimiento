import Router from 'koa-router';
import equipmentController from '../controllers/equipmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = new Router({ prefix: '/equipment' });

// Rutas protegidas
router.get('/', authenticateToken, equipmentController.getAllEquipment);
router.get('/:id', authenticateToken, equipmentController.getEquipmentById);
router.post('/', authenticateToken, equipmentController.createEquipment);
router.put('/:id', authenticateToken, equipmentController.updateEquipment);
router.delete('/:id', authenticateToken, equipmentController.deleteEquipment);

export default router;
