function home() {
  window.location.replace("public/login.html");
}

/**
 * Handles the user sign-up process.
 * Validates the form data, creates a new user with Firebase Authentication,
 * saves the user data to the database, and adds a contact. If successful,
 * displays a success message and clears the input fields.
 * 
 * @param {Event} event - The event object associated with the form submission.
 * @returns {Promise<boolean>} A promise that resolves to `true` if sign-up is successful, or `false` if validation fails.
 * @async
 */
async function signUp(event) {
  event.preventDefault();
  const formData = getFormData();
  if (!(await passwordValidation(formData.password, formData.confirm, formData.checkbox))) {
    return false;
  }
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(formData.mail, formData.password);
    const user = userCredential.user;
    const userId = user.uid;
    await saveUserData(userId, { name: formData.name, mail: formData.mail });
    try {
      await addContact({ name: nameInput.value, mail: mailInput.value, phone: '-'});
    } catch (error) {
      console.error("Error adding contact:", error);
    }
    showSuccessMessage();
    clearInput();
  } catch (error) {
    console.log("Error during sign up: " + error.message);
  }
  return true;
}

/**
 * Retrieves form data from the sign-up form fields.
 * 
 * @returns {Object} An object containing the form data (name, mail, password, confirm password, and checkbox status).
 */
function getFormData() {
  return {
    name: document.getElementById("name").value,
    mail: document.getElementById("mail").value,
    password: document.getElementById("password").value,
    confirm: document.getElementById("confirm-password").value,
    checkbox: document.getElementById("checkbox").checked,
  };
}

/**
 * Validates that the password and confirm password fields match.
 * Displays an error message if they do not match.
 * 
 * @listens input
 */
document.getElementById('confirm-password').addEventListener('blur', validatePassword);
document.getElementById('password').addEventListener('blur', validatePassword);

function validatePassword() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorMessage = document.getElementById('error-message');
  const validationMessage = document.getElementById('validation-pw-message');
  const confirmPasswordInput = document.getElementById('confirm-password');
  
  errorMessage.style.display = 'none';
  confirmPasswordInput.classList.remove('invalid');
  validationMessage.classList.add('d-none');

  if (password.length < 6) {
    validationMessage.textContent = "Password has to be at least 6 letters.";
    validationMessage.classList.remove('d-none');
  } else if (password !== "" && confirmPassword !== "") {
    if (password !== confirmPassword) {
      confirmPasswordInput.classList.add('invalid');
      errorMessage.style.display = 'block';
    }
  }
}

document.getElementById('mail').addEventListener('blur', validateEmail);

/**
 * Validates the email input field and displays a message if the email format is invalid.
 */
function validateEmail() {
  const email = document.getElementById('mail').value.trim();
  const validationMessage = document.getElementById('validation-email-message');  
  validationMessage.classList.add('d-none');
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email === "") {
    validationMessage.textContent = "Email field cannot be empty.";
    validationMessage.classList.remove('d-none');
  } else if (!email.includes('@')) {
    validationMessage.textContent = "Email must contain '@'.";
    validationMessage.classList.remove('d-none');
  } else if (!emailPattern.test(email)) {
    validationMessage.textContent = "Please enter a valid email address.";
    validationMessage.classList.remove('d-none');
  }
}

/**
 * Validates the password and checkbox fields during sign-up.
 * Checks if the password and confirm password match, and ensures the privacy policy checkbox is checked.
 * 
 * @param {string} password - The password entered by the user.
 * @param {string} confirm - The confirmed password entered by the user.
 * @param {boolean} checkbox - The status of the privacy policy checkbox.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the validation passes, otherwise `false`.
 */
function passwordValidation(password, confirm, checkbox) {
  const messageElement = document.getElementById('validation-message');
  return new Promise((resolve) => {
    if (password !== confirm) {
      messageElement.textContent = "Passwords do not match.Try agian.";
      messageElement.classList.remove('d-none');
      resolve(false);
    } else if (!checkbox) {
      messageElement.textContent = "You must accept the Privacy Policy.";
      messageElement.classList.remove('d-none');
      resolve(false);
    } else {
      messageElement.classList.add('d-none');
      resolve(true);
    }
  });
}

/**
 * Saves the user data to the Firebase database under the user's unique ID.
 * 
 * @param {string} userId - The unique ID of the user.
 * @param {Object} userData - An object containing the user's data (e.g., name, mail).
 * @async
 */
async function saveUserData(userId, userData) {
  await firebase.database().ref('users/' + userId).set(userData);
}

/**
 * Displays a success message after a successful sign-up.
 * The message fades in, and after a short delay, the user is redirected to the login page.
 */
function showSuccessMessage() {
  const successBody = document.querySelector('.successBody');
  const successSignup = document.getElementById('successSignup');
  successBody.classList.remove('d-none');  
  successBody.style.backgroundColor = 'rgba(0,0,0,0.2)';
  setTimeout(() => {
    successSignup.classList.add('show');
  }, 100);
  setTimeout(() => {
    home();
  }, 1000);
}

/**
 * Clears the input fields in the sign-up form.
 * Resets the name, mail, password, confirm password fields, and unchecks the privacy policy checkbox.
 */
function clearInput() {
  document.getElementById("name").value = "";
  document.getElementById("mail").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm-password").value = "";
  document.getElementById("checkbox").checked = false;
}

/**
 * Validates the form inputs and enables or disables the submit button based on the validity of the inputs.
 * The form is considered valid if all required fields are filled.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function () {
  function validateForm() {
    const isFormValid =
      nameInput.value.trim() !== '' &&
      mailInput.value.trim() !== '' &&
      passwordInput.value.trim() !== '' &&
      confirmPasswordInput.value.trim() !== '';

    submitButton.disabled = !isFormValid;
    if (isFormValid) {
      submitButton.classList.remove('disabled')
    } else {
      submitButton.classList.add('disabled');
    }
  }
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', validateForm);
  });
  validateForm();
});

/**
 * Initializes event listeners for password visibility toggling and updates the visibility of icons.
 * This function is executed after the DOM content is fully loaded.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function() {
  updateIconVisibility();

  passwordInput.addEventListener('input', updateIconVisibility);
  confirmPasswordInput.addEventListener('input', updateIconVisibility);

  togglePassword.addEventListener('click', function() {
    updatePasswordVisibility(passwordInput, togglePassword);
  });

  toggleConfirmPassword.addEventListener('click', function() {
    updatePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
  });
});

/**
 * Toggles the visibility of a password input field between text and password.
 * 
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} toggle - The image element used to toggle visibility.
 */
function updatePasswordVisibility(input, toggle) {
  if (input.type === 'password') {
    input.type = 'text';
    toggle.src = 'public/img/password-show.png';
  } else {
    input.type = 'password';
    toggle.src = 'public/img/password-hidden.png';
  }
}

/**
 * Updates the icon visibility based on the content of the password input fields.
 * Displays a different icon depending on whether the input field has content or is empty.
 */
function updateIconVisibility() {
  if (passwordInput.value.length > 0) {
    togglePassword.src = 'public/img/password-hidden.png';
  } else {
    togglePassword.src = 'public/img/lock.png';
  }

  if (confirmPasswordInput.value.length > 0) {
    toggleConfirmPassword.src = 'public/img/password-hidden.png';
  } else {
    toggleConfirmPassword.src = 'public/img/lock.png';
  }
}