const rowsPerPage = 7;
let currentPage = 1;
let currentStudent = null;
let allRows = [];
let filteredRows = [];

const filters = {
  session: "all",
  term: "all",
  subject: "all",
  search: "",
};

const urlParams = new URLSearchParams(window.location.search);
const studentIdParam = urlParams.get("studentId") || urlParams.get("id");
const isManageMode = Boolean(studentIdParam);

let pendingRowId = null;

function getStudentDisplayName(students, studentId) {
  const student = students.find((user) => user.id === studentId);
  if (!student) return null;
  return `${student.firstName} ${student.lastName}`.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.toggle("manage-results", isManageMode);

  // Set back link URL based on mode
  const backLink = document.getElementById("back-link");
  if (backLink) {
    if (isManageMode) {
      backLink.href = "select-user.html?mode=results&role=student";
      backLink.textContent = "Back to select student";
    } else {
      backLink.href = "student-dashboard.html";
      backLink.textContent = "Back to dashboard";
    }
  }

  if (studentIdParam) {
    const titleEl = document.querySelector("main h1");
    const subtitleEl = document.querySelector("main p");
    if (titleEl) titleEl.textContent = "Student Results";
    if (subtitleEl)
      subtitleEl.textContent = "Here are the results for the selected student";
  }

  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    filters.search = searchInput.value.trim();
    applyFilters();
  });

  document.getElementById("year-header").addEventListener("click", () => {
    filters.session = "all";
    applyFilters();
  });

  document.getElementById("term-header").addEventListener("click", () => {
    filters.term = "all";
    applyFilters();
  });

  document.getElementById("subject-header").addEventListener("click", () => {
    filters.subject = "all";
    applyFilters();
  });

  document.getElementById("results-body").addEventListener("click", (e) => {
    const actionBtn = e.target.closest("button[data-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      const rowId = actionBtn.dataset.rowId;

      if (action === "edit") {
        openEditModal(rowId);
      }
      if (action === "delete") {
        openDeleteModal(rowId);
      }

      return;
    }

    const yearCell = e.target.closest(".year-cell");
    if (yearCell) {
      filters.session = yearCell.dataset.session;
      applyFilters();
      return;
    }

    const termCell = e.target.closest(".term-cell");
    if (termCell) {
      filters.term = Number(termCell.dataset.term);
      applyFilters();
      return;
    }

    const subjectCell = e.target.closest(".subject-cell");
    if (subjectCell) {
      filters.subject = subjectCell.dataset.subject;
      applyFilters();
      return;
    }
  });

  Promise.all([fetch("../data/Results.json"), fetch("../data/Students.json")])
    .then(([resultsResponse, studentsResponse]) =>
      Promise.all([resultsResponse.json(), studentsResponse.json()])
    )
    .then(([resultsData, studentsData]) => {
      const currentStudentId = studentIdParam || "stu-101";
      const students = studentsData.users || [];
      const displayName = getStudentDisplayName(students, currentStudentId);
      const subtitleEl = document.querySelector("main p");

      if (subtitleEl && displayName) {
        subtitleEl.textContent = `Here are the results for ${displayName}`;
      } else if (subtitleEl && studentIdParam) {
        subtitleEl.textContent = `Here are the results for ${currentStudentId}`;
      }

      const studentRecords = resultsData.results.filter(
        (result) => result.studentId === currentStudentId
      );

      if (studentRecords.length === 0) {
        console.warn("Student not found");
        return;
      }

      const termMap = {
        "First Term": 1,
        "Second Term": 2,
        "Third Term": 3,
      };

      allRows = [];

      studentRecords.forEach((record) => {
        const year = record.session.split("/")[0];
        const termNumber = termMap[record.term] ?? record.term;

        record.subjects.forEach((subject) => {
          const rowId = `${record.session}|${termNumber}|${subject.name}`;
          allRows.push({
            id: rowId,
            year,
            session: record.session,
            term: termNumber,
            subject: subject.name,
            score: subject.score,
            grade: subject.grade,
            exam: "E1",
            outOf: 100,
          });
        });
      });

      filteredRows = allRows;
      renderPage(1);
    })
    .catch((error) => {
      console.error("Error loading Results.json", error);
    });
});

