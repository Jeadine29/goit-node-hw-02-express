const express = require('express');
const User = require('../models/users');
const Joi = require('joi');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

// Registration
router.post('/signup', async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: 'Email in use' });

  const user = new User({ email, password });
  await user.save();

  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

// Login
router.post('/login', async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

  const token = user.generateAuthToken();
  await user.save();

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

// Logout
router.get('/logout', authMiddleware, async (req, res) => {
  const user = req.user;
  user.token = null;
  await user.save();

  res.status(204).send();
});

// Current User
router.get('/current', authMiddleware, (req, res) => {
  res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

module.exports = router;
