/**
 * Inserts a letter area (A, B, C) and a separator into the contact list.
 *
 * @param {HTMLElement} contactList - The element where the letter and separator will be inserted.
 * @param {string} letter - The letter to display.
 */
function renderLetterArea(contactList, letter) {
  contactList.innerHTML += `
    <div class="contactlist-order-letter d-flex fw-400 fs-20 self-baseline">${letter}</div>
    <div class="contactlist-seperator"></div>
  `;
}

/**
 * Inserts a single contact into the contact list.
 *
 * @param {HTMLElement} contactList - The element where the contact will be inserted.
 * @param {string} id - The ID of the contact object.
 * @param {Object} contact - The contact object.
 * @param {string} imageSrc - The source URL of the contact's image.
 */
function renderContactItem(contactList, id, contact, imageSrc) {
  contactList.innerHTML += `
    <div id="contactlist-item-${id}" class="contactlist-item bradius10 d-flex-center flex-d-row" onclick="selectContact('${id}')">
      <img class="d-flex pointer" src="${imageSrc}"/>
      <div class="contactlist-databox flex-d-col">
        <div class="pointer no-wrap-text fw-400 fs-20">${contact.name}</div>
        <p class="pointer fw-400 color-lb mg-block-inline fs-16 text-deco-n">${contact.mail}</p>
      </div>
    </div>
  `;
}

/**
 * Renders the header section of a contact in the detail view.
 *
 * @param {HTMLElement} contactSection - The element where the contact header will be inserted.
 * @param {Object} contact - The contact object.
 * @param {string} contactId - The ID of the contact object.
 */
function renderContactHead(contactSection, contact, contactId) {
  contactSection.innerHTML += `
    <div class="edit-contact-section animation-100">
      <div class="contact-information item-center d-flex">
        <img src="${contact.img || generateProfileImage(contact.name)}" class="d-flex gap-10 obj-cover bradius70"/>
        <div class="d-flex flex-d-col gap-8 item-start flex-grow">
          <p class="contact-name-edit mg-block-inline fw-500 no-wrap-text fs-47">${contact.name}</p>
          <div class="contact-section-btn-box fw-400 d-flex-between l-height-19">
            <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="showEditForm('${contactId}')" id="edit-btn">
              <img class="obj-cover img-24" src="public/img/edit.png">Edit
            </button>
            <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="deleteContact('${contactId}')" id="del-btn">
              <img class="obj-cover img-24" src="public/img/delete.png">Delete
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

/**
 * Renders the detailed information of a contact.
 *
 * @param {HTMLElement} contactSection - The element where the contact information will be inserted.
 * @param {Object} contact - The contact object.
 */
function renderContactInfo(contactSection, contact) {
  contactSection.innerHTML += `
    <div class="animation-100">
      <div id="contact-information-content" class="d-flex flex-d-col no-wrap-text">
        <p class="fw-400 l-height-24 fs-20 mg-block-inline">Contact Information</p>
        <div class="contact-information-data d-flex flex-d-col gap-22">
          <div class="d-flex flex-d-col gap-15 text-left">
            <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Email</b></p>
            <a class="pointer color-lb text-deco-n" href="mailto:${contact.mail}">${contact.mail}</a>
          </div>
          <div class="d-flex flex-d-col gap-15 text-left">
            <p class="fs-16 f-weight-700 no-wrap-text mg-block-inline l-height-19 txt-left"><b>Phone</b></p>
            <p class="fs-16 fw-400 no-wrap-text mg-block-inline l-height-19 txt-left">${contact.phone}</p>
          </div>
        </div>
      </div>
    </div>
    `;
}

/**
Generates a profile image with initials based on the contact's name.
@param {string} name - The name of the contact.
@returns {string} - A Base64-encoded SVG image or a URL to the existing image if initials unchanged.
*/
function generateProfileImage(name) {
  let colors = [
    "#FF5733", "#33FF57","#3357FF","#FF33A1","#33FFF3", "#4B0082", "#8B0000", "#006400", "#191970", "#2F4F4F", "#483D8B"];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  let initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const svgImage = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="${randomColor}" />
  <text x="50%" y="50%" dy=".3em" text-anchor="middle" font-size="32" fill="#FFF" font-family="Inter, sans-serif">${initials}</text>
</svg>`;
  return `data:image/svg+xml;base64,${btoa(svgImage)}`;
}

/**
 * Renders the Edit and Delete buttons inside the element with the class 'contact-section-btn-box-resp'.
 * 
 * @param {string} contactId - The unique ID of the contact used to associate the buttons with the correct contact.
 */
function renderContactButtons(contactId) {
  const contactSectionBtnBoxResp = document.querySelector('.contact-section-btn-box-resp');
  
  contactSectionBtnBoxResp.innerHTML =  `
    <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="showEditForm('${contactId}')" id="edit-btn">
      <img class="obj-cover img-24" src="public/img/edit.png">Edit
    </button>
    <button class="bg-color-tr txt-center gap-8 b-unset pointer d-flex-center flex-d-row fs-16" onclick="deleteContact('${contactId}')" id="del-btn">
      <img class="obj-cover img-24" src="public/img/delete.png">Delete
    </button>
  `;
}
