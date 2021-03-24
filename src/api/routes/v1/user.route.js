import { Router } from 'express';
import 'express-async-errors';
import {
  signup,
  login,
  getUserFromToken,
  forgotPassword,
  resetPassword,
  protect,
  restrictTo,
} from '../../controllers/auth.controller';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/user.controller';

const router = Router();

router.get(
  '/getuserfromtoken',
  protect,
  restrictTo('user', 'admin'),
  getUserFromToken
);
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', protect, restrictTo('admin'), forgotPassword);
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
