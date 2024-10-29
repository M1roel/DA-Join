const ACTIVE_CLASS = "active-contact";
const CONTACTS_URL = "https://join-2ee9e-default-rtdb.europe-west1.firebasedatabase.app/contacts";
const HEADERS = { "Content-Type": "application/json" };

/**
 * Performs a fetch request and returns the response as JSON.
 * If the request fails, an error is thrown.
 * 
 * @async
 * @param {string} url - The URL from which to fetch data.
 * @param {object} [options={}] - Optional: Options for the fetch call such as method, headers, or body.
 * @returns {Promise<object>} - A promise that resolves to the JSON response of the request.
 * @throws {Error} - Throws an error if the request is not successful.
 */
async function fetchData(url, options = {}) {
    let response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error! Status: ${response.status} (${response.statusText})`);
    }
    return response.json();
}

/**
 * Retrieves the data of a specific contact from the database.
 * 
 * @async
 * @param {string} contactId - The ID of the specific contact to retrieve.
 * @returns {Promise<object>} - A promise that resolves to the JSON data of the contact.
 */
async function getContact(contactId) {
    return await fetchData(`${CONTACTS_URL}/${contactId}.json`);
}

/**
 * Deletes a contact from the database and performs additional operations after the deletion.
 * 
 * @async
 * @param {string} contactId - The ID of the contact to be deleted.
 */
async function deleteContact(contactId) {
    try {
      await fetchData(`${CONTACTS_URL}/${contactId}.json`, { method: "DELETE" });
      await handlePostDeleteOperations(contactId);
    } catch (error) {
      console.error("Error during deletion:", error);
    }
}

/**
 * Adds a new contact to the database.
 * 
 * @async
 * @param {object} contact - The contact object to be added to the database.
 */
async function postContact(contact) {
    let newContact = await fetchData(`${CONTACTS_URL}.json`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(contact),
    });
}

/**
 * Replaces a contact by deleting the old one and creating a new contact.
 * 
 * This function deletes the contact with the given ID and then creates a new contact with the provided updated data.
 * After replacing the contact, it updates the contact list. Errors are logged to the console.
 * 
 * @async
 * @param {string} contactId - The unique identifier of the contact to be replaced.
 * @param {object} updatedContact - An object with the new contact data to replace the old contact.
 * @returns {Promise<void>} - Resolves when the contact has been successfully replaced and the contact list has been updated.
 * @throws {Error} - Logs an error if the contact ID is invalid or if there is an issue replacing the contact.
 */
async function replaceContact(contactId, updatedContact) {
    try {
      if (!contactId) {
        throw new Error("Invalid contact ID. Contact cannot be replaced.");
      }
      await postContact(updatedContact);
      await deleteContact(contactId);  
      //await selectNextContact(contactId);
      document.getElementById('contact-section').innerHTML = "";
    } catch (error) {
      console.error("Error replacing contact:", error);
    }
}

/**
 * Executes post-deletion operations to update the contact list and show the progress bar.
 * @async
 * @param {string} contactId - The ID of the deleted contact.
 */
async function handlePostDeleteOperations(contactId) {
  await updateContactList();
  document.getElementById('contact-section').innerHTML = "";
  closeEditField();
}

/**
 * Adds a new contact, updates the contact list, and displays the details of the newly created contact.
 * If no profile image is provided, one is generated.
 * 
 * @async
 * @param {object} contact - The contact object to be added.
 */
async function addContact(contact) {
    try {
      contact.img = contact.img || generateProfileImage(contact.name);
      await postContact(contact);
      await updateContactList();
      let contactId = await getContactId(contact);
      if (contactId) {
        await initContactDetails(contactId);
      }
      showUpdateBar();
    } catch (error) {
      console.error("Error uploading contact:", error);
    }
}

/**
 * Searches for the ID of a contact based on the name and email.
 * 
 * This function searches the contact list for a contact whose name and email match the given values.
 * 
 * @async
 * @param {Object} contact - The contact object with `name` and `mail` properties.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.mail - The email of the contact.
 * @returns {Promise<string|undefined>} - Returns the ID of the contact if found, otherwise `undefined`.
 * @throws {Error} - Throws an error if there is a problem querying the data.
 */
async function getContactId(contact) {
    let contacts = await fetchData(`${CONTACTS_URL}.json`);
    return Object.keys(contacts).find(id => contacts[id].name === contact.name && contacts[id].mail === contact.mail);
}

/**
 * Selects the next contact from the list after a contact has been deleted.
 * 
 * @async
 * @param {string} deletedContactId - The ID of the deleted contact.
 * @returns {Promise<void>}
 */
async function selectNextContact(deletedContactId) {
  try {
    let contacts = await fetchData(`${CONTACTS_URL}.json`);
    let sortedContacts = sortContacts(contacts);
    let currentIndex = sortedContacts.findIndex(([id]) => id === deletedContactId);
    let nextContact = sortedContacts[currentIndex + 1];

    if (nextContact) {
      await selectContact(nextContact[0]);
    } else {
      document.getElementById("contact-section").innerHTML = "";
    }
  } catch (error) {
    console.error("Error selecting next contact:", error);
  }
}

/**
 * Deselects all contacts in the contact list.
 */
function deselectAllContacts() {
  document.querySelectorAll('[id^="contactlist-item"]').forEach((contact) => {
    contact.classList.remove("bg-color-dg", ACTIVE_CLASS);
    contact.style.pointerEvents = "auto";
    contact.querySelector(".contactlist-databox .fw-400")?.classList.remove("selected-contact-name");
  });
}

/**
 * Highlights the selected contact in the contact list.
 * @param {HTMLElement} selectedContact - The HTML element of the selected contact.
 */
async function highlightContact(selectedContact) {
  if (!selectedContact.classList.contains("bg-color-dg")) {
    selectedContact.classList.add("bg-color-dg", ACTIVE_CLASS);
    selectedContact.style.pointerEvents = "none";
    selectedContact.querySelector(".contactlist-databox .fw-400")?.classList.add("selected-contact-name");
  }
}

/**
 * Shows the update bar with an animated transition.
 * and "moveOut" animations. The function manages event listeners for smooth transitions.
 */
function showUpdateBar() {
  let updateBar = document.getElementById("update-bar");
  updateBar.classList.remove("d-none");
  addMoveInListener(updateBar);
}

/**
 * Adds an animation end listener for the "moveIn" animation.
 * and adds an animation end listener for the "moveOut" animation.
 * 
 * @param {HTMLElement} updateBar - The update bar element to which the listener is added.
 */
function addMoveInListener(updateBar) {
  updateBar.addEventListener("animationend", function handleMoveIn(event) {
    if (event.animationName === "moveIn") {
      setTimeout(() => {
        addMoveOutListener(updateBar);
      }, 400);
      updateBar.removeEventListener("animationend", handleMoveIn);
    }
  });
}

/**
 * Adds an animationend listener for the "moveOut" animation.
 * re-adds the "moveIn" animation listener for future animations.
 * 
 * @param {HTMLElement} updateBar - The update bar element to which the listener is added.
 */
function addMoveOutListener(updateBar) {
  updateBar.classList.add("move-out");
  updateBar.addEventListener("animationend", function handleMoveOut(event) {
    if (event.animationName === "moveOut") {
      setTimeout(() => {
        finalizeUpdateBar(updateBar);
      }, 100);
      updateBar.removeEventListener("animationend", handleMoveOut);
    }
  });
}

/**
 * Finalizes the update bar by hiding it and resetting event listeners.
 * Adds the "d-none" class to hide the update bar and re-adds the "moveIn" animation listener 
 * @param {HTMLElement} updateBar - The update bar element to be finalized.
 */
function finalizeUpdateBar(updateBar) {
  updateBar.classList.add("d-none");
  addMoveInListener(updateBar);
}

/**
 * Sorts contacts alphabetically based on their names.
 * @param {object} contacts - An object where each key is the contact ID and each value is the contact data.
 * @returns {Array} - An array of arrays, each containing the ID and contact object, sorted by name.
 */
function sortContacts(contacts) {
  return Object.entries(contacts).sort(([, a], [, b]) => a.name.localeCompare(b.name));
}

/**
 * Returns the image source of the contact. If no image is present, a profile image is generated.
 * @param {object} contact - The contact object.
 * @returns {string} - The image source of the contact.
 */
function getImageSrc(contact) {
  return contact.img || generateProfileImage(contact.name);
}

/**
 * Capitalizes the first letter of a name.
 * @param {string} name - The contact's name.
 * @returns {string} - The name with the first letter capitalized.
 */
function capitalizeFirstLetter(name) {
  let words = name.split(" ");
  if (words.length >= 2) {
    return capitalizeSecondLetter(words);
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Capitalizes the first letter of each word in a name.
 * @param {Array<string>} words - An array of words to capitalize.
 * @returns {string} - The capitalized words as a single string.
 */
function capitalizeSecondLetter(words) {
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
