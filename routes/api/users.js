const express = require('express');
const router = express.Router();
const { signup, login, logout, getCurrentUser } = require('../../controllers/usersController');
const auth = require('../../middlewares/auth');

// Registration
router.post('/signup', signup);

// Login
router.post('/login', login);

// Logout
router.get('/logout', auth, logout);

// Get current user
router.get('/current', auth, getCurrentUser);

module.exports = router;
