const express = require('express');
const User = require('../../models/users');
const Joi = require('joi');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

router.post('/signup', validateUser, async (req, res) => {
  const { email, password } = req.body;

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
});

router.post('/login', validateUser, async (req, res) => {
  const { email, password } = req.body;

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
});

router.get('/logout', authMiddleware, async (req, res) => {
  const user = req.user;
  user.token = null;
  await user.save();

  res.status(204).send();
});

router.get('/current', authMiddleware, (req, res) => {
  res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
});

module.exports = router;
