import Router from 'koa-router';
import { authenticateToken } from '../middleware/auth.js';
import * as activityController from '../controllers/activityController.js';

const router = new Router({ prefix: '/activities' });

// Middleware para asegurar que solo admin/tecnico accedan
const ensureTechOrAdmin = async (ctx, next) => {
    const role = ctx.state.user.rol;
    if (role === 'admin' || role === 'tecnico') {
        await next();
    } else {
        ctx.status = 403;
        ctx.body = { success: false, message: 'Acceso denegado. Se requiere rol Técnico o Admin.' };
    }
};

router.use(authenticateToken);
router.use(ensureTechOrAdmin);

router.get('/', activityController.listActivities);
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.post('/:id/comments', activityController.addComment);

export default router;
