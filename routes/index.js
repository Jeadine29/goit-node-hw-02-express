const express = require('express');
const router = express.Router();

router.use('/api/contacts', require('./api/contacts'));
router.use('/api/users', require('./api/users'));

module.exports = router;
