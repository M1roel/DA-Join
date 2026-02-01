/**
 * Closes the open task view and navigates back to the main board.
 *
 * @param {Event} event - The event object associated with the close action.
 * @param {number} index - The index of the task.
 */
function closeOpenTask(event, indexHTML) {
  event.stopPropagation();
  let openPosition = document.getElementById("openTask");
  openPosition.classList.remove("modal-overlay");
  openPosition.style.animation = "moveOut 200ms ease-out forwards";
  setTimeout(() => {
    openPosition.classList.add("hidden", "d-none");
    openPosition.style.cssText =
      "visibility: hidden; transform: translateX(100vw)";
  }, 100);

}


/**
 * Deletes a specific task from Firebase and updates the board view.
 *
 * @param {number} indexHTML - The index of the task in the HTML.
 * @async
 */
async function deleteTask(indexHTML) {
  for (let i = 0; i < taskkeysGlobal.length; i++) {
    const element = taskkeysGlobal[i];
    let key = element[indexHTML];
    await deleteOnFirebase(key);
  }
  changeSite("board.html");
}


/**
 * Deletes a task from Firebase using its unique key.
 *
 * @param {string} taskkey - The unique key of the task to delete.
 * @async
 */
async function deleteOnFirebase(taskkey) {
  try {
    await fetch(`${BASE_URL}/tasks/${taskkey}.json`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting task in Firebase:", error);
  }
}


/**
 * Enables the Enter key to trigger the edit button click.
 */
function enableEnterKeyEdit(index) {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      let activeElement = document.activeElement;
      let subtaskInputEdit = document.getElementById(`subtasksEdit${index}`);

      if (activeElement === subtaskInputEdit) {
        addSubtaskEdit(index);
      }
    }
  });
}


/**
 * Verarbeitet das Absenden des Formulars, aktualisiert die Taskdaten und speichert sie in Firebase.
 *
 * @param {Event} event - Das Ereignis des Formularabsendens.
 * @param {number} index - Der Index der Aufgabe, die bearbeitet wird.
 * @param {string} category - Die Kategorie der Aufgabe.
 */
function handleFormSubmitEdit(event, index, category) {
  event.preventDefault();
  if (isSaving || !event.target.checkValidity() || !selectedPrioEdit) {
    if (!selectedPrioEdit) alert("Bitte wähle eine Priorität aus.");
    event.target.reportValidity();
    return;
  }
  isSaving = true;
  updateTaskBoard(index, category)
    .catch(error => console.error("Fehler beim Speichern der Aufgabe:", error))
    .finally(() => isSaving = false);
    imageUrlBoard = [];
    userNamesBoard= [];
}


/**
 * Closes the task edit modal and resets the form state.
 * 
 * @param {Event} event - The event object.
 * @param {number} index - The index of the task being edited.
 */
function closeOpenTaskEdit(event, index) {
  event.stopPropagation();
  let openPosition = document.getElementById("openTask");
  openPosition.classList.remove("modal-overlay");
  openPosition.classList.add("d-none");
  openPosition.innerHTML = "";
  resetFormStateEdit();
  upstreamHTMLrender();
}


/**
 * Renders the details of a task in a modal overlay on the board, displaying various task attributes.
 * 
 * @param {number} index - The index of the task to be opened.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The board category to which the task belongs.
 * @param {Array<number>} assignedTo - An array of user indices assigned to the task.
 * @param {Array<string>} subtasks - An array of subtasks related to the task.
 * @param {Array<boolean>} subtaskStatus - An array representing the completion status of each subtask.
 */
function openTaskToBoardRender(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
  opentaskIndex = index;
  let position = document.getElementById("openTask");
  if (position.classList.contains("modal-overlay")) {
    return;
  } else {
    position.classList.add("modal-overlay");
    position.classList.remove("d-none", "hidden");
    position.style.cssText = "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
    position.innerHTML = openTaskToBoardHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus);
    CategoryColorOpen(index, category);
    searchIndexUrlOpen(index, assignedTo);
    searchprioBoardOpen(index, prio);
    subtasksRenderOpen(index, subtasks);
    loadSubtaskStatus(index, subtaskStatus);
  }
}


/**
 * Displays the priority icon for a task in the open task view based on the given priority level.
 * 
 * @param {number} index - The index of the task for which to display the priority.
 * @param {string} prio - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 */
function searchprioBoardOpen(index, prio) {
  let position = document.getElementById(`prioPositionOpenTask${index}`);
  position.innerHTML = "";
  if (prio == "Urgent") {
    position.innerHTML = `<img  src="public/img/Prio alta.png" alt="">`;
  } else {
    if (prio == "Medium") {
      position.innerHTML = `<img  src="public/img/prioOrange.png" alt="">`;
    } else {
      if (prio == "Low") {
        position.innerHTML = `<img src="public/img/Prio baja.png" alt="">`;
      }
    }
  }
}


/**
 * Displays user images and names for a specific task in the open task view based on the assigned users.
 * 
 * @param {number} index - The index of the task for which to display assigned user information.
 * @param {string} assignedTo - A comma-separated string of user IDs assigned to the task.
 */
