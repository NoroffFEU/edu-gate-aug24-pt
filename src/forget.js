const forgotForm = document.getElementById("forgotForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

forgotForm.addEventListener("submit", (e) => {
  e.preventDefault();
  emailError.textContent = "";

  if (!emailInput.value.trim()) {
    emailError.textContent = "Email cannot be empty.";
    return;
  }

  if (!isValidEmail(emailInput.value)) {
    emailError.textContent = "Invalid email format.";
    return;
  }

  alert("A password reset link has been sent!");
  forgotForm.reset();
});
