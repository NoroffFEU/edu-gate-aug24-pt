const API_URL = "http://localhost:3001/api/users";

const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

if (!studentId) {
  alert("Invalid student ID");
  window.location.href = "./user-management.html";
}

// elements
const idField = document.getElementById("idField");
const firstNameEl = document.getElementById("firstName");
const lastNameEl = document.getElementById("lastName");
const classEl = document.getElementById("class");
const schoolEl = document.getElementById("schoolId");
const editForm = document.getElementById("editForm");
const deleteBtn = document.getElementById("deleteStudentBtn");

const confirmModal = document.getElementById("confirmModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

let currentStudent = null;

async function loadStudent() {
  try {
    const res = await fetch(`${API_URL}/${studentId}`);
    if (!res.ok) throw new Error("Failed to load student data");

    const { ok, user, msg } = await res.json();

    if (!ok || !user) {
      alert(msg || "Student not found");
      window.location.href = "./user-management.html";
      return;
    }

    currentStudent = user;
    populate();
  } catch (e) {
    console.error(e);
    alert("Error loading student");
    window.location.href = "./user-management.html";
  }
}

function populate() {
  if (!currentStudent) return;
  idField.value = currentStudent.id;
  firstNameEl.value = currentStudent.firstName || "";
  lastNameEl.value = currentStudent.lastName || "";
  classEl.value = currentStudent.year || "";
  schoolEl.value = currentStudent.schoolId || "";
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updated = {
    id: currentStudent.id,
    firstName: firstNameEl.value.trim(),
    lastName: lastNameEl.value.trim(),
    class: classEl.value.trim(),
    schoolId: schoolEl.value.trim(),
    role: "student",
  };

  try {
    const res = await fetch(`${API_URL}/${currentStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.msg || "Update failed");
      return;
    }

    alert("Student updated!");
    window.location.href = "./user-management.html";
  } catch (err) {
    console.error(err);
    alert("Update error");
  }
});

deleteBtn.addEventListener("click", () => {
  confirmModal.classList.remove("hidden");
});

confirmYes.addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/${currentStudent.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.msg || "Delete failed");
      return;
    }

    alert("Student deleted");
    window.location.href = "./user-management.html";
  } catch (err) {
    console.error(err);
    alert("Delete error");
  }
});

confirmNo.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

loadStudent();
