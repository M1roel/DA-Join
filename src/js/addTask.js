let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";
let subtasksArray = [];
let subtasksStatusArray = [];
let prioArray = [];
let addTaskArray = [];
let expanded = false;
let isValid = true
let assignedToUserArray = [];
let assignedToUserArrayNamesGlobal = [];
let imageUrlsGlobal = [];
let selectedPrio = null;
let expandedBody = false;

/**
 * Initializes the task form by fetching data from Firebase and setting up the "Assigned To" dropdown.
 * @returns {Promise<void>}
 */
async function init() {
  try {
    let fireBaseData = await onloadData("/");
    let contacts = await fetchContacts(fireBaseData);
    let imageUrls = await fetchImages();
    await assignedTo(contacts, imageUrls);
    prio(2);
    setTodayDateAddTask()

  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

/**
 * Fetches contact images from Firebase and returns an array of image URLs.
 * @returns {Promise<string>} - A promise that resolves to an array of image URLs.
 */
async function fetchImages() {
  try {
    let fireBaseData = await onloadData("/");
    let contacts = fireBaseData.contacts;
    let imageUrls = Object.values(contacts).map((contact) => contact.img);
    return imageUrls;
  } catch (error) {
    console.error("Error fetching images", error);
  }
}

/**
 * Fetches JSON data from Firebase at the given path.
 * @param {string} [path=""] - The path to fetch data from.
 * @returns {Promise<object>} - A promise that resolves to the JSON response.
 */
async function onloadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * Extracts and returns the contacts object from the JSON response.
 * @param {object} responseToJson - The JSON response from Firebase.
 * @returns {object} - The contacts object extracted from the response.
 */
async function fetchContacts(responseToJson) {
  let contacts = responseToJson.contacts;
  return contacts;
}

/**
 * Extracts names from contacts and initializes the checkboxes for assigning users to tasks.
 * @param {object} contacts - The contacts object.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 * @returns {Promise<void>}
 */
async function assignedTo(contacts, imageUrls) {
  try {
    const extractNames = (contacts) => {
      return Object.values(contacts).map((entry) => ({ name: entry.name }));
    };
    const names = extractNames(contacts);
    await checkboxInit(names, imageUrls);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Renders checkboxes with contact images and names for assigning users to tasks.
 * @param {object[]} names - An array of contact names.
 * @param {string[]} imageUrls - An array of image URLs for the contacts.
 */
async function checkboxInit(names, imageUrls) {
  let position = document.getElementById("checkboxes");
  position.innerHTML = "";

  let list = "";
  for (let index = 0; index < names.length; index++) {
    const element = names[index].name;
    const imgSrc = imageUrls[index];
    list += checkBoxRender(index, imgSrc, element);
  }
  position.innerHTML = list;
}

/**
 * Returns a string of HTML to render a checkbox with an image and name.
 * @param {number} index - The index of the checkbox.
 * @param {string} imgSrc - The URL of the image.
 * @param {string} element - The name associated with the checkbox.
 * @returns {string} - The HTML string for the checkbox.
 */
function checkBoxRender(index, imgSrc, element) {
  return `
    <label class="checkBoxFlex" for="checkbox-${index}" id="checkboxColor${index}">
        <div class="checkBoximg">
            <img id="assignedToUserImageBorder${index}" src="${imgSrc}" alt="" />
            ${element}
        </div>
        <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox-${index}" value="${element}" onclick="assignedToUser('${index}','${element}','${imgSrc}')" />
    </label>`;
}

/**
 * Updates the arrays that store the indices and names of users assigned to the task.
 * @param {number} index - The index of the user.
 * @param {string} element - The name of the user.
 */
  async function assignedToUser(index, element, imgSrc) {
    const image = imageUrlsGlobal[index];
    const arrayIndex = assignedToUserArray.indexOf(index);
    if (arrayIndex !== -1) {
      assignedToUserArray.splice(arrayIndex, 1);
      assignedToUserArrayNamesGlobal.splice(arrayIndex, 1);
      imageUrlsGlobal.splice(arrayIndex, 1);
      assignedtoUserHighlightRemove(index);
    } else {
      assignedToUserArray.push(index);
      assignedToUserArrayNamesGlobal.push(element);
      imageUrlsGlobal.push(imgSrc);
      assignedtoUserHighlightAdd(index);
    }
  }

/**
 * Adds highlight to the user's assigned checkbox and image.
 * 
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightAdd(index) {
  let position = document.getElementById(`checkboxColor${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorder${index}`)
  positionOfImage.classList.add('assignedToUserImage');
  position.style.backgroundColor = '#2a3647';
  position.style.color = '#ffffff';
}

/**
 * Removes highlight from the user's assigned checkbox and image.
 * 
 * @param {number} index - The index of the user element.
 */
function assignedtoUserHighlightRemove(index) {
  let position = document.getElementById(`checkboxColor${index}`);
  let positionOfImage = document.getElementById(`assignedToUserImageBorder${index}`)
  positionOfImage.classList.remove('assignedToUserImage');
  position.style.backgroundColor = '#ffffff';
  position.style.color = '#2a3647';
}

/**
 * Toggles the visibility of the checkbox dropdown.
 */
function showCheckboxes(event) {
  let checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
    checkboxClickHandler();
  }
  event.stopPropagation();
}

/**
 * Attaches the document click handler to handle clicks outside the checkboxes.
 */
function checkboxClickHandler() {
  document.onclick = handleAddTaskClick;
}

/**
 * Handles document click events to toggle the visibility of the checkboxes.
 * 
 * @param {Event} event - The click event to handle.
 */
function handleAddTaskClick(event) {
  let checkboxes = document.getElementById("checkboxes");

  if (expanded && !document.querySelector('.multiselect').contains(event.target)) {
    checkboxes.style.display = "none";
    expanded = false;
    showUserAdd();
  }
}

/**
 * Updates the user interface to show selected users in the dropdown.
 */
function showUserAdd() {
  let position = document.getElementById('userImageShow');
  position.innerHTML = '';
  for (let index = 0; index < imageUrlsGlobal.length; index++) {
    const element = imageUrlsGlobal[index];
    if (index > 3) {
      const remaining = imageUrlsGlobal.length - 4;
      position.innerHTML += `
        <div class="img-48 more-users">
          +${remaining}
        </div>`;
      break;
    }
    position.innerHTML += `<img class="img-48" src="${element}" alt="" />`;
  }
}

/**
 * Handles the submission of the task form, including validation and saving the task data to Firebase.
 * @param {Event} event - The form submit event.
 * @returns {Promise<void>}
 */
async function createTask(event) {
  event.preventDefault();
  if (!validateFormAddTask(event.target)) return;
  if (!validatePriorityAddTask()) return;
  await defineTaskObjects();
  await saveToFirebase();
  resetUIAddTask(event.target);
  changeSite("board.html");
}

/**
 * Validates the task form before submission.
 * 
 * @param {HTMLFormElement} form - The form element to validate.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
function validateFormAddTask(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

/**
 * Checks if a priority has been selected before submitting the form.
 * 
 * @returns {boolean} - Returns true if a priority is selected, false otherwise.
 */
function validatePriorityAddTask() {
  if (!selectedPrio) {
    alert("Please select a priority before submitting the form.");
    return false;
  }
  return true;
}

/**
 * Resets the task form and UI elements.
 * 
 * @param {HTMLFormElement} form - The form element to reset.
 */
function resetUIAddTask(form) {
  form.reset();
  resetFormStateAddTask();
  let subtasksPosition = document.getElementById("subtasksPosition");
  if (subtasksPosition) {
    subtasksPosition.innerHTML = "";
  }
}

/**
 * Handles the "Enter" key press event to submit subtasks or a form.
 * @param {KeyboardEvent} event - The keyboard event object representing the "Enter" key press.
 */
function checkEnterSubtasks(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let activeElement = document.activeElement;
    let subtaskInput = document.getElementById('subtasks');
    if (activeElement === subtaskInput) {
      addSubtask();
    }
  }
}

/**
 * Resets the internal state of the form and clears stored data.
 */
function resetFormStateAddTask() {
  addTaskArray = [];
  subtasksArray = [];
  assignedToUserArray = [];
  assignedToUserArrayNamesGlobal = [];
  selectedPrio = null;
  imageUrlsGlobal = [];
  subtasksArray = [];
  clearSubtasks();
}

/**
 * Gathers data from the form fields and prepares the task object to be saved.
 */
async function defineTaskObjects() {
  let taskTitle = document.getElementById("title").value;
  let taskDescription = document.getElementById("description").value;
  let dueDateTask = document.getElementById("dueDate").value;
  let taskCategory = document.getElementById("taskCategory").value;
  let lastString = prioArray.pop();
  pushTaskObjectsToArray(taskTitle, taskDescription, dueDateTask, taskCategory, lastString);
}

/**
 * Pushes the task object to the array that will be saved to Firebase.
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} dueDateTask - The due date of the task.
 * @param {string} taskCategory - The category of the task.
 * @param {string} lastString - The priority of the task.
 */
function pushTaskObjectsToArray(taskTitle, taskDescription, dueDateTask, taskCategory, lastString) {
  addTaskArray.push({
    title: taskTitle,
    description: taskDescription,
    assignedTo: assignedToUserArray,
    assignedToNames: assignedToUserArrayNamesGlobal,
    dueDate: dueDateTask,
    prio: lastString,
    category: taskCategory,
    subtasks: subtasksArray,
    subtaskStatus: subtasksStatusArray,
    boardCategory: "todo",
  });
}

/**
 * Saves the task data to Firebase.
 * @param {string} [path="/tasks"] - The path where the data will be saved in Firebase.
 * @returns {Promise<void>}
 */
async function saveToFirebase(path = "/tasks") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addTaskArray),
  });
}

