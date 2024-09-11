const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const signup = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'Email in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

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
  req.user.token = null;
  await req.user.save();
  res.status(204).send();
};

const currentUser = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

module.exports = {
  signup,
  login,
  logout,
  currentUser,
};
