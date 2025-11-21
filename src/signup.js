// Signup form validation and UI behavior

const signupForm = document.getElementById("signupForm");

const emailInput = document.getElementById("email");
const firstNameInput = document.getElementById("firstName");
const surnameInput = document.getElementById("surname");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const emailError = document.getElementById("emailError");
const firstNameError = document.getElementById("firstNameError");
const surnameError = document.getElementById("surnameError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearErrors() {
  emailError.textContent = "";
  firstNameError.textContent = "";
  surnameError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
}

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  let hasError = false;

  if (!firstNameInput.value.trim()) {
    firstNameError.textContent = "First name is required.";
    hasError = true;
  }

  if (!surnameInput.value.trim()) {
    surnameError.textContent = "Surname is required.";
    hasError = true;
  }

  const emailVal = emailInput.value.trim();
  if (!emailVal) {
    emailError.textContent = "Email is required.";
    hasError = true;
  } else if (!isValidEmail(emailVal)) {
    emailError.textContent = "Invalid email format.";
    hasError = true;
  }

  const pwd = passwordInput.value;
  if (!pwd) {
    passwordError.textContent = "Password cannot be empty.";
    hasError = true;
  } else if (pwd.length < 8) {
    passwordError.textContent = "Password must be at least 8 characters.";
    hasError = true;
  }

  const confirmPwd = confirmPasswordInput.value;
  if (!confirmPwd) {
    confirmPasswordError.textContent = "Please confirm your password.";
    hasError = true;
  } else if (confirmPwd !== pwd) {
    confirmPasswordError.textContent = "Passwords don't match.";
    hasError = true;
  }

  if (hasError) {
    const firstError = document.querySelector(".error:not(:empty)");
    if (firstError) {
      const input = firstError.previousElementSibling;
      if (input && typeof input.focus === "function") input.focus();
    }
    return;
  }

  alert("Account created successfully!");
  signupForm.reset();
});
