import { Router } from 'express';
import 'express-async-errors';
import { protect, restrictTo } from '../../controllers/auth.controller';
import {
  getAllPrinters,
  getPrinter,
  createPrinter,
  updatePrinter,
  deletePrinter,
} from '../../controllers/printer.controller';

const router = Router();

router
  .route('/')
  .get(protect, restrictTo('user', 'admin'), getAllPrinters)
  .post(protect, restrictTo('admin'), createPrinter);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'admin'), getPrinter)
  .patch(protect, restrictTo('admin'), updatePrinter)
  .delete(protect, restrictTo('admin'), deletePrinter);

export default router;