function renderPage(page) {
  const tbody = document.getElementById("results-body");
  tbody.innerHTML = "";
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const pageRows = filteredRows.slice(startIndex, endIndex);

  pageRows.forEach((row) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="col-year year-cell" data-session="${row.session}">${row.year}</td>
        <td class="col-term term-cell" data-term="${row.term}">${row.term}</td>
        <td class="col-subject subject-cell" data-subject="${row.subject}">${row.subject}</td>
        <td>${row.exam ?? "E1"}</td>
        <td class="col-result">${row.score}/${row.outOf ?? 100}</td>
        <td>${row.grade}</td>
        <td class="col-actions col-hidden">
          <div class="row-actions">
          <button type="button" class="edit-link" data-action="edit" data-row-id="${row.id}">Edit</button>
          <button type="button" class="delete-btn" data-action="delete" data-row-id="${row.id}">Delete</button>
          </div>
        </td>
        <td class="row-info">
          <button class="info-btn" type="button" data-action="edit" data-row-id="${row.id}">
            <img src="../public/icons/info.png" alt="Info">
          </button>
        </td>
      `;

    tbody.appendChild(tr);
  });

  currentPage = page;
  renderPagination(filteredRows.length);
}

function applyFilters() {
  filteredRows = allRows.filter((row) => {
    if (filters.session !== "all" && row.session !== filters.session)
      return false;
    if (filters.term !== "all" && row.term !== filters.term) return false;
    if (filters.subject !== "all" && row.subject !== filters.subject)
      return false;

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      const isGradeQuery = /[a-f]$/i.test(q);

      if (isGradeQuery) {
        if (row.grade.toLowerCase() !== q) return false;
      } else {
        const subjectMatch = row.subject.toLowerCase().includes(q);
        const gradeMatch = row.grade.toLowerCase().includes(q);
        const scoreMatch = String(row.score).includes(q);

        if (!subjectMatch && !gradeMatch && !scoreMatch) return false;
      }
    }

    return true;
  });

  renderPage(1);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const pagination = document.getElementById("pagination");

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

  const firstBtn = createIconButton(
    "../public/icons/chevron-double-left.png",
    () => renderPage(1)
  );
  firstBtn.disabled = currentPage === 1;
  pagination.appendChild(firstBtn);

  const prevBtn = createIconButton("../public/icons/chevron-left.png", () => {
    if (currentPage > 1) renderPage(currentPage - 1);
  });
  prevBtn.disabled = currentPage === 1;
  pagination.appendChild(prevBtn);

  const pages = new Set([1, 2, totalPages - 1, totalPages]);
  pages.add(currentPage);
  pages.add(currentPage - 1);
  pages.add(currentPage + 1);

  const sortedPages = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  let lastRendered = 0;
  for (const page of sortedPages) {
    if (lastRendered && page - lastRendered > 1) addEllipsis();
    addPageBtn(page);
    lastRendered = page;
  }

  const nextBtn = createIconButton("../public/icons/chevron-right.png", () => {
    if (currentPage < totalPages) renderPage(currentPage + 1);
  });
  nextBtn.disabled = currentPage === totalPages;
  pagination.appendChild(nextBtn);

  const lastBtn = createIconButton(
    "../public/icons/chevron-double-right.png",
    () => renderPage(totalPages)
  );
  lastBtn.disabled = currentPage === totalPages;
  pagination.appendChild(lastBtn);
}

function createIconButton(iconPath, onClick) {
  const btn = document.createElement("button");
  btn.className = "page-btn";
  btn.type = "button";

  const img = document.createElement("img");
  img.src = iconPath;
  img.alt = "";

  btn.appendChild(img);
  btn.addEventListener("click", onClick);

  return btn;
}

function openModal(modalEl) {
  modalEl.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modalEl) {
  modalEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function getRowById(rowId) {
  return allRows.find((row) => row.id === rowId) || null;
}

function openEditModal(rowId) {
  const editModal = document.getElementById("edit-modal");
  const row = getRowById(rowId);
  if (!editModal || !row) return;

  pendingRowId = rowId;

  document.getElementById("edit-year").value = row.year ?? "";
  document.getElementById("edit-term").value = row.term ?? "";
  document.getElementById("edit-subject").value = row.subject ?? "";
  document.getElementById("edit-exam").value = row.exam ?? "E1";
  document.getElementById("edit-result").value = `${row.score}/${row.outOf ?? 100}`;
  document.getElementById("edit-grade").value = row.grade ?? "";

  // Make inputs read-only when not in manage mode
  const inputs = editModal.querySelectorAll("input");
  const updateBtn = document.getElementById("update-btn");
  
  if (!isManageMode) {
    inputs.forEach(input => input.setAttribute("readonly", "readonly"));
    if (updateBtn) updateBtn.style.display = "none";
    editModal.querySelector(".modal-title").textContent = "Result Details";
  } else {
    inputs.forEach(input => input.removeAttribute("readonly"));
    if (updateBtn) updateBtn.style.display = "";
    editModal.querySelector(".modal-title").textContent = "Student Result Edit Overlay";
  }

  openModal(editModal);
}

function openDeleteModal(rowId) {
  if (!isManageMode) return;
  const deleteModal = document.getElementById("delete-modal");
  if (!deleteModal) return;
  pendingRowId = rowId;
  openModal(deleteModal);
}

function wireModals() {
  const editModal = document.getElementById("edit-modal");
  const deleteModal = document.getElementById("delete-modal");
  const editForm = document.getElementById("edit-form");
  const confirmDelete = document.getElementById("confirm-delete");

  const handleCloseClick = (e) => {
    if (!e.target.closest("[data-close]")) return;
    if (editModal && editModal.getAttribute("aria-hidden") === "false") closeModal(editModal);
    if (deleteModal && deleteModal.getAttribute("aria-hidden") === "false") closeModal(deleteModal);
    pendingRowId = null;
  };

  document.addEventListener("click", handleCloseClick);

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!pendingRowId) return;

      const row = getRowById(pendingRowId);
      if (!row) return;

      const yearVal = document.getElementById("edit-year").value.trim();
      const termVal = document.getElementById("edit-term").value.trim();
      const subjectVal = document.getElementById("edit-subject").value.trim();
      const examVal = document.getElementById("edit-exam").value.trim();
      const resultVal = document.getElementById("edit-result").value.trim();
      const gradeVal = document.getElementById("edit-grade").value.trim();

      const [scoreStr, outOfStr] = resultVal.split("/");
      const parsedScore = Number(scoreStr);
      const parsedOutOf = outOfStr ? Number(outOfStr) : row.outOf;

      if (yearVal) row.year = yearVal;
      if (termVal) row.term = Number(termVal) || termVal;
      if (subjectVal) row.subject = subjectVal;
      if (examVal) row.exam = examVal;
      if (!Number.isNaN(parsedScore)) row.score = parsedScore;
      if (parsedOutOf && !Number.isNaN(parsedOutOf)) row.outOf = parsedOutOf;
      if (gradeVal) row.grade = gradeVal;

      applyFilters();
      if (editModal) closeModal(editModal);
      pendingRowId = null;
    });
  }

  if (confirmDelete) {
    confirmDelete.addEventListener("click", () => {
      if (!pendingRowId) return;
      allRows = allRows.filter((row) => row.id !== pendingRowId);
      pendingRowId = null;
      applyFilters();
      if (deleteModal) closeModal(deleteModal);
    });
  }
}

wireModals();
