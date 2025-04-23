const express = require('express');
const router = express.Router();
const { getContacts, getContactById } = require('../services/contacts');

router.get('/contacts', getContacts);
router.get('/contacts/:contactId', getContactById);

module.exports = router;
