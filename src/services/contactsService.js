import { Contact } from '../models/contact.js';

export const fetchAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavourite,
}) => {
  const skip = (page - 1) * perPage;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filter);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page * perPage < totalItems,
  };
};

export const fetchContactById = async (id, userId) => {
  return await Contact.findOne({ _id: id, userId });
};

export const createContact = async (data, userId) => {
  return await Contact.create({ ...data, userId });
};

export const updateContactById = async (contactId, data, userId) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, { new: true });
};

export const deleteContactById = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};