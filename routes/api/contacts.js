const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth');
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} = require('../../controllers/contacts');

// Get all contacts (with pagination and filter)
router.get('/', authMiddleware, getAllContacts);

// Get contact by id
router.get('/:id', authMiddleware, getContactById);

// Add a new contact
router.post('/', authMiddleware, addContact);

// Update a contact
router.patch('/:id', authMiddleware, updateContact);

// Delete a contact
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;
