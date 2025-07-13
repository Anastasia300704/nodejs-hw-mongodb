import { Contact } from '../models/contact.js';

export const fetchAllContacts = async () => {
  return Contact.find();
};

export const fetchContactById = async (id) => {
  return Contact.findById(id);
};
