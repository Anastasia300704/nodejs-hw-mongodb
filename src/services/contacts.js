import { Contact } from '../models/contact.js';

export const getAllContacts = async (id) => {
  return await Contact.findByld(id);
};
