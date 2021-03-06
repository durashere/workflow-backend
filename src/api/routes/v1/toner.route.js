import { Router } from 'express';
import 'express-async-errors';
import { protect, restrictTo } from '../../controllers/auth.controller';
import {
  getAllToners,
  getToner,
  createToner,
  updateToner,
  deleteToner,
  getAllUncategorized,
} from '../../controllers/toner.controller';

const router = Router();

router.get('/uncategorized', getAllUncategorized);

router
  .route('/')
  .get(protect, restrictTo('user', 'admin'), getAllToners)
  .post(protect, restrictTo('admin'), createToner);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'admin'), getToner)
  .patch(protect, restrictTo('admin'), updateToner)
  .delete(protect, restrictTo('admin'), deleteToner);

export default router;
