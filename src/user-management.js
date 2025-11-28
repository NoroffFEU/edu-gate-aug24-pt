const API_URL = "http://localhost:3001/api/users";

const usersTbody = document.getElementById("usersTbody");
const searchInput = document.getElementById("searchInput");
const addUserBtn = document.getElementById("addUserBtn");
const paginationContainer = document.getElementById("pagination");
const backToDashBtn = document.getElementById("backToDash");

const confirmModal = document.getElementById("confirmModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let users = [];
let filteredUsers = [];
let idToDelete = null;

let currentPage = 1;
const pageSize = 7;

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function loadData() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to load users");

    const { users: loadedUsers } = await res.json();
    users = loadedUsers || [];
  } catch (err) {
    console.error(err);
    users = [];
  }

  filteredUsers = [...users];
  renderTable();
}

function renderTable() {
  const start = (currentPage - 1) * pageSize;
  const items = filteredUsers.slice(start, start + pageSize);

  if (items.length === 0) {
    usersTbody.innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:20px;color:#888">
        No users found
      </td></tr>`;
    paginationContainer.innerHTML = "";
    return;
  }

  usersTbody.innerHTML = items
    .map(
      (u) => `
      <tr data-id="${escapeHtml(u.id)}">
        <td>${escapeHtml(u.id)}</td>
        <td>${escapeHtml(u.firstName)}</td>
        <td>${escapeHtml(u.lastName)}</td>
        <td>${escapeHtml(u.year)}</td>
        <td>${escapeHtml(u.role)}</td>
        <td>${escapeHtml(u.dob)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-edit" data-id="${u.id}">Edit</button>
            <button class="btn-delete" data-id="${u.id}">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");

  renderPagination();
  paginationContainer.addEventListener("click", (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;

    const page = Number(btn.dataset.page);
    if (!page || page === currentPage) return;

    currentPage = page;
    renderTable();
  });
}

function renderPagination() {
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let html = `
    <button data-page="${Math.max(1, currentPage - 1)}"
      ${currentPage === 1 ? "disabled" : ""}>&laquo;</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button data-page="${i}" class="${i === currentPage ? "active" : ""}">${i}</button>`;
  }

  html += `
    <button data-page="${Math.min(totalPages, currentPage + 1)}"
      ${currentPage === totalPages ? "disabled" : ""}>&raquo;</button>
  `;

  paginationContainer.innerHTML = html;
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();

  filteredUsers = users.filter((u) =>
    `${u.id} ${u.firstName} ${u.lastName} ${u.year} ${u.dob}`
      .toLowerCase()
      .includes(q)
  );

  currentPage = 1;
  renderTable();
});

usersTbody.addEventListener("click", (ev) => {
  const row = ev.target.closest("tr");
  if (!row) return;

  if (ev.target.closest(".btn-edit") || ev.target.closest(".btn-delete")) {
    return;
  }

  const id = row.dataset.id;
  if (!id) return;

  window.location.href = `./edit-student.html?id=${encodeURIComponent(id)}`;
});

usersTbody.addEventListener("click", (ev) => {
  const editBtn = ev.target.closest(".btn-edit");
  const deleteBtn = ev.target.closest(".btn-delete");

  if (editBtn) {
    const id = editBtn.dataset.id;
    window.location.href = `./edit-student.html?id=${id}`;
    return;
  }

  if (deleteBtn) {
    idToDelete = deleteBtn.dataset.id;
    confirmModal.classList.add("open");
  }
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (!idToDelete) return;

  try {
    const res = await fetch(`${API_URL}/${idToDelete}`, { method: "DELETE" });
    const result = await res.json();

    if (!res.ok || !result.ok) {
      throw new Error(result.msg || "Failed to delete user");
    }

    users = users.filter((u) => String(u.id) !== idToDelete);
    filteredUsers = filteredUsers.filter((u) => String(u.id) !== idToDelete);

    confirmModal.classList.remove("open");
    idToDelete = null;
    renderTable();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

cancelDeleteBtn.addEventListener("click", () => {
  confirmModal.classList.remove("open");
  idToDelete = null;
});

addUserBtn.addEventListener("click", () => {
  window.location.href = "./add-student.html";
});

backToDashBtn.addEventListener("click", () => {
  window.location.href = "./teacher-dashboard.html";
});

loadData();
