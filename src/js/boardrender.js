/**
 * Positions an HTML block for the board.
 *
 * @param {number} index - The index of the task.
 * @param {string} category - The category of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} prio - The priority of the task.
 * @param {string} title - The title of the task.
 * @param {string} boardCategory - The board category of the task.
 * @param {string} assignedTo - The user assigned to the task.
 * @param {string} subtasks - The subtasks associated with the task.
 * @param {string} subtaskStatus - The status of the subtasks.
 */
function positionOfHTMLBlockBoard(
    index,
    category,
    description,
    dueDate,
    prio,
    title,
    boardCategory,
    assignedTo,
    subtasks,
    subtaskStatus
  ) {
    let position = document.getElementById(`${boardCategory}`);
    position.innerHTML += `
      <div id="parentContainer${index}" draggable="true" ondragstart="startDragging('${taskkeys[index]}', '${index}')" onclick="openTaskToBoardRender('${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}', '${assignedTo}', '${subtasks}', '${subtaskStatus}')" class="board-task-container pointer bradius24 d-flex flex-d-col content-even mg-btt25"> 
        <div class="d-flex-between" style="position: relative;">
          <h1 id="categoryColor${index}" class="txt-center fs-16 mg-block-none bradius8 color-wh">${category}</h1>
          <img src="public/img/dots.png" id="dots-parent-container${index}" class="dots-parent-container d-none" onclick="toggleElementDropDown(event, '#taskDropdown${index}', 'd-none')">
          <div id="taskDropdown${index}" class="task-dropdown d-flex-start flex-d-col p-10 d-none">
            <span>Move to:</span>
            <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'todo', '${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}' , '${assignedTo}', '${subtasks}', '${subtaskStatus}')">ToDo</a>
            <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'progress', '${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}' , '${assignedTo}', '${subtasks}', '${subtaskStatus}')">Progress</a>
            <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'feedback', '${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}' , '${assignedTo}', '${subtasks}', '${subtaskStatus}')">Feedback</a>
            <a href="#" onclick="moveTaskToCategory('${taskkeys[index]}', 'done', '${index}', '${category}', '${description}', '${dueDate}', '${prio}', '${title}', '${boardCategory}' , '${assignedTo}', '${subtasks}', '${subtaskStatus}')">Done</a>
          </div>
          <img onclick="closeOpenTask(${index})" id="closeOpenTask${index}" class="d-none" src="public/img/Close.png">
        </div>
        <div class="width220 mg-top-4">
          <h2 class="mg-block-none fs-16 fw-700">${title}</h2> 
        </div>
        <div class="mg-bot-4 mg-top-4">  
          <p class="mg-block-none fs-16 fw-400 color-gr width220" id="limitTextDesciption${index}">${description}</p>
        </div> 
        <div class="progress-container d-flex-between width220">
          <div id="hideProgressBar${index}" class="width128">
            <div id="progressBar${index}" class="progress-bar pointer"></div>
          </div>
          <div id="hideProgressAmount${index}" class="d-flex">
            <div id="subtasksAmountTrue${index}" class="d-flex-center fs-12 fw-400 color-bl"></div>
            <div id="subtasks${index}" class="subtasksLength fs-12 fw-400 color-bl"></div>
          </div>
        </div>
        <div class="d-flex-between width220">
          <div class="user-image-bord-container" id="userImageBoard${index}"></div>
          <div class="img-32 d-flex-center" id="prioPosition${index}"></div>
        </div>  
      </div>`;
  }

  
function searchIndexUrlBoard(indexHTML, assignedTo) {
    let position = document.getElementById(`userImageBoard${indexHTML}`);
    position.innerHTML = "";
    if (assignedTo == null) {
      return;
    }
    const maxImages = Math.min(assignedTo.length, 4);
    for (let index = 0; index < maxImages; index++) {
      let imageUrlNumber = assignedTo[index];
      let imageUrlPositionFromArray = imageUrlBoard[imageUrlNumber];
      position.innerHTML += `<img class="img-24" src="${imageUrlPositionFromArray}" alt="" />`;
    }
    if (assignedTo.length > 4) {
      const remaining = assignedTo.length - 4;
      position.innerHTML += `
        <div class="img-24 more-users-board">
          +${remaining}
        </div>`;
    }
  }

  /**
 * Updates the priority display for a specific task on the board based on the given priority level.
 *
 * @param {number} index - The index of the task for which to display the priority.
 * @param {string} prio - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 */
function searchprioBoard(index, prio) {
    let position = document.getElementById(`prioPosition${index}`);
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
 * Sets the background color of a category element based on the specified category.
 *
 * @param {number} index - The index of the category element to update.
 * @param {string} category - The category type (e.g., "TechnicalTask").
 */
function CategoryColor(index, category) {
  let position = document.getElementById(`categoryColor${index}`);
  if (category == TechnicalTask) {
    position.style.backgroundColor = "#1fd7c1";
  } else {
    position.style.backgroundColor = "#0038ff";
  }
}

/**
 * Updates the progress bar and displayed count of completed subtasks for a specific task.
 *
 * @param {number} index - The index of the task for which to update the progress bar.
 * @param {Array} subtasks - An array of subtasks associated with the task.
 * @param {Array} subtaskStatus - An array representing the completion status of each subtask.
 */
function progressBar(index, subtasks, subtaskStatus) {
  let progressBar = document.getElementById(`progressBar${index}`);
  let positionOfTrueAmount = document.getElementById(`subtasksAmountTrue${index}`);
  if (!subtasks || subtasks.length === 0) {
    positionOfTrueAmount.innerHTML = "0/0";
    progressBar.style.width = "0%";
    return;
  }
  let { trueCount, totalCount } = calculateProgress(index, subtasks, subtaskStatus);
  positionOfTrueAmount.innerHTML = `${trueCount}/${totalCount}`;
  let progressPercentage = (trueCount / totalCount) * 100;
  updateProgressBar(index, progressPercentage);
}

/**
 * Updates the progress bar width and color based on the percentage of completed subtasks.
 *
 * @param {number} indexHtml - The index of the task in the HTML structure.
 * @param {number} progressPercentage - The calculated percentage of completed subtasks.
 */
function updateProgressBar(index, progressPercentage) {
  let progressBar = document.getElementById(`progressBar${index}`);
  if (!progressBar) {
    console.error(`Element nicht gefunden: progressBar${index}`);
    return;
  }
  progressBar.style.width = `${progressPercentage}%`;
  if (progressPercentage === 100) {
    progressBar.style.backgroundColor = "#095a1b";
  } else {
    progressBar.style.backgroundColor = "";
  }
}

/**
 * Sets the background color of task elements based on their category.
 * The function assigns specific colors to tasks categorized as 
 * "technical task" or "user story". The color is applied to the background
 * of each task's container heading (h1).
 */
function setTaskColor() {
  const categoryColors = {
    "technical task": "#1FD7C1",
    "user story": "#0038FF",
  };
  let elements = document.querySelectorAll(".board-task-container h1");

  elements.forEach((element) => {
    let category = element.getAttribute("data-category")?.toLowerCase().trim();
    let taskColor = categoryColors[category];
    element.style.backgroundColor = taskColor;
  });
}


/**
 * Limits the text content of an element to 50 characters.
 * If the text exceeds 50 characters, it is truncated and appended with "...".
 * 
 * @param {string} id - The ID of the HTML element whose text should be limited.
 */
function limitTextTo50Chars(id) {
  const element = document.getElementById(id);
  const text = element.innerText;
  if (text.length > 50) {
    element.innerText = text.substring(0, 50) + "...";
  }
}
