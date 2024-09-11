const User = require('../models/users');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation Schema
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signup = async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  const { error } = userSchema.validate({ email, password });
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Check if email is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: 'Email in use' });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const user = new User({ email, password: hashedPassword });
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

  // Validate user input
  const { error } = userSchema.validate({ email, password });
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Find the user
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
