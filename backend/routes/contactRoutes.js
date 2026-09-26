const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContactStats,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  updateContactStatus
} = require('../controllers/contactController');

// Stats route must be registered BEFORE :id route to avoid treating "stats" as an ID
router.get('/stats', getContactStats);

// Contact collection routes
router.route('/')
  .get(getContacts)
  .post(createContact);

// Contact status route
router.patch('/:id/status', updateContactStatus);

// Single contact document routes
router.route('/:id')
  .get(getContactById)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
