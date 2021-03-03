import User from '../models/user.model';

export const getAllUsers = async (req, res) => {
  const users = await User.find();

  return res.status(200).json({
    results: users.length,
    users,
  });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  return res.status(200).json({
    user,
  });
};

export const createUser = async (req, res) => {
  const newUser = await User.create(req.body);

  return res.status(201).json({
    user: newUser,
  });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    user,
  });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  return res.status(204).json();
};
