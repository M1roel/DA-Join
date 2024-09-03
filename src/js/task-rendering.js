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
   * Sets the background color of a specific category element based on its category.
   * 
   * @param {number} index - The index of the element to be targeted. Used to construct the element ID.
   * @param {string} category - The category of the task (e.g., "TechnicalTask").
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
  