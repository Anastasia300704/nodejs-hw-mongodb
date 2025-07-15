import { Contact } from '../models/contact.js';

export const fetchAllContacts = async () => {
  return Contact.find();
};

export const fetchContactById = async (id) => {
  return Contact.findById(id);
};

export const createContact = async data => {
  const newContact = await Contact.create(data);
  return newContact;
};

export const updateContactById = async (contactId, data) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, data, {
    new: true,
  });
  return updatedContact;
};

export const removeContactById = async contactId => {
  const deletedContact = await Contact.findByIdAndDelete(contactId);
  return deletedContact;
};


