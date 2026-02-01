/**
 * Generates HTML for a checkbox with an associated label and image.
 *
 * @param {number} index - The index used to uniquely identify the checkbox.
 * @param {string} names - The name to be displayed next to the checkbox.
 * @param {string} urls - The URL of the image to be displayed next to the name.
 *
 * @returns {string} - The generated HTML string for the checkbox element.
 */
function showSubtaskControlsEdit(index, subtasks) {
    if (subtasks === undefined) {
        if(arrayForSubtasks === undefined){
            return
        }else{
        subtasks = arrayForSubtasks.join(',');
    }}
    document.getElementById(`subtasksEdit${index}`).classList.remove('add-task-input-edit');
    document.getElementById(`subtasksEdit${index}`).classList.add('subtasks-input-edit');
    
    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML = `<button onclick="resetSubtaskInputEdit('${index}','${subtasks}')" type="button" class="subtask-button-edit">
                                <img src="public/img/closeAddTask.png" alt="Reset">
                            </button>
                            <div class="seperator-subtasks"></div>
                            <button onclick="addSubtaskEdit('${index}','${subtasks}')" type="button" class="subtask-button-edit">
                                <img src="public/img/checkAddTask.png" alt="Add">
                            </button>`;
}


/**
 * Enables editing mode for a subtask and renders the corresponding input field.
 *
 * @param {number} i - The index of the subtask to be edited.
 * @param {number} indexHTML - The index used to identify the specific HTML element.
 * @param {string} subtask - The subtask content.
 * @param {string} subtasksEditArrayOrigin - A comma-separated list of original subtasks.
 * 
 * @returns {void}
 */
function editSubtaskEdit(i, indexHTML, subtask, subtasksEditArrayOrigin) {
    if (isEditingSubtask) {
        return;
    }
    isEditingSubtask = true;
    let position = document.getElementById(`supplementarySubtaskEdit${i}`);
    position.classList.remove('subtasks-edit');
    position.classList.add('subtasks-edit-input');
    let arrayForSubtasks = subtasksEditArrayOrigin.split(',')
        .map(subtask => subtask.trim())
        .filter(subtask => subtask !== 'undefined' && subtask !== "");
    let arrayPosition = arrayForSubtasks[i];
    position.innerHTML = editSubtaskHTMLEdit(i, indexHTML, subtask, subtasksEditArrayOrigin, arrayPosition);
} 


/**
 * Renders an editable input field for a subtask with options to delete or finish editing.
 *
 * @param {number} i - The index of the subtask being edited.
 * @param {number} indexHTML - The index of the HTML element related to the main task.
 * @param {string} subtask - The current value of the subtask that is being edited.
 * @param {string} subtasksEditArrayOrigin - The original array of subtasks used for reference.
 */
function editSubtaskHTMLEdit(i, indexHTML, subtask, subtasksEditArrayOrigin, arrayPosition) {
   return`
        <input id="inputEditSubtasks${i}" class="inputAddTaskSubtasks fs-16" value="${arrayPosition}" >
        <div class="d-flex item-center">
            <img class="img-24 pointer p-4" onclick="deleteSubtaskEdit('${i}','${indexHTML}', '${subtasksEditArrayOrigin}')" src="public/img/delete.png">
            <div class="seperator-subtasks"></div>
            <img class="img-24 pointer p-4" onclick="validateAndFinishEdit('${i}','${indexHTML}', '${subtasksEditArrayOrigin}')" src="public/img/checkAddTask.png" alt="Add">
        </div>`;
}

/**
 * Validates the input length for the subtask and finishes editing if valid.
 * 
 * @param {number} index - The index of the subtask being edited.
 */
function validateAndFinishEdit(i, indexHTML, subtasksEditArrayOrigin) {
    const input = document.getElementById(`inputEditSubtasks${i}`);
    if (input.value.length >= 2) {
        finishSubtaskEdit(i, indexHTML, subtasksEditArrayOrigin);
        isEditingSubtask = false;
    } 
  }
  
