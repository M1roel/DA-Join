
/**
 * Returns a string of HTML to render a checkbox with an image and name.
 * @param {number} index - The index of the checkbox.
 * @param {string} imgSrc - The URL of the image.
 * @param {string} element - The name associated with the checkbox.
 * @returns {string} - The HTML string for the checkbox.
 */
function checkBoxRender2(index, imgSrc, element) {
    return `
      <label class="checkBoxFlex" for="checkbox2-${index}" id="checkboxColor2${index}">
          <div class="checkBoximg">
              <img id="assignedToUserImageBorde2${index}" src="${imgSrc}" alt="" />
              ${element}
          </div>
          <input class="assignedToUserCheckbox img-24" type="checkbox" id="checkbox2-${index}" value="${element}" onclick="assignedToUser2('${index}','${element}','${imgSrc}')" />
      </label>`;
  }

    /**
   * Displays the controls for managing subtasks, updating the input field styles and controls.
   */
  /**
   * Displays the controls for managing subtasks, updating the input field styles and controls.
   */
  function showSubtaskControls2() {
    document.getElementById("subtasks-board").classList.remove("add-task-input");
    document.getElementById("subtasks-board").classList.add("subtasks-input");
    let position = document.getElementById("subtasksControl2");
    position.innerHTML = `<button onclick="resetSubtaskInput2()" type="button" class="subtask-button2">
              <img class="img-24 " src="public/img/closeAddTask.png" alt="Reset">
          </button>
          <div class="seperator-subtasks"></div>
          <button onclick="addSubtask2()" type="button" class="subtask-button2">
              <img class="img-24 " src="public/img/checkAddTask.png" alt="Add">
          </button>`;
  }
  
  /**
   * Resets the subtask input field and returns it to its initial state.
   */
  function resetSubtaskInput2() {
    let input = document.getElementById("subtasks-board");
    input.value = "";
    document.getElementById("subtasks-board").classList.add("add-task-input");
    document.getElementById("subtasks-board").classList.remove("subtasks-input");
    let position = document.getElementById("subtasksControl2");
    position.innerHTML = `<button onclick="showSubtaskControls2()" type="button" id="subtasksPlus2" class="subtask-button2">
                                    +
                                </button>`;
  }
  
  /**
   * Updates the displayed list of subtasks based on the current contents of the subtasksArray.
   */
  function updateSubtasksList2() {
    let subtasksPosition = document.getElementById("subtasksPosition2");
    if (subtasksPosition) {
      subtasksPosition.innerHTML = "";
      for (let index = 0; index < subtasksArray.length; index++) {
        const element = subtasksArray[index];
        subtasksPosition.innerHTML += `
                 <li id="supplementarySubtask2${index}" class="d-flex-between subtasks-edit bradius8">
            <span>${element}</span>
            <div class="d-flex item-center">
                <img class="pointer img-24 p-4 " onclick="deleteSubtask2(${index})" src="public/img/delete.png">
                <div class="seperator-subtasks"></div>
                <img class="pointer img-24 p-4 " onclick="editSubtask2(${index})" src="public/img/edit.png">
            </div>
        </li>`;
      }
    }
  }
  
  /**
   * Generates and returns the HTML for the subtask editing mode.
   *
   * @param {number} index - The index of the subtask.
   * @param {string} arrayPosition - The current value of the subtask.
   * @returns {string} - The HTML string for editing the subtask.
   */
  function editSubtaskHTML2(index, arrayPosition) {
    return `
    <input class="inputAddTaskSubtasks fs-16" id="inputAddTaskSubtasks2${index}" required minlength="2" class="" value="${arrayPosition}">
    <div class="d-flex item-center">
        <img class="img-24 pointer p-4" onclick="deleteSubtask2(${index})" src="public/img/delete.png">
        <div class="seperator-subtasks"></div>
        <img class="img-24 pointer p-4" onclick="validateAndFinish2(${index})" src="public/img/checkAddTask.png" alt="Add">
    </div> `;
  }

  /**
 * Opens the form to add a new task.
 *
 * Removes the hidden and non-display classes from the add-task form to make it visible.
 */
function openAddForm(event) {
    event.preventDefault();
    document.getElementById("add-task-form").classList.remove("vis-hidden");
    document.getElementById("add-task-form").classList.remove("d-none");
    let overlay = document.getElementById("overlay-form");
    overlay.classList.remove("d-none");
    let formField = document.getElementById("add-task-form");
  
    formField.classList.remove("d-none", "hidden");
    formField.style.cssText =
      "visibility: visible; transform: translateX(100vw); animation: moveIn 200ms ease-in forwards";
    document.addEventListener("click", outsideClickHandler, true);
    document.addEventListener("keydown", handleEnterKey);
    prio2(2);
  }
  
  /**
   * Closes the form.
   * Removes the non-display class from the add-task form, making it visible.
   */
  function closeAddForm() {
    document.getElementById("overlay-form").classList.add("d-none");
    let formField = document.getElementById("add-task-form");
  
    formField.classList.remove("d-none");
    formField.style.animation = "moveOut 200ms ease-out forwards";
    setTimeout(() => {
      formField.classList.add("hidden", "d-none");
      formField.style.cssText = "visibility: hidden; transform: translateX(100vw)";
    }, 100);
    document.removeEventListener("click", outsideClickHandler, true);
    document.removeEventListener("keydown", handleEnterKey);
    resetUIAddTask2(formField);
  }

  /**
 * Updates the priority button styling.
 *
 * Applies and removes priority classes from buttons based on the provided ID.
 *
 * @param {string} id - The ID of the button to update.
 */
function prio2(id) {
    const buttons = document.querySelectorAll(".add-task-prio-button-container button");
  
    buttons.forEach((button) => {
      button.classList.remove("add-task-prio-button-urgent", "add-task-prio-button-medium", "add-task-prio-button-low");
      button.classList.add("add-task-prio-button");
    });
  
    let position = document.getElementById(`prio2Button${id}`);
    prioIdCheck2(id, position);
    selectedPrio = id;
  }