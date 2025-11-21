const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let hasError = false;

  emailError.textContent = "";
  passwordError.textContent = "";

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Email cannot be empty.";
    hasError = true;
  } else if (!isValidEmail(emailInput.value)) {
    emailError.textContent = "Please enter a valid email address.";
    hasError = true;
  }

  if (passwordInput.value.trim() === "") {
    passwordError.textContent = "Password cannot be empty.";
    hasError = true;
  }

  if (!hasError) {
    alert("Login successful!");
    loginForm.reset();
  }
});

emailInput.addEventListener("input", () => {
  emailError.textContent = "";
});

passwordInput.addEventListener("input", () => {
  passwordError.textContent = "";
});
