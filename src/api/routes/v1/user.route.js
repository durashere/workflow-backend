import { Router } from 'express';
import 'express-async-errors';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  restrictTo,
  changePassword,
} from '../../controllers/auth.controller';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/user.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', protect, restrictTo('admin'), forgotPassword);
router.patch('/changepassword', protect, changePassword);
router.patch('/resetpassword/:token', resetPassword);

router
  .route('/')
  .get(protect, restrictTo('admin'), getAllUsers)
  .post(protect, restrictTo('admin'), createUser);

router
  .route('/:id')
  .get(protect, restrictTo('admin'), getUser)
  .patch(protect, restrictTo('user', 'admin'), updateUser)
  .delete(protect, restrictTo('admin'), deleteUser);

export default router;
