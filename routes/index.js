const express = require('express');
const router = express.Router();
const contactsRouter = require('./api/contacts');
const usersRouter = require('./api/users');

// Mount routers
router.use('/contacts', contactsRouter);
router.use('/users', usersRouter);

module.exports = router;
