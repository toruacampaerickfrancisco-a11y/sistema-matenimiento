import Router from 'koa-router';
import notificationController from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = new Router({ prefix: '/notifications' });

// Rutas protegidas
router.get('/', authenticateToken, notificationController.getAllNotifications);
router.put('/:id/read', authenticateToken, notificationController.markAsRead);
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

export default router;
