const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("./db/contacts.json");

async function listContacts() {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf8");
    console.log(contactsList);
  } catch (err) {
    console.error(err);
  }
}

async function getContactById(contactId) {
  try {
    const jsonArray = await fs.readFile(contactsPath, "utf8");
    const contactsList = JSON.parse(jsonArray);
    const contact = contactsList.find((el) => Number(el.id) === contactId);
    console.log({ contact });
  } catch (err) {
    console.error(err);
  }
}

async function removeContact(contactId) {
  try {
    const jsonArray = await fs.readFile(contactsPath, "utf8");
    const contactsList = JSON.parse(jsonArray);
    const editedContactsList = contactsList.filter(
      (el) => Number(el.id) !== contactId
    );
    const JsonEditedContactsList = JSON.stringify(editedContactsList, null, 2);
    await fs.writeFile(contactsPath, JsonEditedContactsList);
    console.log("Updated contacts list:", editedContactsList);
  } catch (err) {
    console.error(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const jsonArray = await fs.readFile(contactsPath, "utf8");
    const contactsList = JSON.parse(jsonArray);
    let lastId;
    if (contactsList.length > 0) {
      lastId = contactsList[contactsList.length - 1].id;
    } else {
      lastId = 0;
    }
    const newContact = {
      id: (Number(lastId) + 1).toString(),
      name,
      email,
      phone,
    };
    const newList = [...contactsList, newContact];
    const JsonEditedContactsList = JSON.stringify(newList, null, 2);
    await fs.writeFile(contactsPath, JsonEditedContactsList);
    console.log("Added contact:", newContact);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addContact,
  removeContact,
  getContactById,
  listContacts,
};
