const rowsPerPage = 7;
let currentPage = 1;
let users = [];
let filteredUsers = [];

const urlParams = new URLSearchParams(window.location.search);
const viewMode = urlParams.get("mode");
const roleFilter = urlParams.get("role");
const isResultsMode = viewMode === "results";

function applyModeUi() {
  if (!isResultsMode) return;

  document.body.classList.add("results-mode");

  const titleEl = document.getElementById("page-title");
  const subtitleEl = document.getElementById("page-subtitle");
  const addUserBtn = document.getElementById("add-user-btn");
  const actionHeader = document.getElementById("action-header");
  const backLink = document.getElementById("back-link");
  const resultsIcon = document.querySelector(".results-icon");
  const firstNameHeader = document.getElementById("first-name-header");
  const yearHeader = document.getElementById("year-header");
  const roleHeader = document.getElementById("role-header");
  const dobHeader = document.getElementById("dob-header");
  const idHeader = document.getElementById("id-header");
  const searchInput = document.getElementById("search-input");

  if (titleEl) titleEl.textContent = "Select Student";
  if (subtitleEl) subtitleEl.textContent = "Select student to view results";
  if (addUserBtn) addUserBtn.style.display = "none";
  if (actionHeader) actionHeader.classList.add("col-hidden");
  if (resultsIcon) resultsIcon.removeAttribute("hidden");
  if (searchInput) searchInput.placeholder = "Search for student...";
  if (backLink) {
    backLink.href = "teacher-dashboard.html";
    backLink.textContent = "Back to dashboard";
  }

  // Update table headers for results mode
  if (idHeader) idHeader.textContent = "Student ID";
  if (firstNameHeader) firstNameHeader.classList.remove("col-hidden");
  if (yearHeader) {
    yearHeader.textContent = "Year";
    yearHeader.classList.remove("col-hidden");
  }
  if (roleHeader) roleHeader.classList.add("col-hidden");
  if (dobHeader) dobHeader.classList.add("col-hidden");
}

async function loadTableData() {
    try {
        const [studentsData, teachersData] = await Promise.all([
            fetch("../data/Students.json"),
            fetch("../data/Teachers.json")
        ]);

        if (!studentsData.ok || !teachersData.ok) {
            throw new Error(`Fetch failed`)
        }

        const studentsJson = await studentsData.json();
        const teachersJson = await teachersData.json();

        const students = studentsJson.users || [];
        const teachers = teachersJson.users || [];

        users = [...students, ...teachers];

        if (roleFilter) {
          users = users.filter((user) => user.role === roleFilter);
        }

        filteredUsers = users;
        renderPage(1);
    } catch (error) {
        console.error("Failed to load table data:", error);
    }
}

function renderPage(page) {
    currentPage = page;

    const tableBody = document.getElementById("table-body");
    if (!tableBody) return;

    const start = (page - 1) * rowsPerPage;
    const pageUsers = filteredUsers.slice(start, start + rowsPerPage);

        tableBody.innerHTML = pageUsers.map((user) => {
          const editUrl =
            user.role === "student"
            ? "./manage-student.html?id=" + user.id
            : "./manage-teacher.html?id=" + user.id;

          const resultsUrl = `./my-results.html?studentId=${user.id}`;

          const actionCell = isResultsMode
            ? ""
            : `<div class="row-actions">
                <a href="${editUrl}" class="edit-link">Edit</a>
                <button 
                  type="button" 
                  class="delete-btn" 
                  data-id="${user.id}">Delete</button>
              </div>`;

          const actionColClass = isResultsMode ? "col-hidden col-actions" : "col-hidden col-actions";

          const infoCell = isResultsMode
            ? `<td class="row-info">
                <button class="info-btn" type="button" data-student-id="${user.id}">
                  <img src="../public/icons/info.png" alt="View results">
                </button>
              </td>`
            : `<td class="row-info"></td>`;

          const rowClickAttr = isResultsMode ? `data-student-id="${user.id}" data-results-url="${resultsUrl}"` : "";

          const firstNameClass = isResultsMode ? "col-first-name" : "col-first-name col-hidden";
          const yearClass = isResultsMode ? "col-year" : "col-year col-hidden";
          const roleClass = isResultsMode ? "col-role col-hidden" : "col-role";

          return `
            <tr ${rowClickAttr}>
              <td class="col-id">${user.id}</td>
              <td class="${firstNameClass}">${user.firstName}</td>
              <td>${user.lastName}</td>
              <td class="${yearClass}">2020</td>
              <td class="${roleClass}">${user.role}</td>
              <td class="col-dob col-hidden">01/01/2000</td>
              <td class="${actionColClass}">
                ${actionCell}
              </td>
              ${infoCell}
            </tr>
          `;
        }).join("");

    renderPagination(filteredUsers.length);    
}


