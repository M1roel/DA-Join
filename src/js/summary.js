var database = firebase.database();
var tasksRef = database.ref("tasks");
var contactsRef = database.ref("contacts");

function initSmry() {
  loadTasksAndCountCategories();
  loadTasksAndUpdateUrgentCount();
  loadTasksAndFindClosestDueDate();
  summaryGreeting();
  summaryGreetingResp();
  addClassAfterDelay();
  
}

/**
 * Displays a personalized greeting based on the time of day and the user's status.
 * @async
 * @function
 */
async function summaryGreeting() {
  const hour = new Date().getHours();
  const greetingElement = document.querySelector(".summary-user-greeting");
  const greetingElementName = document.querySelector(".summary-user-greeting-name");
  const userImageElement = document.querySelector(".user-icon");
  const user = localStorage.getItem("user");
  if (greetingElement) {
    if (user === "Guest") {
      greetingGuest(hour, greetingElement, user, userImageElement);
    } else {
      await greetingUser(hour, greetingElement, greetingElementName);
    }
  }
}

/**
 * Displays a personalized greeting message based on the current hour and the user's status.
 * The function also updates the greeting elements in the DOM with the appropriate message and user image.
 */
async function summaryGreetingResp() {
  const hour = new Date().getHours();
  const greetingElement = document.querySelector(".summary-user-greeting-resp");
  const greetingElementName = document.querySelector(".summary-user-greeting-name-resp");
  const userImageElement = document.querySelector(".user-icon");
  const user = localStorage.getItem("user");
  if (greetingElement) {
    if (user === "Guest") {
      greetingGuest(hour, greetingElement, user, userImageElement);
    } else {
      await greetingUser(hour, greetingElement, greetingElementName);
    }
  }
}

/**
 * Generates a greeting for a logged-in user based on the time of day.
 * Handles errors during the authentication check and greeting process.
 * @async
 * @function
 * @param {number} hour - The current hour of the day.
 * @param {HTMLElement} greetingElement - The HTML element to display the greeting.
 * @param {HTMLElement} greetingElementName - The HTML element to display the user's name.
 * @throws {Error} Throws an error if there is an issue during the authentication check or greeting.
 */
async function greetingUser(hour, greetingElement, greetingElementName) {
  let greetingMessage = "";
  if (hour > 6 && hour < 12) {
    greetingMessage = "Good morning,";
  } else if (hour >= 12 && hour < 18) {
    greetingMessage = "Good afternoon,";
  } else {
    greetingMessage = "Good evening,";
  }
  try {
    await checkAuthAndGreet(greetingMessage, greetingElement, greetingElementName);
  } catch (error) {
    console.error("Error during authentication check and greeting:", error);
  }
}

/**
 * Generates a greeting for a guest user based on the time of day.
 * @function
 * @param {number} hour - The current hour of the day.
 * @param {HTMLElement} greetingElement - The HTML element to display the greeting.
 * @param {string} user - The name of the guest user.
 * @param {HTMLElement} userimgElement - The img element to display the profile image.
 */
function greetingGuest(hour, greetingElement, user, userimgElement) {
  let greetingMessage = "";
  if (hour > 6 && hour < 12) {
    greetingMessage = "Good morning";
  } else if (hour >= 12 && hour < 18) {
    greetingMessage = "Good afternoon";
  } else {
    greetingMessage = "Good evening";
  }

  greetingElement.textContent = greetingMessage;

  let userImage = generateProfileImage(user);
  userimgElement.src = userImage;
}

/**
 * Function to retrieve user data from the 'users' reference.
 * @param {string} userId - The unique ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the user data object.
 */
async function getUserData(userId) {
  const userSnapshot = await database.ref("users/" + userId).once("value");
  return userSnapshot.val();
}

/**
 * Function to set the username in the greeting element.
 * @param {string} greetingMessage - The greeting message to display.
 * @param {Object} userData - The data object containing user information.
 * @param {HTMLElement} greetingElement - The HTML element for the greeting message.
 * @param {HTMLElement} greetingElementName - The HTML element for displaying the user's name.
 */
function setGreeting(greetingMessage, userData, greetingElement, greetingElementName, greetingElementNameResp) {
  if (userData && userData.name) {
    greetingElement.textContent = greetingMessage;
    greetingElementName.textContent = userData.name;
    if (greetingElementNameResp) {
      greetingElementNameResp.textContent = userData.name;
    }
  } else {
    greetingElement.textContent = greetingMessage;
  }
}