/**
 * Finishes editing a subtask by updating its value in the subtasks array and re-rendering the list of subtasks.
 *
 * @param {number} i - The index of the subtask being edited.
 * @param {number} indexHTML - The index of the HTML element related to the main task.
 * @param {string} subtasksEditArrayOrigin - The original array of subtasks as a comma-separated string.
 */
function finishSubtaskEdit(i, indexHTML, subtasksEditArrayOrigin) {
    let input = document.getElementById(`inputEditSubtasks${i}`);
    arrayForSubtasks[i] = input.value;
    subtasksRenderOpenEdit(indexHTML, arrayForSubtasks);
}

/**
 * Resets the input field for adding a subtask and updates the UI accordingly.
 *
 * @param {number} index - The index of the main task associated with the subtask input.
 */
function resetSubtaskInputEdit(index) {
    let input = document.getElementById(`subtasksEdit${index}`);
    input.value = '';
    document.getElementById(`subtasksEdit${index}`).classList.add('add-task-input-edit');
    document.getElementById(`subtasksEdit${index}`).classList.remove('subtasks-input-edit');
    
    let position = document.getElementById(`subtasksControl${index}`);
    position.innerHTML = `<button onclick="showSubtaskControlsEdit(${index})" type="button" class="add-task-button-edit">
                                +
                            </button>`;
}

/**
 * Generates the HTML for a supplementary subtask in the edit view.
 *
 * @param {string} subtask - The subtask to display.
 * @param {number} index - The index of the subtask in the list.
 * @param {number} indexHTML - The index of the main task being edited.
 * @param {string} subtasksEditArrayOrigin - The original array of subtasks in string format.
 * 
 * @returns {string} The generated HTML string for the subtask.
 */
