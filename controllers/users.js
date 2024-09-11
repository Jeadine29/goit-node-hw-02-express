const User = require('../models/users');
const Joi = require('joi');

const signup = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate({ email, password });
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Check if email is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: 'Email in use' });

  // Create a new user
  const user = new User({ email, password });
  await user.save();

  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate({ email, password });
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Find the user
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

  // Generate token
  const token = user.generateToken();
  user.token = token;
  await user.save();

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: 'Not authorized' });

  user.token = null;
  await user.save();
  res.status(204).send();
};

const getCurrentUser = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: 'Not authorized' });

  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};