/**
 * Function to retrieve contact data based on the email address.
 * @param {string} email - The email address to search for.
 * @returns {Promise<Object>} A promise that resolves to the contact data object.
 */
async function getContactDataByEmail(email) {
  const contactSnapshot = await contactsRef.orderByChild("mail").equalTo(email).once("value");
  return contactSnapshot.val();
}

/**
 * Function to set the profile image.
 * @param {Object} contactData - The data object containing contact information.
 * @param {string} userId - The unique ID of the user.
 * @param {HTMLImageElement} imgElement - The HTML image element where the profile image will be displayed.
 */
function setProfileImage(contactData, userId, imgElement) {
  if (contactData) {
    const contactKey = Object.keys(contactData)[0];
    const contactInfo = contactData[contactKey];
    if (contactInfo.img) {
      imgElement.src = contactInfo.img;
    } else {
      imgElement.src = generateProfileImage(userId);
    }
  } else {
    imgElement.src = generateProfileImage(userId);
  }
}

/**
 * Main function to check authentication and set greeting.
 * @param {string} greetingMessage - The greeting message to display.
 * @param {HTMLElement} greetingElement - The HTML element for the greeting message.
 * @param {HTMLElement} greetingElementName - The HTML element for displaying the user's name.
 */
async function checkAuthAndGreet(greetingMessage, greetingElement, greetingElementName) {
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;
    try {
      const userData = await getUserData(userId);
      const greetingElementNameResp = document.querySelector(".summary-user-greeting-name-resp"); 
      setGreeting(greetingMessage, userData, greetingElement, greetingElementName, greetingElementNameResp);
      const contactData = await getContactDataByEmail(userData.mail);
      const imgElement = document.querySelector(".user-icon");
      setProfileImage(contactData, userId, imgElement);
    } catch (error) {
      console.error("Error retrieving user data or profile image:", error);
      greetingElement.textContent = greetingMessage;
    }
  } else {
    greetingElement.textContent = greetingMessage;
  }
}


/**
 * Loads tasks from the database using the older Firebase SDK.
 * @async
 * @function
 * @returns {Promise<Object>} The task data.
 */
async function loadTasks() {
  try {
    const taskSnapshot = await tasksRef.once("value");
    const taskData = taskSnapshot.val();
    return taskData || {};
  } catch (error) {
    console.error("Error loading task data", error);
    return {};
  }
}

/**
 * Counts tasks in different categories by utilizing a helper function to iterate through tasks.
 * @function
 * @param {Object} taskData - The task data loaded from the database.
 * @returns {Object} An object containing the count of tasks in each category.
 * @see iterateTasks
 */
function countTasks(taskData) {
  const categoryCounts = {
    todo: 0,
    done: 0,
    progress: 0,
    feedback: 0,
  };
  iterateTasks(taskData, categoryCounts);
  return categoryCounts;
}

/**
 * Iterates over tasks and updates the counts for each category.
 * This function is used as a helper for the `countTasks` function.
 * @function
 * @param {Object} taskData - The task data loaded from the database.
 * @param {Object} categoryCounts - An object to store the count of tasks in each category.
 */
function iterateTasks(taskData, categoryCounts) {
  for (const taskId in taskData) {
    if (taskData.hasOwnProperty(taskId)) {
      const tasks = taskData[taskId];
      tasks.forEach((task) => {
        if (task.boardCategory && categoryCounts.hasOwnProperty(task.boardCategory)) {
          categoryCounts[task.boardCategory]++;
        }
      });
    }
  }
}

/**
 * Loads tasks and counts the number of tasks in each category.
 * @async
 * @function
 */
async function loadTasksAndCountCategories() {
  try {
    const taskData = await loadTasks();
    const categoryCounts = countTasks(taskData);
    updateCategoryCounts(categoryCounts);
  } catch (error) {
    console.error("Error loading tasks and counting categories:", error);
  }
}

/**
 * Updates the UI with the counts of tasks in each category.
 * @function
 * @param {Object} counts - An object containing the count of tasks in each category.
 */
function updateCategoryCounts(counts) {
  document.getElementById("smry-to-do-val").innerText = counts.todo || 0;
  document.getElementById("smry-done-val").innerText = counts.done || 0;
  document.getElementById("smry-progress-val").innerText = counts.progress || 0;
  document.getElementById("smry-feedback-val").innerText = counts.feedback || 0;
  const totalTasks = (counts.todo || 0) + (counts.done || 0) + (counts.progress || 0) + (counts.feedback || 0);
  document.getElementById("smry-board-val").innerText = totalTasks;
}

