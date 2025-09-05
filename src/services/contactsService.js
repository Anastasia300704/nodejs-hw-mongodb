export const fetchAllContacts = async ({ page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite }) => {
  const skip = (page - 1) * perPage;

  const filter = {};
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

export const createContact = async data => {
  const newContact = await Contact.create(data);
  return newContact;
};
export const fetchContactById = async (id) => Contact.findById(id);

export const updateContactById = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContactById = async (id) => Contact.findByIdAndDelete(id);


