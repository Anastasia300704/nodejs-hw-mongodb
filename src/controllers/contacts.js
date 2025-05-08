import createError from 'http-errors';
import { fetchAllContacts, fetchContactById } from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await fetchAllContacts();
    res.status(200).json({ status: 200, message: 'Successfully found contacts!', data: contacts });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await fetchContactById(req.params.contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({ status: 200, message: `Successfully found contact with id ${req.params.contactId}!`, data: contact });
  } catch (err) {
    next(err);
  }
};
