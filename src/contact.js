const form = document.getElementById("contactForm");
const email = document.getElementById("email");
const nameField = document.getElementById("name");
const surname = document.getElementById("surname");
const message = document.getElementById("message");

const emailError = document.getElementById("emailError");
const nameError = document.getElementById("nameError");
const surnameError = document.getElementById("surnameError");
const messageError = document.getElementById("messageError");

const successMsg = document.getElementById("successMsg");

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function clearErrors() {
  emailError.textContent = "";
  nameError.textContent = "";
  surnameError.textContent = "";
  messageError.textContent = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  let hasError = false;

  if (email.value.trim() === "" || !isValidEmail(email.value)) {
    emailError.textContent = "Valid email required.";
    hasError = true;
  }

  if (nameField.value.trim() === "") {
    nameError.textContent = "Name cannot be empty.";
    hasError = true;
  }

  if (surname.value.trim() === "") {
    surnameError.textContent = "Surname cannot be empty.";
    hasError = true;
  }

  if (message.value.trim() === "") {
    messageError.textContent = "Message cannot be empty.";
    hasError = true;
  }

  if (!hasError) {
    successMsg.style.display = "block";
    form.reset();

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  }
});
