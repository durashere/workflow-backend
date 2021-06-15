import { Router } from 'express';
import userRoutes from './user.route';
import printerRoutes from './printer.route';
import tonerRoutes from './toner.route';
import templateRoutes from './template.route';
import locationRoutes from './location.route';

const router = Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/routes
 */

router.use('/users', userRoutes);
router.use('/printers', printerRoutes);
router.use('/toners', tonerRoutes);
router.use('/templates', templateRoutes);
router.use('/locations', locationRoutes);

export default router;
