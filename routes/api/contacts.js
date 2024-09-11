const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} = require('../../controllers/contactsController');

// Get all contacts (with pagination and filter)
router.get('/', auth, getAllContacts);

// Get contact by id
router.get('/:id', auth, getContactById);

// Add a new contact
router.post('/', auth, addContact);

// Update a contact
router.patch('/:id', auth, updateContact);

// Delete a contact
router.delete('/:id', auth, deleteContact);

module.exports = router;