/**
 * Formats a given date string (YYYY-MM-DD) into German date format (DD. Month YYYY).
 * @param {string} dateStr - The date string in YYYY-MM-DD format.
 * @returns {string} The formatted date string in DD. Month YYYY format.
 */
function formatDateGerman(dateStr) {
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const [year, month, day] = dateStr.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)}. ${months[monthIndex]} ${year}`;
}

/**
 * Finds the closest due date among tasks with priority 'Urgent' that are not in the 'done' category.
 * Also counts the number of such tasks with the closest due date.
 *
 * @param {Object} taskData - The task data loaded from the database.
 * @returns {Object} An object with the closest due date (formatted) and the count of tasks with that due date.
 */
function findClosestDueDate(taskData) {
  const now = new Date();
  let closestDate = null;
  let minDiff = Infinity;
  let taskCount = 0;
  for (const taskId in taskData) {
    if (taskData.hasOwnProperty(taskId)) {
      const tasks = taskData[taskId];
      tasks.forEach((task) => {
        if (task.prio === "Urgent" && task.boardCategory !== "done" && task.dueDate) {
          const taskDate = new Date(task.dueDate);
          const diff = Math.abs(taskDate - now);

          if (diff < minDiff) {
            minDiff = diff;
            closestDate = task.dueDate;
          }
        }
      });
    }
  }
  if (closestDate) {
    taskCount = countTasksWithDueDate(taskData, closestDate);
  }
  return {
    dueDate: closestDate ? formatDateGerman(closestDate) : "No upcoming<br>urgent tasks",
    count: taskCount,
  };
}

/**
 * Counts the number of tasks with priority 'Urgent' and a specific due date, excluding those in the 'done' category.
 *
 * @param {Object} taskData - The task data loaded from the database.
 * @param {string} dueDate - The due date to count tasks for.
 * @returns {number} The number of matching tasks.
 */
function countTasksWithDueDate(taskData, dueDate) {
  let count = 0;
  for (const taskId in taskData) {
    if (taskData.hasOwnProperty(taskId)) {
      const tasks = taskData[taskId];

      tasks.forEach((task) => {
        if (task.prio === "Urgent" && task.boardCategory !== "done" && task.dueDate === dueDate) {
          count++;
        }
      });
    }
  }
  return count;
}

/**
 * Loads tasks and finds the closest due date along with the count of tasks.
 * Updates the span element with the count of tasks with the closest due date.
 * @async
 * @function
 */
async function loadTasksAndUpdateUrgentCount() {
  try {
    const taskData = await loadTasks();
    const result = findClosestDueDate(taskData);

    const urgentSpan = document.getElementById("smry-urgent-val");
    if (urgentSpan) {
      urgentSpan.innerText = result.count;
    } else {
      console.error("Urgent span element not found.");
    }
  } catch (error) {
    console.error("Error loading tasks and updating urgent count:", error);
  }
}

/**
 * Loads tasks and finds the closest due date.
 * @async
 * @function
 */
async function loadTasksAndFindClosestDueDate() {
  try {
    const taskData = await loadTasks();
    const closestDueDate = findClosestDueDate(taskData);

    const dateSpan = document.querySelector(".summary-tasks-mid-right-date");
    if (dateSpan) {
      dateSpan.innerHTML = closestDueDate.dueDate;
    } else {
      console.error("Date span element not found.");
    }
  } catch (error) {
    console.error("Error loading tasks and finding closest due date:", error);
  }
}

/**
 * Adds the class `d-none` to the element with class `greet-responsive` after a 2-second delay,
 * unless it has already been added. 
 *
 * The function checks `localStorage` to determine if the class has been added before. 
 * If not, it waits 2 seconds to add the class and sets a flag in `localStorage`.
 * If the class is already added, it applies `d-none` immediately.
 */
function addClassAfterDelay() {
  const element = document.querySelector(".greet-responsive");
  if (element) {
    if (!localStorage.getItem("classAdded")) {
      setTimeout(() => {
        element.classList.add("d-none");
        localStorage.setItem("classAdded", "true");
      }, 2000);
    } else {
      element.classList.add("d-none");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSmry();
});
