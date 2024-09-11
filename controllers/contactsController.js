const Contact = require('../models/contacts');

const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const filter = { owner: req.user._id };

  if (favorite) filter.favorite = favorite === 'true';

  try {
    const contacts = await Contact.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });

    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addContact = async (req, res) => {
  try {
    const contact = new Contact({ ...req.body, owner: req.user._id });
    await contact.save();

    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );

    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    res.status(200).json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
};
