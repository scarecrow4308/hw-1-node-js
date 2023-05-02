const { Contact } = require("../db/contactModel");
const { WrongParametersError } = require("../helpers/errors");

async function getContacts(owner, { favorite, skip, limit }) {
  const condition = { owner };

  if (favorite !== "default") {
    condition.favorite = favorite;
  }

  const contacts = await Contact.find(condition, { __v: 0, owner: 0 })
    .skip(skip)
    .limit(limit)
    .sort("name");

  return contacts;
}

async function getContactById(owner, contactId) {
  const contact = await Contact.findOne({ owner, _id: contactId });
  if (!contact) {
    throw new WrongParametersError("Not found");
  }

  return contact;
}

async function removeContact(owner, contactId) {
  const result = await Contact.findOneAndDelete({ owner, _id: contactId });

  if (!result) {
    throw new WrongParametersError("Not found");
  }

  return result;
}

async function addContact(owner, newContact) {
  const contact = new Contact({ ...newContact, owner });
  await contact.save();
  return {
    _id: contact._id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    favorite: contact.favorite,
  };
}

async function updateContact(owner, contactId, body) {
  const contact = await Contact.findOneAndUpdate(
    { owner, _id: contactId },
    { $set: body }
  );

  if (!contact) {
    throw new WrongParametersError("Not found");
  }

  return contact;
}

async function updateStatusContact(owner, contactId, body) {
  if (body.favorite === undefined) {
    throw new WrongParametersError("Missing field favorite");
  }

  const contact = await Contact.findOneAndUpdate(
    { owner, _id: contactId },
    { $set: body }
  );

  if (!contact) {
    throw new WrongParametersError("Not found");
  }
  contact.favorite = body.favorite;

  return contact;
}

module.exports = {
  addContact,
  removeContact,
  getContactById,
  getContacts,
  updateContact,
  updateStatusContact,
};
