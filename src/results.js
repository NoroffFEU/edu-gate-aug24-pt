// results.js
const resultsFile = "/data/Results.json";
const studentsFile = "/data/Students.json";

const params = new URLSearchParams(location.search);
const studentId = params.get("student");

const studentTitle = document.getElementById("studentTitle");
const studentMeta = document.getElementById("studentMeta");
const resultsTbody = document.getElementById("resultsTbody");
const searchResult = document.getElementById("searchResult");

let allResults = [];
let studentRecord = null;
let studentInfo = null;

function escapeHtml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadData() {
  try {
    const [rRes, sRes] = await Promise.all([
      fetch(resultsFile),
      fetch(studentsFile),
    ]);
    const rJson = await rRes.json();
    const sJson = await sRes.json();

    allResults = Array.isArray(rJson.results)
      ? rJson.results
      : Array.isArray(rJson)
        ? rJson
        : rJson.results || [];
    const studentsList = Array.isArray(sJson.users)
      ? sJson.users
      : Array.isArray(sJson)
        ? sJson
        : sJson.users || [];

    // find student's results
    studentRecord = allResults.find(
      (r) => String(r.studentId) === String(studentId)
    );
    studentInfo = studentsList.find(
      (s) => (s.id ?? s.studentId) === studentId
    ) || { firstName: "", lastName: "", id: studentId };

    updateHeader();
    renderResults();
  } catch (e) {
    console.error("Failed to load results", e);
    studentTitle.textContent = "Student Results";
    studentMeta.textContent = "Failed to load data.";
  }
}

function updateHeader() {
  const name = studentInfo
    ? `${studentInfo.firstName || ""} ${studentInfo.lastName || ""}`.trim()
    : studentId;
  studentTitle.textContent = `Results — ${name || studentId}`;
  if (studentRecord) {
    studentMeta.textContent = `Term: ${studentRecord.term || ""} — Session: ${studentRecord.session || ""} — Avg: ${studentRecord.average ?? "-"} — Position: ${studentRecord.position ?? "-"}`;
  } else {
    studentMeta.textContent = `No results found for student ID ${studentId}`;
  }
}

function renderResults(filter = "") {
  resultsTbody.innerHTML = "";
  if (
    !studentRecord ||
    !Array.isArray(studentRecord.subjects) ||
    studentRecord.subjects.length === 0
  ) {
    resultsTbody.innerHTML = `<tr><td colspan="3" style="padding:18px;text-align:center;color:#777">No results available.</td></tr>`;
    return;
  }

  const q = (filter || "").toLowerCase().trim();
  const rows = studentRecord.subjects
    .filter((sub) => !q || (sub.name || "").toLowerCase().includes(q))
    .map(
      (sub) => `
      <tr>
        <td>${escapeHtml(sub.name)}</td>
        <td>${escapeHtml(String(sub.score))}</td>
        <td>${escapeHtml(sub.grade)}</td>
      </tr>
    `
    )
    .join("");

  resultsTbody.innerHTML =
    rows ||
    `<tr><td colspan="3" style="padding:18px;text-align:center;color:#777">No matching subjects.</td></tr>`;
}

searchResult?.addEventListener("input", (e) => renderResults(e.target.value));

loadData();
