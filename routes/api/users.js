const express = require('express');
const { signup, login, logout, currentUser } = require('../../controllers/users');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', auth, logout);
router.get('/current', auth, currentUser);

module.exports = router;
