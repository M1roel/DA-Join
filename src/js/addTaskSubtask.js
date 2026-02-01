/**
 * Adds a new subtask to the subtasks array if the input is not empty, then updates the UI.
 */
function addSubtask() {
    let input = document.getElementById("subtasks");
    if (input.value.trim() !== "") {
      subtasksArray.push(input.value.trim());
      input.value = "";
      subtasksStatusArray.push(false);
      updateSubtasksList();
      resetSubtaskInput();
    }
  }
  
  /**
   * Resets the subtask input field and returns it to its initial state.
   */
  function resetSubtaskInput() {
    let input = document.getElementById("subtasks");
    input.value = "";
    document.getElementById("subtasks").classList.add("add-task-input");
    document.getElementById("subtasks").classList.remove("subtasks-input");
    let position = document.getElementById("subtasksControl");
    position.innerHTML = `<button onclick="showSubtaskControls()" type="button" id="subtasksPlus" class="add-task-button">
                                  +
                              </button>`;
  }
  
  /**
   * Updates the displayed list of subtasks based on the current contents of the subtasksArray.
   */
  function updateSubtasksList() {
    let subtasksPosition = document.getElementById("subtasksPosition");
    if (subtasksPosition) {
      subtasksPosition.innerHTML = "";
      for (let index = 0; index < subtasksArray.length; index++) {
        const element = subtasksArray[index];
        subtasksPosition.innerHTML += `
               <li id="supplementarySubtask${index}" class="d-flex-between subtasks-edit bradius8">
          <span>${element}</span>
          <div class="d-flex item-center">
              <img class="pointer img-24 p-4 " onclick="deleteSubtask(${index})" src="public/img/delete.png">
              <div class="seperator-subtasks"></div>
              <img class="pointer img-24 p-4 " onclick="editSubtask(${index})" src="public/img/edit.png">
          </div>
      </li>`;
      }
    }
  }

/**
 * Enables editing mode for a specific subtask by updating its HTML content.
 * 
 * @param {number} index - The index of the subtask to edit.
 */
  function editSubtask(index) {
    let position = document.getElementById(`supplementarySubtask${index}`);
    position.classList.remove('subtasks-edit');
    position.classList.add('subtasks-edit-input');
    let arrayPosition = subtasksArray[index];
    position.innerHTML = editSubtaskHTML(index, arrayPosition);
  }

/**
 * Generates and returns the HTML for the subtask editing mode.
 * 
 * @param {number} index - The index of the subtask.
 * @param {string} arrayPosition - The current value of the subtask.
 * @returns {string} - The HTML string for editing the subtask.
 */
  function editSubtaskHTML(index, arrayPosition){
    return  `
    <input class="inputAddTaskSubtasks fs-16" id="inputAddTaskSubtasks${index}" required minlength="2" class="" value="${arrayPosition}">
    <div class="d-flex item-center">
        <img class="img-24 pointer p-4" onclick="deleteSubtask(${index})" src="public/img/delete.png">
        <div class="seperator-subtasks"></div>
        <img class="img-24 pointer p-4" onclick="validateAndFinish(${index})" src="public/img/checkAddTask.png" alt="Add">
    </div> `
  }

/**
 * Validates the input length for the subtask and finishes editing if valid.
 * 
 * @param {number} index - The index of the subtask being edited.
 */
  function validateAndFinish(index) {
    const input = document.getElementById(`inputAddTaskSubtasks${index}`);
    if (input.value.length >= 2) {
      finishSubtask(index);
    } 
  }
  
  /**
   * Clears the list of displayed subtasks by resetting the innerHTML of the subtasksPosition element.
   */
  function clearSubtasks() {
    let position = document.getElementById("subtasksPosition");
    position.innerHTML = "";
    subtasksStatusArray = [];
  }
 
/**
 * Deletes a subtask and updates the UI accordingly.
 * 
 * @param {number} index - The index of the subtask to delete.
 */  
  function deleteSubtask(index) {
    let position = document.getElementById(`supplementarySubtask${index}`);
    position.innerHTML = "";
    subtasksArray.splice([index], 1);
    updateSubtasksList();
  }

/**
 * Finishes editing a subtask and updates its value in the subtasks array.
 * 
 * @param {number} index - The index of the subtask being finished.
 */  
  function finishSubtask(index) {
    let input = document.getElementById(`inputAddTaskSubtasks${index}`);
    subtasksArray[index] = input.value;
    updateSubtasksList();
  }

/**
 * Displays the controls for managing subtasks, updating the input field styles and controls.
 */  
  function showSubtaskControls() {
    document.getElementById("subtasks").classList.remove("add-task-input");
    document.getElementById("subtasks").classList.add("subtasks-input");
    let position = document.getElementById("subtasksControl");
    position.innerHTML = 
          `<button onclick="resetSubtaskInput()" type="button" class="subtask-button">
              <img class="img-24 " src="public/img/closeAddTask.png" alt="Reset">
          </button>
          <div class="seperator-subtasks"></div>
          <button onclick="addSubtask()" type="button" class="subtask-button">
              <img class="img-24 " src="public/img/checkAddTask.png" alt="Add">
          </button>`;
  }