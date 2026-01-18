const resultsFile = "../data/Results.json";

/** @type {Array<{year:number, session:string, term:number|string, subject:string, exam:string, score:number, grade:string}>} */
const results = [];

/** @type {number|null} */
let activeIndex = null;

const body = document.getElementById("resultsBody");
const searchInput = document.getElementById("search");
const studentLabel = document.getElementById("studentLabel");
const addResultBtn = document.getElementById("addResultBtn");
const backBtn = document.getElementById("backBtn");

const editOverlay = document.getElementById("editOverlay");
const deleteOverlay = document.getElementById("deleteOverlay");

const editYear = document.getElementById("editYear");
const editTerm = document.getElementById("editTerm");
const editSubject = document.getElementById("editSubject");
const editExam = document.getElementById("editExam");
const editResult = document.getElementById("editResult");
const editGrade = document.getElementById("editGrade");

function escapeHtml(x = "") {
  return String(x)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function calcGrade(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  if (score >= 40) return "E";
  return "F";
}

function getStudentIdFromQuery() {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get("student")?.trim() || null;
  } catch {
    return null;
  }
}

function mapTerm(term) {
  const map = {
    "First Term": 1,
    "Second Term": 2,
    "Third Term": 3,
  };

  if (typeof term === "number") return term;
  return map[term] ?? term;
}

function matchesQuery(row, q) {
  if (!q) return true;
  const text =
    `${row.year} ${row.session} ${row.term} ${row.subject} ${row.exam} ${row.score} ${row.grade}`
      .toLowerCase()
      .trim();
  return text.includes(q);
}

function render() {
  if (!body) return;

  const q = (searchInput?.value || "").toLowerCase().trim();
  const rows = results
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => matchesQuery(r, q));

  if (rows.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="7" style="padding:18px;text-align:center;color:#777">No results found</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = rows
    .map(({ r, i }) => {
      const grade = calcGrade(r.score);
      return `
      <tr>
        <td>${escapeHtml(r.year)}</td>
        <td>${escapeHtml(r.term)}</td>
        <td>${escapeHtml(r.subject)}</td>
        <td>${escapeHtml(r.exam)}</td>
        <td>${escapeHtml(r.score)}/100</td>
        <td>${escapeHtml(grade)}</td>
        <td class="action-cell">
          <span class="link" onclick="openEdit(${i})">Edit</span>
          <button class="btn-delete" onclick="openDelete(${i})">Delete</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

function openEdit(i) {
  if (
    !editOverlay ||
    !editYear ||
    !editTerm ||
    !editSubject ||
    !editExam ||
    !editResult ||
    !editGrade
  )
    return;

  if (i === null || i === undefined || i < 0) {
    activeIndex = null;
    editYear.value = "";
    editTerm.value = "";
    editSubject.value = "";
    editExam.value = "";
    editResult.value = "";
    editGrade.value = "";
  } else {
    activeIndex = i;
    const r = results[i];
    if (!r) return;

    editYear.value = String(r.year ?? "");
    editTerm.value = String(r.term ?? "");
    editSubject.value = r.subject ?? "";
    editExam.value = r.exam ?? "";
    editResult.value = String(r.score ?? "");
    editGrade.value = calcGrade(Number(r.score));
  }

  editOverlay.classList.remove("hidden");
}

function closeEdit() {
  editOverlay?.classList.add("hidden");
}

function updateResult() {
  if (!editYear || !editTerm || !editSubject || !editExam || !editResult)
    return;

  const score = Number(editResult.value);
  if (!Number.isFinite(score) || score < 0 || score > 100) return;

  const yearInput = Number(editYear.value);
  const termInput = Number(editTerm.value);

  const next = {
    year: Number.isFinite(yearInput) ? yearInput : 0,
    session:
      Number.isFinite(yearInput) && yearInput > 0
        ? `${yearInput}/${yearInput + 1}`
        : activeIndex !== null && activeIndex !== undefined && activeIndex >= 0
          ? results[activeIndex]?.session || ""
          : "",
    term: Number.isFinite(termInput) ? termInput : editTerm.value.trim(),
    subject: editSubject.value.trim(),
    exam: editExam.value.trim() || "E1",
    score,
    grade: calcGrade(score),
  };

  if (activeIndex === null || activeIndex === undefined || activeIndex < 0) {
    results.unshift(next);
  } else {
    results[activeIndex] = { ...results[activeIndex], ...next };
  }

  closeEdit();
  render();
}

function openDelete(i) {
  activeIndex = i;
  deleteOverlay?.classList.remove("hidden");
}

function closeDelete() {
  deleteOverlay?.classList.add("hidden");
}

function confirmDelete() {
  if (activeIndex === null || activeIndex === undefined) return;
  results.splice(activeIndex, 1);
  closeDelete();
  render();
}

async function loadResults() {
  const studentId = getStudentIdFromQuery();
  if (studentLabel) studentLabel.textContent = studentId || "this student";

  let data = null;
  try {
    const res = await fetch(resultsFile);
    data = await res.json();
  } catch (err) {
    console.error("Error loading Results.json", err);
    render();
    return;
  }

  const list = Array.isArray(data?.results) ? data.results : [];
  const picked = studentId
    ? list.filter((r) => r.studentId === studentId)
    : list;

  results.length = 0;

  picked.forEach((record) => {
    const year = Number(String(record.session || "").split("/")[0]) || 0;
    const term = mapTerm(record.term);

    (record.subjects || []).forEach((s) => {
      results.push({
        year,
        session: record.session || "",
        term,
        subject: s.name || "",
        exam: "E1",
        score: Number(s.score) || 0,
        grade: s.grade || calcGrade(Number(s.score) || 0),
      });
    });
  });

  render();
}

if (editResult && editGrade) {
  editResult.addEventListener("input", () => {
    const score = Number(editResult.value);
    editGrade.value = Number.isFinite(score) ? calcGrade(score) : "";
  });
}

searchInput?.addEventListener("input", render);

addResultBtn?.addEventListener("click", () => {
  openEdit(-1);
});

backBtn?.addEventListener("click", () => {
  window.location.href = "./select-student.html";
});

window.openEdit = openEdit;
window.closeEdit = closeEdit;
window.updateResult = updateResult;
window.openDelete = openDelete;
window.closeDelete = closeDelete;
window.confirmDelete = confirmDelete;

loadResults();
