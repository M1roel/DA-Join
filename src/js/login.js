function goToPrivacy() {
  window.location.replace("public/login-datenschutz.html");
}

function goToLegalNotice() {
  window.location.replace("public/login-impressum.html");
}

function goToSignUp() {
  location.replace("public/signup.html");
}

function goToSummary() {
  location.replace("index.html");
}

/**
 * Handles the login form submission. Authenticates the user with Firebase based on email and password.
 * Sets persistence based on the "Remember Me" checkbox.
 *
 * @param {Event} e - The submit event triggered by the login form.
 * @async
 */
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password-login").value;
  const rememberMe = document.getElementById("remember-me").checked;
  try {
    if (rememberMe) {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } else {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }
    await firebase.auth().signInWithEmailAndPassword(email, password);
    goToSummary();
  } catch (error) {
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.classList.remove("d-none");
    errorMessageElement.textContent = "Check your email and password. Please try again.";
    let inputPassword = document.querySelector(".input-password");
    let inputEmail = document.querySelector(".input-mail");
    inputPassword.classList.add("input-invalid");
    inputEmail.classList.add("input-invalid");
}
});

document.getElementById('email').addEventListener('blur', validateEmail);

/**
 * Validates the email input field and displays a message if the email format is invalid.
 */
function validateEmail() {
  const email = document.getElementById('email').value.trim();
  const validationMessage = document.getElementById('validation-mail-message');  
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
 * Shrinks the login logo by applying a CSS class that scales it down 
 * and moves it to the top-left corner. Also makes the background transparent.
 * This function selects the login logo element and adds the 'logo-shrink' 
 * class to initiate the transformation.
 */
function shrinkLogo() {
  const logoElement = document.querySelector('.login-logo');
  const logoElementInvert = document.querySelector('#login-logo-invert');
  
  logoElement.style.animation = "backgroundChange 1s forwards";

  logoElement.classList.add('logo-shrink');
  logoElementInvert.classList.add('logo-shrink-invert');
}

/**
 * Sets a timeout to trigger the shrinkLogo function after 1 second (1000ms)
 * once the window has fully loaded. This ensures that the logo shrinks
 * with a delay after the page content is ready.
 */
window.onload = function() {
  setTimeout(shrinkLogo, 1000);
};


/**
 * Handles guest login by setting a local storage item and navigating to the summary page.
 * 
 * @param {Event} e - The click event triggered by the guest login button.
 */
document.querySelector(".submit-guest-login-btn").addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.setItem("user", "Guest");
  goToSummary();
});

/**
 * Initializes event listeners for the password input field and toggle button on page load.
 * 
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password-login");
  const togglePassword = document.getElementById("toggle-password-login");

  updateIconVisibility();

  passwordInput.addEventListener("input", updateIconVisibility);

  togglePassword.addEventListener("click", function () {
    updatePasswordVisibility(passwordInput, togglePassword);
  });
});

/**
 * Toggles the visibility of the password input field between text and password.
 * 
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLImageElement} toggle - The image element used to toggle visibility.
 */
function updatePasswordVisibility(input, toggle) {
  if (input.type === "password") {
    input.type = "text";
    toggle.src = "public/img/password-show.png";
  } else {
    input.type = "password";
    toggle.src = "public/img/password-hidden.png";
  }
}

/**
 * Updates the password toggle icon visibility based on the content of the password input field.
 */
function updateIconVisibility() {
  const passwordInput = document.getElementById("password-login");
  const togglePassword = document.getElementById("toggle-password-login");

  if (passwordInput.value.length > 0) {
    togglePassword.src = "public/img/password-hidden.png";
  } else {
    togglePassword.src = "public/img/lock.png";
  }
}
