import {
  fetchAllContacts,
  fetchContactById,
  createContact as createContactService,
  updateContactById,
  deleteContactById,
} from '../services/contactsService.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res, next) => {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;
   const userId = req.user._id;

  const contacts = await fetchAllContacts({
        userId,
    page: Number(page) || 1,
    perPage: Number(perPage) || 10,
    sortBy,
    sortOrder,
    type,
    isFavourite,
    });
  
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  
  const contact = await fetchContactById(contactId, userId);

  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res, next) => {
  const userId = req.user._id;
  const newContact = await createContactService(req.body, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const updatedContact = await updateContactById(contactId, req.body, userId);

  if (!updatedContact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  
  const deleted = await deleteContactById(contactId, userId);

  if (!deleted) throw createError(404, 'Contact not found');

  res.status(204).send();
};
