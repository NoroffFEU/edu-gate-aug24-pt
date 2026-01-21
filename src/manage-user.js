async function loadUserIntoForm() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if(!userId) {
        console.error("No user id in URL");
        return;
    }

    const isTeacherPage = window.location.pathname.includes("manage-teacher");
    const dataFile = isTeacherPage
        ?"../../data/Teachers.json"
        :"../../data/Students.json";

    const res = await fetch(dataFile);
    const data = await res.json();

    const users = data.users || [];

    const user = users.find(i => i.id === userId);

    if (!user) {
        console.error("User not found:", userId);
        return;
    }

    document.querySelector('input[name="id"]').value = user.id ?? "";
    document.querySelector('input[name="firstName"]').value = user.firstName ?? "";
    document.querySelector('input[name="lastName"]').value = user.lastName ?? "";
    document.querySelector('input[name="gradYear"]').value = user.gradYear ?? "";
    document.querySelector('input[name="position"]').value = user.role ?? "";
    document.querySelector('input[name="dob"]').value = user.dob ?? "";
    document.querySelector('input[name="email"]').value = user.email ?? "";
    document.querySelector('input[name="school"]').value = user.school ?? "";
}

loadUserIntoForm();

const deletModal = document.getElementById("delete-modal");
const confirmDelete = document.getElementById("confirm-delete");
const deleteUserBtn = document.getElementById("delete-user-btn");

let pendingDeleteId = null;

function openDeleteModal(userId) {
  pendingDeleteId = userId;

  deletModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  confirmDelete.focus();
}

function closeDeleteModal() {
  pendingDeleteId = null;

  deletModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (deleteUserBtn) {
    deleteUserBtn.addEventListener("click", () => {
        const userId = new URLSearchParams(window.location.search).get("id");
        openDeleteModal(userId);
    })
}

deletModal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeDeleteModal();
});

confirmDelete.addEventListener("click", () => {
    console.log("Delete confirmed for:", pendingDeleteId);

    closeDeleteModal();
})
