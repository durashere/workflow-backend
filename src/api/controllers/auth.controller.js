import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

import { jwtSecret, jwtExpire } from '../../config/config';
import User from '../models/user.model';

const signToken = (id) =>
  jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire,
  });

const bearerToToken = (bearerHeader) => {
  let token;

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    token = bearerToken;
  } else {
    return token;
  }

  return token;
};

export const signup = async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  return res.status(201).json({
    token,
    user: newUser,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password exists
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide both email and password.' });
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  // If everything is ok, send token to client
  const sessionUser = await User.findOne({ email });

  const token = signToken(user._id);

  return res.status(200).json({
    token,
    user: sessionUser,
  });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: 'There is no user with that email address.',
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({
    resetToken,
  });
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: 'Token is invalid or has expired.',
    });
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return res.status(400).json({
      message: 'Confirm password must match password.',
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res.status(200).json({
    email: user.email,
  });
};

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  // if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
  //   return res.status(401).json({
  //     message: 'Inputted password does not match current password.',
  //   });
  // }

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.newPasswordConfirm;
  await user.save();

  const token = signToken(user._id);

  return res.status(200).json(token);
};

export const protect = async (req, res, next) => {
  const token = bearerToToken(req.get('authorization'));

  if (!token) {
    return res.status(401).json({
      message: 'You are not logged in! Please log in to get access.',
    });
  }

  const decoded = jwtDecode(token);

  const foundUser = await User.findById(decoded.id);
  if (!foundUser) {
    return res.status(401).json({
      message: 'The user associated with this token no longer exists.',
    });
  }

  if (foundUser.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: 'User recently changed password. Please log in again',
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = foundUser;
  return next();
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'You do not have permission to peform this action.' });
  }
  return next();
};