/**
 * Handles the selection of a priority level and updates the button styles.
 * @param {number} id - The ID of the selected priority button.
 */
function prio(id) {
  const buttons = document.querySelectorAll(".add-task-prio-button-container button");

  buttons.forEach((button) => {
    button.classList.remove("add-task-prio-button-urgent", "add-task-prio-button-medium", "add-task-prio-button-low");
    button.classList.add("add-task-prio-button");
  });
  let position = document.getElementById(`prioButton${id}`);
  prioIdCheck(id, position);
  selectedPrio = id;
}

/**
 * Updates the priority array and button styles based on the selected priority.
 * @param {number} id - The ID of the selected priority button.
 * @param {HTMLElement} position - The HTML element of the selected button.
 */
function prioIdCheck(id, position) {
  if (id == 1) {
    prioArray.push("Urgent");
    position.classList.add("add-task-prio-button-urgent");
  } else if (id == 2) {
    prioArray.push("Medium");
    position.classList.add("add-task-prio-button-medium");
  } else if (id == 3) {
    prioArray.push("Low");
    position.classList.add("add-task-prio-button-low");
  }
  position.classList.remove("add-task-prio-button");
}

/**
 * Adds a subtask to the subtask array and updates the displayed list.
 */
function clearAddTask() {
  document.getElementById("title").value = '';
  document.getElementById("description").value = '';
  document.getElementById("dueDate").value = '';
  document.getElementById("taskCategory").value = '';
  document.getElementById("subtasksPosition").innerHTML = '';
  document.getElementById("subtasks").innerHTML = '';
  assignedToUserArray = [];
  assignedToUserArrayNamesGlobal = [];
  imageUrlsGlobal = [];
  subtasksArray = [];
  document.getElementById('userImageShow').innerHTML = '';
  init();
}

/**
 * Sets the minimum, maximum, and default values for the due date input.
 */
function setTodayDateAddTask() {
  const dateInput = document.getElementById('dueDate');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const maxDate = nextYear.toISOString().split('T')[0];
  dateInput.setAttribute('max', maxDate);
  if (!dateInput.value) {
    dateInput.value = today;
  }
}