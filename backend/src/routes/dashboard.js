import Router from 'koa-router';
import dashboardController from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = new Router({ prefix: '/dashboard' });

// Rutas protegidas
router.get('/stats', authenticateToken, dashboardController.getStats);
// Ruta temporal sin autenticación para pruebas
router.get('/stats-test', dashboardController.getStats);

export default router;
