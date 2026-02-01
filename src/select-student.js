// select-student.js
const studentsFile = "../data/Students.json";

const searchInput = document.getElementById("searchInput");
const studentsTbody = document.getElementById("studentsTbody");
const pagination = document.getElementById("pagination");
const backBtn = document.getElementById("backBtn");

let students = [];
let filtered = [];
let currentPage = 1;
const pageSize = 7;

function clean(x = "") {
  return String(x)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function loadStudents() {
  try {
    const res = await fetch(studentsFile);
    const json = await res.json();

    const list = Array.isArray(json.users) ? json.users : json;

    students = list.map((s) => ({
      id: s.id ?? s.studentId ?? "",
      firstName: s.firstName ?? "",
      lastName: s.lastName ?? "",
      year: s.year ?? s.class ?? "",
    }));
  } catch (err) {
    console.error(err);
    students = [];
  }

  filtered = [...students];
  currentPage = 1;
  render();
}

function render() {
  renderTable();
  renderPagination();
}

function renderTable() {
  const start = (currentPage - 1) * pageSize;
  const page = filtered.slice(start, start + pageSize);

  if (page.length === 0) {
    studentsTbody.innerHTML = `
      <tr><td colspan="4" style="padding:18px;text-align:center;color:#777">No students found</td></tr>
    `;
    return;
  }

  studentsTbody.innerHTML = page
    .map(
      (s) => `
      <tr data-id="${clean(s.id)}">
        <td>${clean(s.id)}</td>
        <td>${clean(s.firstName)}</td>
        <td>${clean(s.lastName)}</td>
        <td>${clean(s.year)}</td>
      </tr>
    `
    )
    .join("");
}

function renderPagination() {
  const total = Math.ceil(filtered.length / pageSize);
  let html = "";

  html += `<button data-page="${Math.max(1, currentPage - 1)}">&laquo;</button>`;

  for (let p = 1; p <= total; p++) {
    html += `<button data-page="${p}" class="${p === currentPage ? "active" : ""}">${p}</button>`;
  }

  html += `<button data-page="${Math.min(total, currentPage + 1)}">&raquo;</button>`;

  pagination.innerHTML = html;
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();

  filtered = students.filter((s) => {
    const text = `${s.id} ${s.firstName} ${s.lastName} ${s.year}`.toLowerCase();
    return text.includes(q);
  });

  currentPage = 1;
  render();
});

pagination.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-page]");
  if (!btn) return;

  const page = Number(btn.dataset.page);
  currentPage = page;
  render();
});

studentsTbody.addEventListener("click", (e) => {
  const row = e.target.closest("tr[data-id]");
  if (!row) return;

  const id = row.dataset.id;
  if (id) {
    window.location.href = `./results.html?student=${encodeURIComponent(id)}`;
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "./teacher-dashboard.html";
});

loadStudents();
