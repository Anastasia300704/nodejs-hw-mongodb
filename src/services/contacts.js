import Contact from '../models/contact.js';

export const fetchAllContacts = async () => {
  return await Contact.find();
};

export const fetchContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const addContact = async (data) => {
  return await Contact.create(data);
};

