import { Router } from 'express';
import 'express-async-errors';
import { protect, restrictTo } from '../../controllers/auth.controller';
import {
  getAllTemplates,
  createTemplate,
} from '../../controllers/template.controller';

const router = Router();

router
  .route('/')
  .get(protect, restrictTo('user', 'admin'), getAllTemplates)
  .post(protect, restrictTo('admin'), createTemplate);

export default router;
