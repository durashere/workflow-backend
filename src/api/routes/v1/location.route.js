import { Router } from 'express';
import 'express-async-errors';
import { protect, restrictTo } from '../../controllers/auth.controller';
import {
  getAllLocations,
  getLocation,
  createLocation,
  updateLocation,
} from '../../controllers/location.controller';

const router = Router();

router
  .route('/')
  .get(protect, restrictTo('user', 'admin'), getAllLocations)
  .post(protect, restrictTo('admin'), createLocation)
  .patch(protect, restrictTo('admin'), updateLocation);

router.route('/:id').get(protect, restrictTo('user', 'admin'), getLocation);

export default router;
