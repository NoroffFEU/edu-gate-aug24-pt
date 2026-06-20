const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const loginAlert = document.getElementById("login-alert");
const alertIcon = document.getElementById("alert-icon");
const alertTitle = document.getElementById("alert-title");
const alertMessage = document.getElementById("alert-message");
const alertCloseBtn = document.getElementById("alert-close");

let alertTimeout = null;

function showAlert(type, title, message) {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }

  loginAlert.classList.remove("alert-success", "alert-error");

  if (type === "success") {
    loginAlert.classList.add("alert-success");
    alertIcon.src = "../public/icons/success.png";
    alertIcon.alt = "Success";
  } else {
    loginAlert.classList.add("alert-error");
    alertIcon.src = "../public/icons/fail.png";
    alertIcon.alt = "Error";
  }

  alertTitle.textContent = title;
  alertMessage.textContent = message;

  loginAlert.setAttribute("aria-hidden", "false");

  alertTimeout = setTimeout(() => {
    hideAlert();
  }, 4000);
}

function hideAlert() {
  loginAlert.setAttribute("aria-hidden", "true");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function authenticateUser(email, password) {
  try {
    const [studentsRes, teachersRes] = await Promise.all([
      fetch("../data/Students.json"),
      fetch("../data/Teachers.json")
    ]);

    const studentsData = await studentsRes.json();
    const teachersData = await teachersRes.json();

    const allUsers = [
      ...(studentsData.users || []),
      ...(teachersData.users || [])
    ];

    const user = allUsers.find(
      (u) => u.email === email && u.password === password
    );

    return user || null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

loginForm.addEventListener("submit", async (e) => {
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
    const user = await authenticateUser(
      emailInput.value.trim(),
      passwordInput.value
    );

    if (user) {
      showAlert("success", "Success!", "Login successful!");
      loginForm.reset();

      setTimeout(() => {
        if (user.role === "student") {
          window.location.href = "./student-dashboard.html";
        } else if (user.role === "teacher") {
          window.location.href = "./teacher-dashboard.html";
        } else {
          window.location.href = "./admin-dashboard.html";
        }
      }, 1500);
    } else {
      showAlert("error", "Failed Log In!", "Wrong password or email address!");
    }
  }
});

emailInput.addEventListener("input", () => {
  emailError.textContent = "";
});

passwordInput.addEventListener("input", () => {
  passwordError.textContent = "";
});

alertCloseBtn.addEventListener("click", () => {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
  }
  hideAlert();
});
