import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import User from '../models/user.model';
import { jwtSecret, jwtExpire } from '../../config/config';

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
  const token = signToken(user._id);

  return res.status(200).json({
    token,
  });
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

export const getUserFromToken = async (req, res) => {
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

  return res.status(200).json({
    user: foundUser,
  });
};