function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
  
    pagination.innerHTML = "";
    if (totalPages <= 1) return;
  
    const addPageBtn = (page) => {
      const btn = document.createElement("button");
      btn.className = "page-btn";
      if (page === currentPage) btn.classList.add("active");
      btn.textContent = page;
      btn.addEventListener("click", () => renderPage(page));
      pagination.appendChild(btn);
    };
  
    const addEllipsis = () => {
      const span = document.createElement("span");
      span.className = "page-ellipsis";
      span.textContent = "…";
      pagination.appendChild(span);
    };
  
    const firstBtn = createIconButton("../public/icons/chevron-double-left.png", () => renderPage(1));
    firstBtn.disabled = currentPage === 1;
    pagination.appendChild(firstBtn);
  
    const prevBtn = createIconButton("../public/icons/chevron-left.png", () => {
      if (currentPage > 1) renderPage(currentPage - 1);
    });
    prevBtn.disabled = currentPage === 1;
    pagination.appendChild(prevBtn);
  


    addPageBtn(1);

    if (currentPage > 2) addEllipsis();

    if (currentPage !== 1 && currentPage !== totalPages) {
      addPageBtn(currentPage);
    }

    if (currentPage < totalPages - 1) addEllipsis();

    if (totalPages > 1) addPageBtn(totalPages);
  
    const nextBtn = createIconButton("../public/icons/chevron-right.png", () => {
      if (currentPage < totalPages) renderPage(currentPage + 1);
    });
    nextBtn.disabled = currentPage === totalPages;
    pagination.appendChild(nextBtn);
  
    const lastBtn = createIconButton("../public/icons/chevron-double-right.png", () => renderPage(totalPages));
    lastBtn.disabled = currentPage === totalPages;
    pagination.appendChild(lastBtn);
  };

  function createIconButton(iconPath, onClick) {
    const btn = document.createElement("button");
    btn.type = "button"; 
    btn.className = "page-btn";
  
    const img = document.createElement("img");
    img.src = iconPath;
    img.alt = "";
  
    btn.appendChild(img);
    btn.addEventListener("click", onClick);
  
    return btn;
  };  
  
applyModeUi();
loadTableData();


const deletModal = document.getElementById("delete-modal");
const confirmDelete = document.getElementById("confirm-delete");

let pendingDeleteId = null;

function openDeleteModal(userId) {
  pendingDeleteId = userId;

  deletModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  confirmDelete.addEventListener("click", () => {
    if(!pendingDeleteId) return;

    users = users.filter(i => i.id !== pendingDeleteId);

    closeDeleteModal();
    renderPage(currentPage);
  })
}

function closeDeleteModal() {
  pendingDeleteId = null;

  deletModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;

  openDeleteModal(btn.dataset.id);
});

deletModal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeDeleteModal();
});


const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

function performSearch() {
  const query = searchInput.value.trim().toLowerCase();

  filteredUsers = users.filter(user =>
    user.id.toLowerCase().includes(query) ||
    user.firstName.toLowerCase().includes(query) ||
    user.lastName.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  );

  currentPage = 1;
  renderPage(1);
}

searchButton.addEventListener("click", performSearch);

// Handle row clicks and info button clicks in results mode
if (isResultsMode) {
  document.getElementById("table-body").addEventListener("click", (e) => {
    // Handle info button click
    const infoBtn = e.target.closest(".info-btn");
    if (infoBtn) {
      const studentId = infoBtn.dataset.studentId;
      if (studentId) {
        window.location.href = `./my-results.html?studentId=${studentId}`;
      }
      return;
    }

    // Handle row click (not on buttons)
    const row = e.target.closest("tr[data-student-id]");
    if (row && !e.target.closest("button")) {
      const resultsUrl = row.dataset.resultsUrl;
      if (resultsUrl) {
        window.location.href = resultsUrl;
      }
    }
  });
}