function supplementarySubtaskEditHTML(subtask, index, indexHTML, subtasksEditArrayOrigin) {
    return `
    <li id="supplementarySubtaskEdit${index}" class="d-flex-between subtasks-edit bradius8">
        <span>
          ${subtask}
        </span>
        <div>
            <img class="pointer" onclick="deleteSubtaskEdit('${index}','${indexHTML}','${subtask}', '${subtasksEditArrayOrigin}')" src="public/img/delete.png">
            <img class="pointer" onclick="editSubtaskEdit('${index}','${indexHTML}','${subtask}', '${subtasksEditArrayOrigin}')" src="public/img/edit.png">
        </div>
    </li>`;
  }

  /**
 * Renders a checkbox with an associated image and label for a user in an editable format.
 * 
 * This function generates an HTML string that includes a label containing an image and a checkbox. 
 * The checkbox has an associated click event handler that calls the `assignedToUserEdit` function 
 * with the specified parameters. The generated HTML can be used to display a user's image and 
 * name alongside a checkbox for selection.
 * 
 * @param {number} index - The index used to uniquely identify the checkbox and its associated elements.
 * @param {string} names - The name of the user associated with the checkbox, displayed next to the image.
 * @param {string} urls - The URL of the user's image to be displayed.
 * @param {number} indexHTML - An index used in the `assignedToUserEdit` function to reference specific user information.
 * @returns {string} The generated HTML string for the checkbox and associated user information.
 */
  function checkBoxRenderEdit(index, names, urls, indexHTML) {
    return `
      <label class="checkBoxFlex" for="checkbox-${index}" id="checkboxColorEdit${index}">
          <div class="checkBoximg">
              <img id="assignedToUserImageBorderEdit${index}" src="${urls}" alt="" />
              ${names}
          </div>
          <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox-${index}" value="${names}" onclick="assignedToUserEdit('${index}','${urls}','${indexHTML}')" />
      </label>`;
  }
  

  /**
 * Generates HTML for an edit task view.
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} date - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @returns {string} - The HTML string for the edit task view.
 */
  function editTaskHtml(index, category, description, dueDate, prio, title, boardCategory, assignedTo, subtasks , subtaskStatus) {
  return `
  <form onsubmit="handleFormSubmitEdit(event, ${index}, '${category}')">
    <div class="board-task-container-open edit-board-form bradius24 bg-color-ww d-flex content-centr" id="parentContainer${index}">
        <div class="edit-board-form2"> 
          <div class="d-flex-between margin-bt8">
              <h1 id="categoryColorEdit${index}" class=" txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
              <img onclick="closeOpenTaskEdit(event, ${index})" id="closeOpenTask${index}" class="close-open-task-img" src="public/img/Close.png">
          </div>
          <div class="margin-bt8 full-width">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Title:</p>
              <input required minlength="2" onclick="editTitle(${index})" id="inputEditTitle${index}"  class="title-edit-input full-width" type="text"
                        value="${title}" name="title">
          </div>
          <div class="margin-bt8 full-width">  
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Description:</p>
              <textarea required minlength="2" onclick="editDescription(${index})" id="descriptionEdit${index}"  class="edit-task-textarea full-width" 
                        name="description">${description}</textarea>
          </div> 
          <div class="d-flex full-width flex-d-col margin-bt8" id="dateTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Due date:</p>
                    <input required placeholder="${dueDate}" class="edit-task-date pointer" type="date" id="dueDateEdit${index}" name="dueDate">
              <p class="d-flex item-center fs-20 fw-400 mg-block-none margin-left-open-task"></p>
          </div>
          <div class="d-flex flex-d-col margin-bt8" id="prioTask${index}">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Priority:</p>
              <div class="add-task-prio-button-container">
                        <button onclick="prioEdit(1)" id="prioButtonEdit1" value="1" data-prio="urgent" type="button"
                            class="add-task-prio-button">
                            <span>Urgent</span>
                            <img src="public/img/Prio alta.png" alt="">
                        </button>
                        <button onclick="prioEdit(2)" id="prioButtonEdit2" value="2" data-prio="medium" type="button"
                            class="add-task-prio-button">
                            <span>Medium =</span>
                        </button>
                        <button onclick="prioEdit(3)" id="prioButtonEdit3" value="3" data-prio="low" type="button"
                            class="add-task-prio-button">
                            <span>Low</span>
                            <img src="public/img/Prio baja.png" alt="">
                        </button>
              </div>
          </div>
          <div class="margin-bt8">
              <p class="d-flex item-center fs-20 fw-700 mg-block-none color-dg">Assigned To:</p>
          </div>
          <div class="multiselect margin-bt8 pointer">
            <div class="selectBox" onclick="showCheckboxesEdit('${index}','${assignedTo}')">
                <select required="" class="add-task-select">
                    <option>Select an option</option>
                </select>
                <div class="overSelect"></div>
            </div>
            <div id="checkboxesEdit${index}">
            </div>
          </div>
          <div class="user-image-bord-container-open" id="userImageBoardOpenEdit${index}">
          </div>
          <p class="d-flex item-center fs-20 fw-700 color-dg mg-block-inline">Subtasks:</p>  
                    <div class="input-with-button-edit bradius10">
                        <input type="text" minlength="2" class="add-task-input-edit" placeholder="Add item" id="subtasksEdit${index}"
                            name="subtasks">
                        <div id="subtasksControl${index}" class="subtasks-control-edit">
                            <button onclick="showSubtaskControlsEdit(${index}, '${subtasks}')" type="button" id="subtasksPlus${index}"
                                class="add-task-button-edit">
                                +
                            </button>
                        </div>
                    </div>
                    <ul class="subtasksListEdit" id="subtasksPosition${index}"></ul> 
          
            <div class=" d-flex content-even edit-task-button-div">
             <button class="pointer edit-task-button" id="edit-Add-Btn">
                <span class="fs-16 mg-block-none fs-21 f-weight-700 img-24">Edit</span>
                <img class="open-task-delete-edit img" src="public/img/check2.png">
             </button> 
            </div>
           
        </div>  
    </div>
    </form>
  `;
}