function searchIndexUrlOpen(index, assignedTo) {
  if(assignedTo == 'undefined'){
   return
  }
   let assignedToArray = assignedTo.split(',').map(assignedTo => assignedTo.trim());
   assignedToUserArrayOpen.push(assignedToArray);
   let position = document.getElementById(`userImageBoardOpen${index}`);
   position.innerHTML = "";
   for (let i = 0; i < assignedToArray.length; i++) {
     const element = assignedToArray[i];
     const images = imageUrlBoard[element];
     const names = userNamesBoard[element]
     position.innerHTML +=  htmlBoardImageOpen(images,names, i);
   }
   assignedToArray = [];
   assignedToUserArrayOpen = [];
 }


 /**
 * Generates HTML for displaying a user's image and name in the open task view.
 * 
 * @param {string} images - The URL of the user's image.
 * @param {string} names - The name of the user.
 * @param {number} i - The index of the user in the assigned list.
 * @returns {string} - The HTML string for the user's image and name.
 */
function htmlBoardImageOpen(images,names, i) {
  return `
    <div class="d-flex pa-7-16">
      <img class="user-image-task-open" src="${images}">
      <div class="d-flex item-center font-sf fs-19 fw-400">${names}</div>
    </div>`;
}


/**
 * Renders the subtasks for a specific task in the open task view.
 * 
 * @param {number} indexHtml - The index of the task for which to render subtasks.
 * @param {string} subtasks - A comma-separated string of subtasks associated with the task.
 */
function subtasksRenderOpen(indexHtml, subtasks) {
  if(subtasks == 'undefined'){
    return
  }
  let subtasksArray = subtasks.split(',').map(subtask => subtask.trim());
  subtasksOpenArray.push(subtasksArray);
  let position = document.getElementById(`subtasksBoardOpen${indexHtml}`);
  position.innerHTML = "";
  for (let i = 0; i < subtasksArray.length; i++) {
      const element = subtasksArray[i];
      position.innerHTML += subtasksRenderOpenHtml(indexHtml, i, element);
  }
  subtasksOpenArray = [];
}


/**
 * Saves the status of a subtask to Firebase.
 * 
 * @param {boolean} isChecked - The checked status of the subtask.
 * @param {number} indexHtml - The index of the task in the global task keys.
 * @param {number} index - The index of the subtask.
 */
function subtasksRenderOpenHtml(indexHtml, index, element) {
  return `
    <div class="d-flex item-center pa-7-16">
      <input onclick="subtaskStatus('${indexHtml}','${index}')" class="checkbox-open-Task pointer" type="checkbox" id="subtask-${indexHtml}-${index}">
      <label for="subtask-${indexHtml}-${index}">${element}</label>
    </div>`;
}


/**
 * Sets the background color of the category element based on the category type.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 */
function CategoryColorOpen(index, category) {
  let position = document.getElementById(`categoryColorOpen${index}`);
  if (category == "Technical Task") {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}


/**
 * Closes the task modal when the modal overlay is clicked.
 * 
 * @param {Event} event - The click event that triggered the function.
 */
function oneClickClose(event) {
  let openPosition = document.getElementById("openTask");
  if (event.target.classList.contains("modal-overlay")) {
    openPosition.classList.remove("modal-overlay");
    openPosition.style.animation = "moveOut 200ms ease-out forwards";
    setTimeout(() => {
      openPosition.classList.add("hidden", "d-none");
      openPosition.style.cssText =
        "visibility: hidden; transform: translateX(100vw)";
    }, 100);
    resetFormStateEdit();
  }
  upstreamHTMLrender();
}


/**
 * Generates HTML for displaying an open task on the board.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority level of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The category for the board.
 * @param {string} assignedTo - A comma-separated list of users assigned to the task.
 * @param {string} subtasks - A comma-separated list of subtasks.
 * @param {string} subtaskStatus - A comma-separated list of subtask statuses.
 * 
 * @returns {string} The generated HTML markup for the open task.
 */
function openTaskToBoardHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
  return `
    <div class="board-task-container-open bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
        <div class="task-responsive width445">  
          <div class="d-flex-between margin-bt8">
              <h1 id="categoryColorOpen${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
              <img onclick="closeOpenTask(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="public/img/Close.png">
          </div>
          <div class="margin-bt8">
                <h2 class="task-title mg-block-none fw-700 fs-61">${title}</h2>
          </div>
          <div class="margin-bt8">  
              <p class="description-open-task fs-20 fw-400 mg-block-none">${description}</p>
          </div> 
          <div class="d-flex item-center mg-btt25" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
              <p class="d-flex item-center fs-20 fw-400 mg-block-none margin-left-open-task">${dueDate}</p>
          </div>
          <div class="d-flex item-center mg-btt25" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Priority:</p>
              <span class="d-flex item-center fs-16 fw-400 margin-left-open-task">${prio}</span>
              <div class="prio-board-image-container d-flex-center" id="prioPositionOpenTask${index}">
              </div>
          </div>
          <div class="mg-btt25">
              <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-none">Assigned To:</p>
          </div>
          <div class="d-flex mg-btt25 assignedToScroll">
              <div class="user-image-bord-container-open" id="userImageBoardOpen${index}">
              </div>
          </div>
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>    
              <div class="subtask-scrollbar" id="subtasksBoardOpen${index}"></div>
          <div class="d-flex-end">
            <div class="d-flex item-center">
              <div onclick="deleteTask(${index})" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="public/img/deleteOpenTask.png"><p class="fs-16 mg-block-none">Delete</p></div>
              <div class="seperator-opentask"></div>
              <div onclick="EditTaskToBoardRender('${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}' , '${assignedTo}', '${subtasks}', '${subtaskStatus}')" class="d-flex item-center pointer"><img class="open-task-delete-edit img" src="public/img/editOpenTask.png"><p class="fs-16 mg-block-none">Edit</p></div>
            </div>
          </div>
        </div>  
    </div>`;
};